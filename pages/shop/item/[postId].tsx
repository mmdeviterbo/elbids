import { ReactElement } from "react";
import { NextPage } from 'next';
import ViewPost from '../../../src/components/Shop/ViewPost'
import layout from "../../../src/components/_commons/layout";

const ItemPost:NextPage=():ReactElement=>{
  return <ViewPost/>
}
export default layout(ItemPost)