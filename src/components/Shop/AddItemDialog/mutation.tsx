import { gql } from '@apollo/client';

export default gql`
  mutation(
    $_id: ID!
		$seller_id: ID!
		$category: String!
		$item: ItemInput!
		$deleted : Boolean!
		$archived: Boolean!
  ){
    post: insertPost(
      _id:$_id
	  	seller_id:$seller_id
      category:$category
		  item:$item
		  deleted:$deleted
		  archived:$archived
    ){
      _id
    }
  }


`