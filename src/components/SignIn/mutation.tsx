import { gql } from '@apollo/client'

const insertUserMutation = gql`
mutation (
  $email: String!
  $full_name: String! 
  $first_name: String! 
  $last_name: String! 
  $imageUrl: String! 
  $status: String!
  $date_created: String!
  $deactivated: Boolean
  $banned:Boolean
  $report_count:Int
  $notification_count:Int
  $admin: Boolean
  $token:String!
  ){
  user: insertOneUser(
    email:$email
    full_name: $full_name
    first_name: $first_name 
    last_name: $last_name 
    imageUrl: $imageUrl
    status: $status
    deactivated:$deactivated
    banned:$banned
    date_created:$date_created
    report_count:$report_count
    notification_count:$notification_count
    admin:$admin
    token:$token
    ){
    _id
    email
    full_name
    first_name
    last_name
    imageUrl
    status
    notification_count
    token
    admin
  }
}
`

const updateUserMutation=gql`
  mutation(
    $email: String
    $deactivated: Boolean
  ){
    updateOneUser(
      email: $email
      deactivated: $deactivated
    ){
      _id
    }
  }
`

export {
  insertUserMutation,
  updateUserMutation
}