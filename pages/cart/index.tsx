import { ReactElement, useEffect} from 'react';
import { NextPage } from 'next';
import layout from '../../src/components/_commons/layout';
import ShoppingCart from './../../src/components/ShoppingCart';

const Cart: NextPage = (): ReactElement=> {
  return <ShoppingCart/>
}
export default layout(Cart)
