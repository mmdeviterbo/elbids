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
			seller{
				_id
				full_name
				admin
				status
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
		    date_created
				buyer_id
				buyer{
					_id
					full_name
					admin
					status
				}
				date_first_bid
      }
    }
  }
`
const galleriesQuery = gql`
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
      item{
				gallery{
					_id
					data
				}
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
			favorite_ids
			following_ids
		}
	}

`

export {
	postsQuery,
	userQuery,
	galleriesQuery
}