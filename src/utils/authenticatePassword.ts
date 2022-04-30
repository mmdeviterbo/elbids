import bcrypt from 'bcryptjs'
import getUser from './getUser'
import { CookieArgs } from './../types/index';

//authenticate if signin using password
const authenticatePassword =async(
  hashPassword: string,
  email: string,
  password: string
): Promise<boolean>=>{
  let isValid: boolean = false
  try{
    const hashPasswordPattern: string = "1012*" + '' + email + ''  + 'zZ*1@8bfG' + '' + password
    isValid = await bcrypt.compare(hashPasswordPattern, hashPassword)
  }catch(err){
    isValid = false
  }
  return isValid
}
export default authenticatePassword
