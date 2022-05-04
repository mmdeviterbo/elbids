import { gql } from "@apollo/client";

const userQuery = gql`
	query(
		$email: String
	){
		findOneUser(
			email: $email
		){
			_id
      email
      first_name
      last_name
      full_name
      imageUrl
      status
      admin
			favorite_ids
			following_ids
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
  ){
    findOnePost(
      _id: $_id
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
      deleted
      item{
        _id
		    title
		    description
		    reason
				timer
				current_bid
		    starting_price
		    additional_bid
        gallery{
          _id
          data
        }
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



