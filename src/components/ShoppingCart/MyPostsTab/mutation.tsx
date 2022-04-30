import { gql } from "@apollo/client";

const deletePostMutation = gql`
  mutation(
    $_id: ID!
  ){
    deleteOnePost(
      _id:$_id
    ){
      _id
    }
  }
`
export {
  deletePostMutation
}
