import { gql } from "@apollo/client";

export default gql`
  mutation(
    $email: String
    $favorite_id: ID
    $following_id: ID
    $isFavorite: Boolean
    $isFollow: Boolean
  ){
    updateOneUser(
      email:$email
      favorite_id: $favorite_id
      following_id: $following_id
      isFavorite: $isFavorite
      isFollow: $isFollow
    ){
      _id
      following_ids
      favorite_ids
    }
  }
`