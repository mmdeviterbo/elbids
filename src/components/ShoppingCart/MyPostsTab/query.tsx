import { gql } from "@apollo/client";
export default gql`
  query(
    $email: String!
    $_id: ID!
  ){
    findManyMyPosts(
      email: $email
      _id: $_id
    ){
      _id
      seller_id
      archived
      category
      seller{
        _id
        email
        first_name
        last_name
        full_name
        imageUrl
        status
        admin
      }
      item{
        _id
        title
        description
        buyer{
          _id
          full_name
          first_name
          last_name
          status
          imageUrl
        }
        date_created
        date_first_bid    # = date of first sale
        reason
        timer
        current_bid
        starting_price
        additional_bid
        gallery_id
        gallery{
          data
        }
      }
    }
  }
`