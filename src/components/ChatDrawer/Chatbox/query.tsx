import { gql } from "@apollo/client";

const userQuery = gql`
  query(
    $email: String
    $_id: ID
    ){
    findOneUser(
      email : $email){
      _id
      full_name
      imageUrl
    }
  }
`

const conversationsQuery = gql`
  query(
    $user_ids: [ID!]!
    ){
      findManyConversations(
        user_ids:$user_ids
      ){
      _id
      date_created
      user_ids
      users{
        _id
        email
        first_name
        last_name
        full_name
        imageUrl
        status
        admin
      }
    }
  }
`

const messagesQuery = gql`
  query(
    $conversation_id: ID!
    ){
      findManyMessages(
        conversation_id:$conversation_id
      ){
      _id
      conversation_id
      message
      user_id
      user{
        _id
        full_name
        imageUrl
        status
        admin
      }
      date_created
    }
  }
`

export {
  userQuery,
  conversationsQuery,
  messagesQuery,
}



