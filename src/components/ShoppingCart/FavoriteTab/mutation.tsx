import { gql } from "@apollo/client";
const updateUserMutation = gql`
  mutation(
    $email: String
    $favorite_id: ID
    $isFavorite: Boolean
  ){
    updateOneUser(
      email: $email
      favorite_id: $favorite_id
      isFavorite: $isFavorite
    ){
      _id
    }
  }
`
export {
  updateUserMutation
}