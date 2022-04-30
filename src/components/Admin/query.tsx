import { gql } from "@apollo/client";
export default gql`
  query(
    $_id: ID
  ){
    findOneUser(
      _id:$_id
    ){
      _id
      email
      first_name
      last_name
      full_name
      imageUrl
      status
      admin
      banned
      report_count
      date_created
    }
  }
`