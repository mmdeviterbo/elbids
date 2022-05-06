import { gql } from '@apollo/client';

const userQuery = gql`
  query($email: String){
    user: findOneUser(email: $email){
      _id
      email
      imageUrl
      full_name
      first_name
      last_name
      status
      admin
      banned
    }
  }   
`
export{
  userQuery,
}