import { gql } from "@apollo/client";
const updateUserMutation = gql`
  mutation(
    $email: String
    $following_id: ID
    $isFollow: Boolean
  ){
    updateOneUser(
      email: $email
      following_id: $following_id
      isFollow: $isFollow
    ){
      _id
    }
  }
`
export {
  updateUserMutation
}