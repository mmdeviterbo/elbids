import React, { ReactElement } from 'react'
import { NextPage } from 'next';
import Admin from '../../src/components/Admin';
import layout from '../../src/components/_commons/layout';

const AdminPage: NextPage=(): ReactElement=>{
  return <Admin/>
}
export default layout(AdminPage)