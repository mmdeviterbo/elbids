import {gql} from '@apollo/client'

const updateUserMutation=gql`
  mutation(
    $_id: ID
    $password: String
  ){
    updateOneUser(
      _id: $_id
      password: $password
    ){
      _id
    }
  }
`


export {
  updateUserMutation
}
