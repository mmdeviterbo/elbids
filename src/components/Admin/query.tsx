import { gql } from "@apollo/client";

const userQuery = gql`
  query($email: String){
    user: findOneUser(email: $email){
      admin
    }
  }
`

const usersQuery = gql`
  query(
    $email: String!
    $status: String
    $deactivated: String
    $banned: String
    $admin: String
    ){
    users: findManyUsers(
      email: $email
      status: $status
      deactivated: $deactivated
      banned: $banned 
      admin: $admin
      ){
      _id
      email
      first_name
      last_name
      full_name
      imageUrl
      date_created
      status
      id            #image picture id(string)
      token
    }
  }
`
export {
  userQuery,
  usersQuery
}