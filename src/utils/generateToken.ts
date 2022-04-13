import bcrypt from 'bcryptjs'
const generateToken =  async(
    email:string,
    full_name: string
  ): Promise<string>=>{
  const namesToken: string = email + '' + full_name + '19981012*'
  return await bcrypt.hash(namesToken, 10)
}
export default generateToken