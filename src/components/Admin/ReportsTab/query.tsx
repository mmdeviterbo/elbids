import { gql } from "@apollo/client";
const usersQuery = gql`
  query(
    $email: String!
  ){
    findManyUsers(
      email:$email
    ){
      _id
      email
      first_name
      last_name
      full_name
      status
      admin
      banned
      report_count
      date_created
    }
  }
`
const postsQuery = gql`
  query(
    $_id: ID!
    $archived: Boolean
    $timer: String
    $category: String
  ){
    findSummaryReportPosts(
			_id: $_id
  		archived: $archived
  		timer: $timer
  		category: $category
    ){
      _id
      category
      archived
      seller{
        _id
        full_name
      }
      item{
        _id
        title
        buyer{
          _id
          full_name
        }
        date_latest_bid
        date_first_bid
        timer
        starting_price
        additional_bid
        current_bid
      }
    }
  }
`



export {
  usersQuery,
  postsQuery
}