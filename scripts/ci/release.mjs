import { execFileSync } from "node:child_process"
import { pathToFileURL } from "node:url"

const version = /^v(\d+)\.(\d+)\.(\d+)$/

export function planRelease(tags, releases, sha) {
  const versions = tags.filter(tag => version.test(tag.name)).map(tag => ({
    ...tag, parts: tag.name.match(version).slice(1).map(Number),
  })).sort((a, b) => b.parts[0] - a.parts[0] || b.parts[1] - a.parts[1] || b.parts[2] - a.parts[2])
  const existing = versions.find(tag => tag.sha === sha)
  if (existing) {
    const release = releases.find(item => item.tag_name === existing.name)
    if (release?.draft || release?.prerelease) throw new Error("Refusing to replace a draft or prerelease")
    return { tag: existing.name, create: !release }
  }
  const [major, minor, patch] = versions[0]?.parts ?? [0, 0, 0]
  return { tag: `v${major}.${minor}.${patch + 1}`, create: true }
}

function run(command, args) {
  return execFileSync(command, args, { encoding: "utf8" }).trim()
}

export function publishRelease() {
  const { GITHUB_EVENT_NAME, GITHUB_REF, GITHUB_SHA: sha, GITHUB_REPOSITORY: repo } = process.env
  if (GITHUB_EVENT_NAME !== "push" || GITHUB_REF !== "refs/heads/main") {
    throw new Error("Releases require a main push")
  }
  if (!sha || !repo || run("git", ["rev-parse", "HEAD"]) !== sha) {
    throw new Error("Checkout must match the verified workflow SHA")
  }
  const getTags = () => JSON.parse(run("gh", ["api", `repos/${repo}/tags`, "--paginate", "--slurp"]))
    .flat().map(tag => ({ name: tag.name, sha: tag.commit.sha }))
  const tags = getTags()
  // Fail closed on API errors; a failed lookup must never mean 'no release'.
  const releases = JSON.parse(run("gh", ["api", `repos/${repo}/releases`, "--paginate", "--slurp"])).flat()
  const plan = planRelease(tags, releases, sha)
  if (plan.create) {
    run("gh", ["release", "create", plan.tag, "--repo", repo, "--target", sha,
      "--title", plan.tag, "--generate-notes"])
  }
  if (getTags().find(tag => tag.name === plan.tag)?.sha !== sha) {
    throw new Error("Release tag does not match the verified SHA")
  }
  const release = JSON.parse(run("gh", ["release", "view", plan.tag, "--repo", repo,
    "--json", "url,isDraft,isPrerelease"]))
  if (release.isDraft || release.isPrerelease) throw new Error("Release is not published as stable")
  console.log(`${plan.create ? "Published" : "Reused"} ${release.url} at ${sha}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) publishRelease()
