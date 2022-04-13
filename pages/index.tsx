import { ReactElement, useEffect} from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';


const RootPage: NextPage = (): ReactElement=> {
  const router = useRouter()
  useEffect(()=>{
    router.push('/shop')
  },[])
  return null
}
export default RootPage
