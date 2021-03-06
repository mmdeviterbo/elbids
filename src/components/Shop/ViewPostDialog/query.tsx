import { gql } from "@apollo/client";

const userQuery = gql`
  query(
    $email: String
    ){
    findOneUser(email : $email){
      _id
      full_name
      imageUrl
    }
  }
`
const buyerQuery = gql`
  query(
    $_id:ID
  ){
    findOneUser(
      _id:$_id
    ){
      _id
      full_name
    }
  }
`


const postQuery = gql`
  query(
    $_id: ID!
    $deleted : Boolean!
    $archived: Boolean!
  ){
    findOnePost(
      _id: $_id
      deleted: $deleted
      archived: $archived
    ){
      _id
      seller_id
      seller{
        _id
        full_name
        first_name
        last_name
        status
        imageUrl
      }
			category
      archived
      item{
        _id
		    title
		    description
		    reason
				timer
				current_bid
		    starting_price
		    additional_bid
		    gallery_id
		    tags
		    date_created
		    date_updated
        buyer_id
        buyer{
          _id
          full_name
          first_name
          last_name
          status
          imageUrl
        }
        date_first_bid
      }
    }
  }
`
const favoriteFollowingLengthQuery = gql`
  query(
    $post_id: ID!    
  ){
    lengths: findFavoriteFollowingLength(
      post_id: $post_id    
    ){
      lenFollowingPosts
      lenFavoritePosts
    }
  }
`

export {
  userQuery,
  postQuery,
  buyerQuery,
  favoriteFollowingLengthQuery
}



