import { gql } from "@apollo/client";
export default gql`
  query(
    $_id: ID!
    $archived: Boolean
  ){
    findSummaryReportPosts(
      _id: $_id
      archived: $archived
    ){
      _id
      seller{
        _id
        first_name
        last_name
        full_name
        status
        imageUrl
      }
      category
      item{
        _id
        title
        buyer{
          _id
          first_name
          last_name
          full_name
          status
          imageUrl
        }
        date_created
        date_first_bid    # = date of first sale
        timer
        current_bid
        starting_price
        additional_bid
        gallery{
          data
        }
      }
    }
  }
`