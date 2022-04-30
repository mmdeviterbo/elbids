import {gql} from '@apollo/client'

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
  updateUserMutation
}
