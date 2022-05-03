import { ReactElement } from "react";
import Shop from "../../src/components/Shop";
import client from '../../src/client'
import { postsQuery } from "../../src/components/Shop/GridItems/query";
import { Post } from './../../src/types/index';
import Header from "../../src/components/_commons/header";
import Footer from "../../src/components/_commons/footer";

const ShopPage=({postsProp}: {postsProp?: Post[]}):ReactElement=>{
  return (
    <>
      <Header/>
      <Shop postsProp={postsProp}/>
      <Footer/>
    </>
  )
}
export default ShopPage

export const getStaticProps=async()=>{
  const posts = await client.query({ query: postsQuery, canonizeResults: true })
  return {
    props: { postsProp: posts?.data?.findManyPosts },
    revalidate: 1,
  }
}