import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import { createTheme, ThemeProvider } from "@material-ui/core/styles"
import { IconButton, CssBaseline } from "@material-ui/core"
import Brightness4Icon from '@material-ui/icons/Brightness4';
import NextNProgress from "nextjs-progressbar";
import client from '../src/client'
import { useRouter } from 'next/router';
import authenticate from './../src/utils/authenticate';
import "./style.css"

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  
  useEffect(()=>{
    const authUser = async(): Promise<void> =>{
      let isAuth: boolean = await authenticate()
      if(!isAuth && router.asPath!=='/signin') router.push('/signin')
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
        'Trebuchet MS',
        'Verdana'
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
          <Component {...pageProps} />
        </ThemeProvider>      
      </ApolloProvider>  
    </>
  )
}

export default MyApp
