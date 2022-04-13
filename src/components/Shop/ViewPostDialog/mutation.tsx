import {gql} from '@apollo/client'

const updateItemMutation=gql`
  mutation(
    $_id: ID
    $post_id: ID
    $title: String
    $description: String
    $reason: String
    $date_updated: String  #post edit-update (not bid update)
    $current_bid: Int
    $date_first_bid: String
    $date_latest_bid: String
    $buyer_id: ID
    $following_ids: [ID]
  ){
    updateItem(
      _id: $_id
			title: $title
			description: $description
			reason: $reason
			date_updated: $date_updated
			current_bid: $current_bid
			date_first_bid: $date_first_bid
      date_latest_bid: $date_latest_bid
			buyer_id: $buyer_id
      post_id: $post_id
      following_ids:$following_ids
    ){
      _id
      current_bid
			date_first_bid
      date_latest_bid
      buyer_id
    }
  }
`

const updateUserMutation = gql`
  mutation(
    $email: String
    $following_id: ID
  ){
    updateOneUser(
      email:$email
      following_id:$following_id
    ){
      _id
    }
  }
`

const updatePostMutation = gql`
  mutation(
    $_id: ID
    $archived: Boolean
    $deleted: Boolean
  ){
    updateOnePost(
      _id:$_id
      archived:$archived
      deleted:$deleted
    ){
      _id
      archived
      deleted
    }
  }
`


const deletePostMutation = gql`
  mutation(
    $_id: ID!
  ){
    deleteOnePost(
      _id:$_id
    ){
      _id
    }
  }
`

export {
  updateItemMutation,
  updateUserMutation,
  updatePostMutation,
  deletePostMutation
}


