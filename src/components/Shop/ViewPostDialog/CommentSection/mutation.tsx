import { gql } from "@apollo/client";


export default gql`
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