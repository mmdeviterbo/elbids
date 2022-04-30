import { gql } from '@apollo/client';
export default gql`
  mutation(
    $email: String
    $status: String
    $id: ID
  ){
    updateOneUser(
      email:$email
      status:$status
      id:$id
    ){
      _id
      status
    }
  }


`