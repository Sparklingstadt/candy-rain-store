import { auth } from "@/auth"
import { isShopifyEnabled } from "@/lib/shopify/config"
import { NextResponse, type NextRequest } from "next/server"

const demoProxy = auth((req) => {
  if(!req.auth && req.nextUrl.pathname !== "/signin") {
    const newUrl = new URL("/signin", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg)$).*)"],
}

export function proxy(request: NextRequest, event: Parameters<typeof demoProxy>[1]) {
  if (isShopifyEnabled()) {
    if (request.nextUrl.pathname === "/signin" || request.nextUrl.pathname === "/signout" || request.nextUrl.pathname.startsWith("/account/") || request.nextUrl.pathname.startsWith("/orders/")) return NextResponse.redirect(new URL("/account", request.url))
    return NextResponse.next()
  }
  return demoProxy(request, event)
}
