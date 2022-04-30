import React, { ReactElement } from 'react'
import { NextPage } from 'next'
import layout from '../../src/components/_commons/layout';
import Settings from '../../src/components/Settings'

const SettingPage: NextPage=(): ReactElement=>{
  return <Settings/>
}
export default layout(SettingPage)