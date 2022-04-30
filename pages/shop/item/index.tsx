import { ReactElement } from "react";
import layout from "../../../src/components/_commons/layout";
import ViewPost from '../../../src/components/Shop/ViewPost'
import { NextPage } from 'next';

const ItemPostPage:NextPage=():ReactElement=>{
  return <ViewPost/>
}
export default layout(ItemPostPage)