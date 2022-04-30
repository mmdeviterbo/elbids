import { gql } from '@apollo/client';
export default gql`
  mutation(
    $email: String
    $status: String
    $banned: Boolean
    $admin: Boolean
  ){
    updateOneUser(
      email:$email
      status:$status
      banned:$banned
      admin:$admin
    ){
      _id
    }
  }


`