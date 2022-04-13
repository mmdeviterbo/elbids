import bcrypt from 'bcryptjs'
import getUser from './getUser'
import { CookieArgs } from './../types/index';

const authenticate =async(): Promise<boolean>=>{
  let isValid: boolean = false
  try{
    const user: CookieArgs  = getUser()
    const { email, full_name, token } = user
    const namesToken: string = email + '' + full_name + '19981012*'
    isValid = await bcrypt.compare(namesToken, token)
  }catch(err){
    isValid = false
  }
  return isValid
}
export default authenticate
