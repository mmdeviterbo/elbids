import { gql } from '@apollo/client';

const userQuery = gql`
  query($user_id: ID!){
    notifications: findManyNotifications(user_id: $user_id){
      _id
		  post{
        _id
        seller{
          _id
          first_name
          last_name
          full_name
          imageUrl
        }
        item{
          _id
          title
          buyer{
            _id
            first_name
            last_name
            full_name
            imageUrl
          }
          current_bid
          additional_bid
          timer
          gallery{
            _id
            data
          }
        }
      }
		  read
		  type
      current_bid
		  date_created
    }
  }   
`
export default userQuery