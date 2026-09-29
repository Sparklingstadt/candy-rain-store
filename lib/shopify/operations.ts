const productFields = `
  id handle title description productType availableForSale
  featuredImage { url altText }
  priceRange { minVariantPrice { amount currencyCode } }
`
const variantFields = `id title availableForSale price { amount currencyCode } image { url altText }`
const cartFields = `
  id checkoutUrl totalQuantity
  cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
  lines(first: 250) {
    nodes { id quantity cost { totalAmount { amount currencyCode } }
      merchandise { ... on ProductVariant { ${variantFields} product { title handle } } }
    }
    pageInfo { hasNextPage }
  }
`
export const PRODUCTS = `query CandyRainProducts($after: String) {
  products(first: 24, after: $after) { nodes { ${productFields} } pageInfo { hasNextPage endCursor } }
}`
export const PRODUCT = `query CandyRainProduct($handle: String!, $after: String) {
  product(handle: $handle) { ${productFields}
    images(first: 250) { nodes { url altText } }
    variants(first: 100, after: $after) { nodes { ${variantFields} } pageInfo { hasNextPage endCursor } }
  }
}`
export const CART = `query CandyRainCart($id: ID!) { cart(id: $id) { ${cartFields} } }`
export const CART_CREATE = `mutation CandyRainCartCreate($input: CartInput!) {
  cartCreate(input: $input) { cart { ${cartFields} } userErrors { field message code } warnings { code message } }
}`
export const CART_ADD = `mutation CandyRainCartAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${cartFields} } userErrors { field message code } warnings { code message } }
}`
export const CART_UPDATE = `mutation CandyRainCartUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${cartFields} } userErrors { field message code } warnings { code message } }
}`
export const CART_REMOVE = `mutation CandyRainCartRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${cartFields} } userErrors { field message code } warnings { code message } }
}`
