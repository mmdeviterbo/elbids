import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import getUser from './getUser'
import { CookieArgs } from './../types'

const Header=()=>{
  const router = useRouter()
  const [title, setTitle]=useState('')
  const user: CookieArgs = getUser()

  useEffect(()=>{
    if(router?.asPath === "/shop") setTitle('')
    else if(router?.asPath?.includes("/shop/item/")) setTitle('Item')
    
    else if(router?.asPath === "/cart") setTitle('Cart')
    else if(router?.asPath === `/${user?.email?.split("@")[0]}`) setTitle('Settings')
    else if(router?.asPath === `/${user?.email?.split("@")[0]}/admin`) setTitle('Admin')
  
  },[router.asPath])

  return(
    <Head>
      {title? 
        <title>{`${title} | ElBids`}</title>
        :
        <title>ElBids</title>
      }
      <link rel="shortcut icon" href="/assets/logo.ico" />
    </Head>  
  )
}

export default Header