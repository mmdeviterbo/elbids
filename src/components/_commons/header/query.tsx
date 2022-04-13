import { gql } from '@apollo/client';

const userQuery = gql`
  query($email: String){
    user: findOneUser(email: $email){
      _id
      status
      imageUrl
      admin
      full_name
    }
  }   
`
export default userQuery