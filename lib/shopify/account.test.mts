import assert from "node:assert/strict"
import { test } from "node:test"
import { customerAccountUrl } from "./account"

test("customer account links use only trusted Shopify roots", () => {
  const original = { url: process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL, domain: process.env.SHOPIFY_STORE_DOMAIN }
  try {
    process.env.SHOPIFY_STORE_DOMAIN = "candy-rain-test.myshopify.com"
    delete process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL
    assert.equal(customerAccountUrl("addresses"), "https://candy-rain-test.myshopify.com/account/addresses")
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL = "https://shopify.com/12345/account/"
    assert.equal(customerAccountUrl("profile"), "https://shopify.com/12345/account/profile?locale=ja")
    assert.equal(customerAccountUrl("addresses"), customerAccountUrl("profile"))
    assert.equal(customerAccountUrl(), "https://shopify.com/12345/account?locale=ja")
    for (const value of ["https://evil.test/123/account", "http://shopify.com/123/account", "https://shopify.com/123/account?next=evil", "https://shopify.com/123/account#evil", "https://user:pass@shopify.com/123/account", "https://shopify.com/abc/account", "https://shopify.com:444/123/account"]) {
      process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL = value
      assert.throws(() => customerAccountUrl())
    }
  } finally {
    if (original.url === undefined) delete process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL
    else process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL = original.url
    if (original.domain === undefined) delete process.env.SHOPIFY_STORE_DOMAIN
    else process.env.SHOPIFY_STORE_DOMAIN = original.domain
  }
})
