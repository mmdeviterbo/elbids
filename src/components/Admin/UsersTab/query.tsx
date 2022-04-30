import { gql } from "@apollo/client";

const usersQuery = gql`
  query(
    $email: String!
    $status: String
    $deactivated: Boolean
    $banned: Boolean
    $admin: Boolean
    ){
    users: findManyUsers(
      email: $email
      status: $status
      deactivated: $deactivated
      banned: $banned 
      admin: $admin
      ){
      _id
      admin
      email
      first_name
      last_name
      full_name
      imageUrl
      date_created
      status
      report_count
      banned
    }
  }
`
export {
  usersQuery
}