import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import { createTheme, ThemeProvider } from "@material-ui/core/styles"
import { CssBaseline } from "@material-ui/core"
import NextNProgress from "nextjs-progressbar";
import client from '../src/client'
import { useRouter } from 'next/router';
import authenticate from './../src/utils/authenticate';
import "./style.css"
import "./chatStyle.css"

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [loader, setLoader]=useState<boolean>(true)

  useEffect(()=>{
    const authUser = async(): Promise<void> =>{
      let isAuth: boolean = await authenticate()
      if(!isAuth && router.asPath!=='/signin') router.replace('/signin')
      else setLoader(false)
    }
    authUser()
  },[router])

  const themeApp = createTheme({
    palette: {
      background: {
        default: "#fcfcfc"
      }
    },
    typography: {
      fontFamily: [
        'IBM Plex Sans',
        'sans-serif'
      ].join(",")
    }
  });

  return (
    <>
      <Head>
        <title>ElBids</title>
      </Head>
      <ApolloProvider client={client}>
        <ThemeProvider theme={themeApp}>
          <CssBaseline/>
          <NextNProgress options={{ easing: 'ease', speed: 500 }}/>
          {!loader && <Component {...pageProps} />}
        </ThemeProvider>      
      </ApolloProvider>  
    </>
  )
}

export default MyApp
