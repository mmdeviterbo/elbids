import { gql } from "@apollo/client";

const userQuery = gql`
  query($email: String){
    user: findOneUser(email: $email){
      _id
      banned
      admin
    }
  }
`

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
      id_image{
        _id
        data
      }
      email
      first_name
      last_name
      full_name
      imageUrl
      date_created
      status
      id            #image picture id(string)
      token
      admin
      banned
    }
  }
`
export {
  userQuery,
  usersQuery
}