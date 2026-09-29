// Test-process-only transport. Application code contains no mock endpoint or bypass.
if (process.env.SHOPIFY_STORE_DOMAIN !== 'candy-rain-test.myshopify.com') throw new Error('Test store required')
const originalFetch = globalThis.fetch
const carts = new Map()
const money = amount => ({ amount: String(amount), currencyCode: 'JPY' })
const variants = [
  { id: 'gid://shopify/ProductVariant/1', title: 'A', price: money(500), availableForSale: true, image: null },
  { id: 'gid://shopify/ProductVariant/2', title: 'B', price: money(800), availableForSale: false, image: null },
]
const product = {
  id: 'gid://shopify/Product/1', handle: 'テスト缶バッジ', title: 'テスト缶バッジ', description: 'バリエーションを選べるグッズです。', productType: 'グッズ', availableForSale: true, featuredImage: null,
  priceRange: { minVariantPrice: money(500) }, variants: { nodes: variants, pageInfo: { hasNextPage: false, endCursor: null } },
}
function recalculate(cart) {
  cart.totalQuantity = cart.lines.nodes.reduce((sum, line) => sum + line.quantity, 0)
  cart.cost = { subtotalAmount: money(cart.totalQuantity * 500), totalAmount: money(cart.totalQuantity * 500) }
  for (const line of cart.lines.nodes) line.cost = { totalAmount: money(line.quantity * 500) }
  return cart
}
globalThis.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  if (!url.startsWith('https://candy-rain-test.myshopify.com/api/')) return originalFetch(input, init)
  const { query, variables: v } = JSON.parse(init.body)
  const json = value => Response.json(value)
  if (query.includes('query CandyRainProducts')) {
    if (v.after === 'error') return json({ errors: [{ message: 'upstream secret details' }] })
    return json({ data: { products: { nodes: v.after === 'empty' ? [] : [product], pageInfo: { hasNextPage: !v.after, endCursor: 'page2' } } } })
  }
  if (query.includes('query CandyRainProduct(')) return json({ data: { product: ['badge', product.handle].includes(v.handle) ? product : null } })
  if (query.includes('query CandyRainCart(')) return json({ data: { cart: carts.get(v.id) ?? null } })
  let field, cart
  if (query.includes('mutation CandyRainCartCreate')) {
    field = 'cartCreate'
    const key = `gid://shopify/Cart/test-${crypto.randomUUID()}?key=TEST_CART_SECRET`
    cart = { id: key, checkoutUrl: 'https://candy-rain-test.myshopify.com/cart/c/test-checkout', totalQuantity: 0, lines: { nodes: [], pageInfo: { hasNextPage: false } } }
  } else {
    cart = carts.get(v.cartId)
    field = query.includes('CandyRainCartAdd') ? 'cartLinesAdd' : query.includes('CandyRainCartUpdate') ? 'cartLinesUpdate' : 'cartLinesRemove'
  }
  if (!cart) return json({ data: { [field]: { cart: null, userErrors: [{ message: 'Cart missing' }], warnings: [] } } })
  const lines = v.input?.lines ?? v.lines ?? []
  if (lines.some(line => line.quantity === 13 || line.merchandiseId === variants[1].id)) return json({ data: { [field]: { cart: null, userErrors: [{ message: 'Not enough stock' }], warnings: [] } } })
  let warnings = []
  for (const line of lines) {
    let quantity = line.quantity
    if (quantity === 14) { quantity = 3; warnings = [{ code: 'MERCHANDISE_NOT_ENOUGH_STOCK', message: 'Adjusted' }] }
    if (field === 'cartLinesUpdate') {
      const existing = cart.lines.nodes.find(item => item.id === line.id)
      if (existing) existing.quantity = quantity
    } else {
      const existing = cart.lines.nodes.find(item => item.merchandise.id === line.merchandiseId)
      if (existing) existing.quantity += quantity
      else cart.lines.nodes.push({ id: 'gid://shopify/CartLine/line1', quantity, merchandise: { ...variants[0], product: { title: product.title, handle: product.handle } } })
    }
  }
  if (field === 'cartLinesRemove') cart.lines.nodes = cart.lines.nodes.filter(line => !v.lineIds.includes(line.id))
  recalculate(cart); carts.set(cart.id, cart)
  return json({ data: { [field]: { cart, userErrors: [], warnings } } })
}
