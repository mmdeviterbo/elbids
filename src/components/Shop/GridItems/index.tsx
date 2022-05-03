import React, { ReactElement, useEffect, useState } from 'react'
import { useLazyQuery, useQuery, useMutation } from '@apollo/client'
import { postsQuery, userQuery } from './query'
import { Post, PostFilter, CATEGORY, SORT_BY, TIMER_OPTIONS, CookieArgs  } from '../../../types'
import { Box, Typography, Select, MenuItem, IconButton, Tooltip } from '@material-ui/core'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import getUser from '../../../utils/getUser'
import useStyles from './style'
import { useRouter } from 'next/router';
import sortByPosts from '../../../utils/sortBy'
import ViewPostDialog from '../ViewPostDialog'
import userMutation from './mutation'
import { ObjectId } from 'bson'
import _ from 'lodash'
import LoaderSpinner from '../../_commons/loaderSpinner'

const GridItems=({postsProp}: {postsProp?: Post[]}): ReactElement=>{
  const user: CookieArgs = getUser()
  const [open, setOpen]=useState<boolean>(false)    //"viewPostDialog" component
  const [postPreview, setPostPreview]=useState<Post>()    //"preview post if clicked" component

  let [posts, setPosts]= useState<Post[]>(postsProp)
  let [likePosts, setLikePosts]=useState<ObjectId[]>([])
  let [followingPosts,setFollowingPosts]=useState<ObjectId[]>([])

  const [sortBy, setSortBy] = useState<SORT_BY>();

  const classes = useStyles({})
  const router = useRouter()

  const min_price = router.query.min_price as string
  const max_price = router.query.max_price as string
  const category = router.query.category as CATEGORY
  const date_range = router.query.date_range as string
  const timer = router.query.timer as TIMER_OPTIONS
  const search = router.query.search as string 
  const tags = router.query.tags as string

  const [findPosts,{ loading }] = useLazyQuery(postsQuery,{
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    returnPartialData:true,
    onCompleted:(e): void=>{
      let resPosts: Post[] = e?.findManyPosts 
      setPosts(resPosts)
    }
  })

  const [updateUser] = useMutation(userMutation,{ 
    notifyOnNetworkStatusChange: true,
  })

  const likePostsState = useQuery(userQuery,{   //returns favorite_ids[] and following_ids[] from User
    skip: !getUser()?.email,
    variables: { email : getUser()?.email },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  })

  useEffect(()=>{
    let likeIds: ObjectId[] = likePostsState?.data?.findOneUser?.favorite_ids
    let followingIds: ObjectId[] = likePostsState?.data?.findOneUser?.following_ids
    likeIds && !_.isEqual(likeIds, likePosts) && setLikePosts([...likeIds])
    followingIds && !_.isEqual(followingIds, followingPosts) && setFollowingPosts([...followingIds])
  },[likePostsState?.data])

  const handleFilter=async(): Promise<void>=>{
    const filterArgs: PostFilter = {}
    if(min_price) filterArgs.min_price = parseInt(min_price)
    else filterArgs.min_price = null

    if(max_price) filterArgs.max_price = parseInt(max_price)
    else filterArgs.max_price = null

    if(timer) filterArgs.timer = timer
    if(category) filterArgs.category = category
    if(search) filterArgs.search = search

    if(tags?.length) filterArgs.tags= tags

    if(date_range) filterArgs.date_range = date_range

    await findPosts({variables: filterArgs})
  }
  const handleSortByValue=(sortByItem: string): SORT_BY=>{
    return Object.values(SORT_BY).find((item: SORT_BY)=>item === sortByItem)
  }

  useEffect(()=>{
    handleFilter()
  },[min_price, max_price, category, date_range, timer, search, tags])

  useEffect((): void =>{
    sortByPosts(sortBy, posts, setPosts)
  },[sortBy])

  const handleLikeButton=async(post: Post, isFavorite: boolean): Promise<void> =>{
    if(!isFavorite){
      let tempLikePosts: ObjectId[] = likePosts?.filter((likePost: ObjectId)=>likePost.toString()!==post?._id.toString())
      setLikePosts(tempLikePosts)
    }else{
      setLikePosts([...likePosts, post?._id])
    }
    await updateUser({
      variables: { email: user?.email, favorite_id : new ObjectId(post?._id), isFavorite}
    })
    await likePostsState.refetch()
  }

  const handleFollowingButton=async(post: Post, isFollow: boolean): Promise<void> =>{
    if(!isFollow){
      let tempFollowingPosts: ObjectId[] = followingPosts?.filter((followingPost: ObjectId)=>followingPost.toString()!==post?._id.toString())
      setFollowingPosts(tempFollowingPosts)
    }else{
      setFollowingPosts([...followingPosts, post?._id])
    }
    await updateUser({
      variables: { email: user?.email, following_id : new ObjectId(post?._id), isFollow}
    })
    await likePostsState.refetch()
  }

  const isExistArray=(arrIds: ObjectId[], itemId: ObjectId): boolean =>{
    return arrIds.includes(itemId)
  }

  return (
    <>
      <Box flexGrow={1} display="flex" flexDirection={'column'} className={classes.root}>
        <Box display="flex" flexDirection="column" alignItems="flex-end" justifyContent="flex-end" mt={1}>
          <Typography variant="subtitle1" color="textPrimary">{'SORT BY'}</Typography>
          <div className={classes.containerSelect}>
            <Select 
              value={sortBy}
              onChange={(e)=>setSortBy(handleSortByValue(e.target.value.toString()))}
              fullWidth
              variant="outlined"
              className={classes.select}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left"
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left"
                },
                getContentAnchorEl: null
              }}
              defaultValue="select"
              >
              <MenuItem value={'select'} disabled>{'Select'}</MenuItem>
              {Object.values(SORT_BY)?.map((sort: string)=> <MenuItem key={sort} value={sort}>{sort}</MenuItem>)}
            </Select>
          </div>
        </Box>

        <LoaderSpinner isVisible={loading}/>
        <Box display="flex" flexWrap="wrap" justifyContent="flex-start" alignItems="flex-start" p={2} gridGap={4}>
          {posts?.map((post: Post): ReactElement=>{
            return(
              <Box position='relative' key={post?._id.toString()}>
                {likePostsState?.data?.findOneUser && likePostsState?.data?.findOneUser?._id !== post?.seller_id && <Box position="absolute" display="flex" justifyContent={'flex-end'} width="100%" p={1.5}>
                  <Tooltip title="Notify about this item" placement="top">
                    <IconButton 
                      aria-label="toggle-theme"
                      onClick={async(): Promise<void>=> await handleFollowingButton(post, !isExistArray(followingPosts, post?._id))}
                      style={{margin:1, padding:0}}
                    >
                      {isExistArray(followingPosts, post?._id)? <NotificationsActiveIcon/> : <NotificationsNoneOutlinedIcon/>}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Add to favorites" placement="top">
                    <IconButton 
                      style={{margin:2, padding:0}}
                      aria-label="toggle-theme"
                      onClick={async(): Promise<void>=> await handleLikeButton(post, !isExistArray(likePosts, post?._id))}
                      >
                      {isExistArray(likePosts, post?._id)? <FavoriteIcon/> : <FavoriteBorderIcon/> }
                    </IconButton>
                  </Tooltip>
                </Box>}
                <Box 
                  key={post._id.toString()}
                  className={classes.cardItem}
                  onClick={async(): Promise<void> =>{
                    await setPostPreview(post)
                    setOpen(!open)
                  }}>
                  <Box className={classes.imageContainer}>
                    <img src={`data:image/png;base64,${post?.item?.gallery?.data[0]}`} draggable={false} alt="" className={classes.image}/>
                  </Box>
                  <Box mt={1}><Typography component={'span'} variant="body2" color="textSecondary" noWrap>{post.category}</Typography></Box>
                  <Box><Typography variant="subtitle1" color="textPrimary" noWrap><strong>{post?.item?.title?.toUpperCase()}</strong></Typography></Box>
                  <Typography variant="body1" color="textPrimary" component="span">{`₱${post?.item?.current_bid || post?.item?.starting_price}`}</Typography>
                  {post?.item.timer!==TIMER_OPTIONS.NA && <Typography variant="body2" color="textPrimary" component="span">{` (+${post.item.additional_bid})`}</Typography>}
                  {post?.item.timer!==TIMER_OPTIONS.NA && <Typography variant="body2" color="textSecondary">{post?.item.timer}</Typography>}
                  {post?.item.timer===TIMER_OPTIONS.NA && <Typography variant="body2" color="textSecondary" noWrap>{' '}</Typography>}
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
      <ViewPostDialog 
        postPreview={postPreview}
        likePosts={likePosts}
        handleLikeButton={handleLikeButton}
        handleFollowingButton={handleFollowingButton}
        followingPosts={followingPosts}
        open={open}
        setOpen={setOpen}
      />
    </>
  )
}
export default GridItems