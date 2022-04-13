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
			category
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
        date_first_bid
      }
    }
  }
`

export {
  userQuery,
  postQuery,
  buyerQuery
}



