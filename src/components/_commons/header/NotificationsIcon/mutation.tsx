import { gql } from '@apollo/client'

const updateNotificationsMutation = gql`
mutation (
  $user_id:ID!
  ){
  updateManyNotifications(
    user_id: $user_id
    ){
      _id
  }
}
`
export default updateNotificationsMutation