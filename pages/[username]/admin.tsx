import React, { ReactElement } from 'react'
import { NextPage } from 'next';
import AdminVerify from '../../src/components/Admin';
import layout from '../../src/components/_commons/layout';


const VerifyAdmin: NextPage=(): ReactElement=>{
  return <AdminVerify/>
}
export default layout(VerifyAdmin)