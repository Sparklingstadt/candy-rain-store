import { test } from "node:test"
import assert from "node:assert/strict"
import { cartQuantity, checkoutAddress, variantId } from "./validation"
import { shopifyDomain } from "./config"

test("Shopify variant IDs remain strings and reject local IDs and other resources", () => {
  assert.equal(variantId("gid://shopify/ProductVariant/67605793079548"), "gid://shopify/ProductVariant/67605793079548")
  for (const bad of [0, "0", null, "gid://shopify/Product/123", "https://evil.example"]) assert.throws(() => variantId(bad))
})
test("quantity rejects zero, negatives, decimals, coercion and excessive purchases", () => {
  for (const bad of ["0", "-1", "1.5", "100", "1e1", "", " ", null]) assert.throws(() => cartQuantity(bad))
  assert.equal(cartQuantity("1"), 1)
  assert.equal(cartQuantity("99"), 99)
})
test("checkout redirects only to HTTPS checkout hosts without userinfo", () => {
  const domain = "spwgc6-w1.myshopify.com"
  assert.equal(checkoutAddress(`https://${domain}/cart/c/test`, domain), `https://${domain}/cart/c/test`)
  for (const bad of ["javascript:alert(1)", `http://${domain}/`, `https://${domain}.evil.example/`, `https://user@${domain}/`, `https://${domain}:444/`, "https://evil.example/"]) assert.throws(() => checkoutAddress(bad, domain))
})
test("store domain rejects paths, credentials and unrelated endpoints", () => {
  const before = process.env.SHOPIFY_STORE_DOMAIN
  try {
    for (const bad of ["", "localhost", "https://store.myshopify.com", "store.myshopify.com/", "store.myshopify.com.evil.example"]) {
      process.env.SHOPIFY_STORE_DOMAIN = bad
      assert.throws(() => shopifyDomain())
    }
  } finally {
    if (before === undefined) delete process.env.SHOPIFY_STORE_DOMAIN
    else process.env.SHOPIFY_STORE_DOMAIN = before
  }
})
