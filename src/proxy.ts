import { NextRequest, NextResponse } from "next/server";
import {getToken} from "next-auth/jwt"



export async function proxy(req: NextRequest) {
    const {pathname} = req.nextUrl
    console.log(pathname)
    const publicRoutes = ["/auth/login", "/auth/register", "/auth/verify", "/auth/verify-phone", "/api/auth", "/favicon.ico", "/_next"]
    if(publicRoutes.some((path) => pathname.startsWith(path))){
        return NextResponse.next()
    }

    const token = await getToken({req, secret: process.env.AUTH_SECRET})
    console.log(token)
    console.log(req.url)

    if (!token) {
        const loginUrl = new URL("/auth/login", req.url)
        loginUrl.searchParams.set("callbackUrl", req.url)
        console.log(loginUrl)

        return NextResponse.redirect(loginUrl)

    }


    return NextResponse.next()

}


export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}


