import type { NextRequest } from 'next/server'
import { NextResponse } from "next/server";
import authenticate from '../src/utils/authenticate';

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const isAuth: boolean = await authenticate(req)

  //is there active/valid user?
  if(!isAuth) {
    url.pathname = '/signin'
    return NextResponse.rewrite(url)
  }

  //if active/valid user, then user entered /signin path
  else if(isAuth && url.pathname === '/signin'){
    url.pathname = '/shop'
    return NextResponse.rewrite(url)
  }
  return NextResponse.next()
}