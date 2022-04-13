import { gql } from "@apollo/client";

export default gql`
  mutation(
    $email: String
    $like_id: ID
    $following_id: ID
  ){
    updateOneUser(
      email:$email
      like_id: $like_id
      following_id: $following_id
    ){
      # _id
      following_ids
      # like_ids
    }
  }
`