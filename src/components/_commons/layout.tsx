import { ReactElement, FunctionComponent } from "react"
import Footer from './footer'
import Header from "./header"

const Layout=(Page: FunctionComponent)=>(): ReactElement=>{
  return(
    <>
      <Header/>
      <Page/>
      <Footer/>
    </>
  )
}
export default Layout
