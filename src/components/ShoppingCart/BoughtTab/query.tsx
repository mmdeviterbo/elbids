import { gql } from "@apollo/client";
export default gql`
  query(
    $email: String!
    $_id: ID!
  ){
    findManyBought(
      email: $email
      _id: $_id
    ){
      _id
      seller_id
      seller{
        _id
        full_name
        first_name
        last_name
        status
        imageUrl
      }
      category
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