import React, { useState } from 'react'
import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import { createTheme, ThemeProvider } from "@material-ui/core/styles"
import { IconButton, CssBaseline } from "@material-ui/core"
import Brightness4Icon from '@material-ui/icons/Brightness4';
import NextNProgress from "nextjs-progressbar";
import client from '../src/client'
import "./style.css"

function MyApp({ Component, pageProps }) {
  const [light, setLight] = useState(true)
  
  const themeLight = createTheme({
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
  
  const themeDark = createTheme({
    palette: {
      background: {
        default: "#222222"
      },
      text: {
        primary: "#ffffff"
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
        <ThemeProvider theme={light ? themeLight : themeDark}>
          <CssBaseline/>
          <NextNProgress options={{ easing: 'ease', speed: 500 }}/>
          <IconButton 
              aria-label="toggle-theme"
              onClick={() => setLight(prev => !prev)} 
              style={{position:'fixed', left:0, bottom:0, zIndex:999}}
              >
              <Brightness4Icon fontSize={'large'}/>
          </IconButton>
          <Component {...pageProps} />
        </ThemeProvider>      
      </ApolloProvider>  
    </>
  )
}

export default MyApp
