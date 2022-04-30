import {gql} from '@apollo/client'

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
const insertOneConversationMutation = gql`
  mutation(
    $_id: ID!
    $user_ids: [ID!]!
  ){
    insertOneConversation(
      _id: $_id
      user_ids: $user_ids
    ){
      _id
    }
  }
`

const insertOneMessageMutation = gql`
  mutation(
    $conversation_id: ID!
    $user_id: ID!
    $message: String!
  ){
    insertOneMessage(
      conversation_id: $conversation_id
      user_id: $user_id
      message: $message
    ){
      _id
      conversation_id
      user_id
      message
    }
  }
`



export {
  deletePostMutation,
  insertOneConversationMutation,
  insertOneMessageMutation
}


