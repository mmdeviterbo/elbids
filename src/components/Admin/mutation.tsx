import { gql } from '@apollo/client';
export default gql`
  mutation(
    $email: String
    $status: String
  ){
    updateOneUser(
      email:$email
      status:$status
    ){
      _id
    }
  }


`