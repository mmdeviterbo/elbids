import { gql } from "@apollo/client";
const postsQuery = gql`
  query(			
			$search: String, 
			$min_price: Int,
			$max_price: Int,
			$tags: [String], 
			$timer: String,
			$date_range: String							#to find time remaining
			$category: String){
    findManyPosts(
			search:$search
			min_price:$min_price
			max_price:$max_price
			tags:$tags 
			timer:$timer
			date_range:$date_range					#to find time remaining
			category:$category
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
				gallery{
					data
				}
		    tags
		    date_created
		    date_updated
				buyer_id
				date_first_bid
      }
    }
  }
`

const userQuery = gql`
	query(
		$email: String
	){
		findOneUser(
			email: $email
		){
			_id
			like_ids
			following_ids
		}
	}

`

export {
	postsQuery,
	userQuery
}