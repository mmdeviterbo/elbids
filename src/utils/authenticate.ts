import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server';

const authenticate =async(req: NextRequest): Promise<boolean>=>{
  let isValid: boolean = false
  try{
    const { currentUser } = req.cookies
    const {email, full_name, token} = JSON.parse(currentUser)
    const namesToken: string = email + '' + full_name + '19981012*'
    isValid = await bcrypt.compare(namesToken, token)
  }catch(err){
    isValid = false
  }
  return isValid
}
export default authenticate
