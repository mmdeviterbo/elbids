import { gql } from '@apollo/client';

const userQuery = gql`
  query($email: String){
    user: findOneUser(email: $email){
      _id
      status
      email
      full_name
      token
    }
  }   
`
export default userQuery