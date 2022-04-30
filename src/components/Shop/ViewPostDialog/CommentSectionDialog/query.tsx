import { gql } from '@apollo/client'


export default gql`
  query(
    $post_id: ID!
  ){
    findManyComments(
      post_id: $post_id
    ){
      _id
      user_id
      post_id
      content
      user{
        full_name
        imageUrl
      }
    }
  }

`


