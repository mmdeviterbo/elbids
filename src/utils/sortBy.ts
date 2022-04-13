import {Dispatch, SetStateAction} from 'react';
import { SORT_BY, Post } from "../types"
import _ from 'lodash'

export default (
  sortType: SORT_BY,
  posts: Post[] | any[],
  setPosts: Dispatch<SetStateAction<Post[]>>
  ): void =>{
  if(sortType === SORT_BY.DATE){
    setPosts(_.orderBy(posts, ['item.date_created'],['asc']))
  }
  
  else if(sortType === SORT_BY.AZ){
    setPosts(_.sortBy(posts, 'item.title'))
  }

  else if(sortType === SORT_BY.ZA){
    setPosts(_.sortBy(posts, 'item.title').reverse())
  }

  else if(sortType === SORT_BY.LowToHigh){
    setPosts(_.sortBy(posts, 'item.starting_price'))
  }

  else if(sortType === SORT_BY.HighToLow){
    setPosts(_.sortBy(posts, 'item.starting_price').reverse())
  }
}