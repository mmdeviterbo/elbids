import { gql } from "@apollo/client";
export default gql`
  query(
    $email: String!
    $_id: ID!
  ){
    findManyFavorites(
      email: $email
      _id: $_id
    ){
      _id
      seller_id
      category
      item{
        _id
        title
        description
        buyer_id
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