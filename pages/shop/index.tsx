import { ReactElement } from "react";
import Shop from "../../src/components/Shop";
import layout from "../../src/components/_commons/layout";
import { NextPage } from 'next';

const ShopPage:NextPage=():ReactElement=>{
  return <Shop/>
}
export default layout(ShopPage)