import { ReactElement, useEffect} from 'react';
import { NextPage } from 'next';
import {useRouter} from 'next/router'
import authenticate from './../src/utils/authenticate';


const RootPage: NextPage = (): ReactElement=> {
  const router = useRouter()
  useEffect(()=>{
    const authenticateUser=async(): Promise<void>=>{
      const isValid: boolean = await authenticate()
      if(isValid && router.asPath==='/') router.push('/shop')
    }
    authenticateUser()
  },[])
  return null
}
export default RootPage
