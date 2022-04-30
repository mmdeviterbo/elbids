import { gql } from "@apollo/client";
export default gql`
  query(
    $email: String!
    $_id: ID!
  ){
    findManyFollowing(
      email: $email
      _id: $_id
    ){
      _id
      seller{
        _id
        full_name
        imageUrl
        status
        report_count
      }
      category
      item{
        _id
        title
        description
        buyer{
          _id
          full_name
          imageUrl
          status
          report_count
        }
        date_created
        date_first_bid    # = date of first sale
        date_latest_bid    # = date of first sale
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