import bcrypt from 'bcryptjs'
const generatePassword =  async(
    email:string,
    password: string
  ): Promise<string>=>{
  const hashPasswordPattern: string = "1012*" + '' + email + ''  + 'zZ*1@8bfG' + '' + password
  return await bcrypt.hash(hashPasswordPattern, 10)
}
export default generatePassword