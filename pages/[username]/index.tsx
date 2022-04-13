import React, {useState, useEffect, ReactElement} from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router';
import layout from '../../src/components/_commons/layout';

const Profile: NextPage=(): ReactElement=>{
  const router = useRouter()
  const { username } = router.query

  return(
    <>
      <h1>Profile ...</h1>
      <h1>dsadashddhdgda test</h1>
      {username && <h1>{username}</h1>}
    </>
  )
}
export default layout(Profile)