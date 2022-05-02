import Cookies from 'js-cookie'
import { CookieArgs } from './../types/index';
export default function getUser(): CookieArgs{
  let result: CookieArgs
  try{
    result = JSON.parse(Cookies.get('currentUser') || "{}")
  }catch(err){
    result = null
  }
  return result
} 
