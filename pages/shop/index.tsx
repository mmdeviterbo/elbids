import { ReactElement } from "react";
import Shop from "../../src/components/Shop";
import { NextPage } from 'next';
import layout from '../../src/components/_commons/layout';

const ShopPage:NextPage=():ReactElement=>{
  return <Shop/>
}
export default layout(ShopPage)