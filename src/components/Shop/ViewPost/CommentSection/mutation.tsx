import { gql } from "@apollo/client";


const inserCommentMutation = gql`
  mutation(
    $user_id : ID!
    $post_id : ID!
    $content : String!
    $deleted : Boolean!
  ){
    insertOneComment(
      user_id: $user_id
      post_id: $post_id
      content: $content
      deleted: $deleted
    ){
      _id
    }
  }
`

const updateUserMutation = gql`
  mutation(
    $_id: ID
    $following_id: ID
    $isFollow: Boolean
  ){
    updateOneUser(
      _id:$_id
      following_id: $following_id
      isFollow: $isFollow
    ){
      _id
      following_ids
    }
  }
`
export {
  updateUserMutation,
  inserCommentMutation
}