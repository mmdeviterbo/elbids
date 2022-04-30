import {gql} from '@apollo/client'

const userQuery = gql`
  query(
    $email: String
  ){
    findOneUser(
      email: $email
    ){
      _id
      full_name
      email
      first_name
      last_name
      status
      report_count
      admin
      imageUrl
      date_created
      deactivated
      password
    }
  }
`


export {
  userQuery
}
