import type { NextRequest } from 'next/server'
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  let isAuth: boolean = false

  try{
    const { currentUser } = req.cookies
    const {email, full_name, token} = JSON.parse(currentUser)
    const namesToken: string = email + '' + full_name + '19981012*'
    isAuth = await bcrypt.compare(namesToken, token)
  }catch(err){
    isAuth = false
  }

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