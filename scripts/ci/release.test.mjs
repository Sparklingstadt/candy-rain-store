import assert from "node:assert/strict"
import { test } from "node:test"
import { planRelease, publishRelease } from "./release.mjs"

test("first release starts at v0.0.1", () => {
  assert.deepEqual(planRelease([], [], "new"), { tag: "v0.0.1", create: true })
})
test("increments the highest stable version numerically, ignoring unrelated tags", () => {
  const tags = ["v0.9.9", "v0.10.2", "v0.10.1", "v2.0.0-beta.1", "archive"].map(name => ({ name, sha: "old" }))
  assert.deepEqual(planRelease(tags, [], "new"), { tag: "v0.10.3", create: true })
})
test("retry reuses an already published release for the same SHA", () => {
  assert.deepEqual(planRelease([{ name: "v0.9.1", sha: "same" }],
    [{ tag_name: "v0.9.1", draft: false, prerelease: false }], "same"), { tag: "v0.9.1", create: false })
})
test("recovers a tag created before a failed release publication", () => {
  assert.deepEqual(planRelease([{ name: "v0.9.1", sha: "same" }], [], "same"), { tag: "v0.9.1", create: true })
})
test("does not publish over an existing draft or prerelease", () => {
  for (const flags of [{ draft: true }, { prerelease: true }]) {
    assert.throws(() => planRelease([{ name: "v0.9.1", sha: "same" }],
      [{ tag_name: "v0.9.1", ...flags }], "same"), /Refusing/)
  }
})
test("publication rejects PR and manual events before any external command", () => {
  const original = process.env.GITHUB_EVENT_NAME
  try {
    for (const event of ["pull_request", "workflow_dispatch"]) {
      process.env.GITHUB_EVENT_NAME = event
      assert.throws(publishRelease, /main push/)
    }
  } finally {
    if (original === undefined) delete process.env.GITHUB_EVENT_NAME
    else process.env.GITHUB_EVENT_NAME = original
  }
})
