import {gql} from '@apollo/client'

const updateUserMutation=gql`
  mutation(
    $email: String
    $deactivated: Boolean
    $password: String
  ){
    updateOneUser(
      email: $email
      report_count: $report_count
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
    }
  }
`


export {
  updateUserMutation
}
