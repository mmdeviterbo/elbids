import { gql } from "@apollo/client";
export default gql`
  query(
    $email: String
  ){
    findOneUser(
      email:$email
    ){
      _id
      full_name
      imageUrl
      email
      status
      admin
    }
  }
`