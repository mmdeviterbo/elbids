import { ReactElement, useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, IconButton, Button, Tooltip } from '@material-ui/core'
import useStyles from './style'
import followingPostsQuery from './query'
import { updateUserMutation } from './mutation'
import { useQuery, useMutation } from '@apollo/client';
import {  UserDisplay, FindCartPostsArgs, Post } from '../../../types';
import { ObjectId } from 'bson';
import LoaderSpinner from '../../_commons/loaderSpinner'
import CardCard from '../../_commons/cartCard';
import _ from 'lodash'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const FollowingTab=(
  {
    user
  }:{
    user: UserDisplay
  }
): ReactElement=> {
  let findFollowingPostsArgs: FindCartPostsArgs = { email: user?.email, _id: new ObjectId(user?._id) }
  const router = useRouter()
  const classes = useStyles()
  const [followingPosts, setFollowingPosts]=useState<Post[]>()

  const followingPostsState = useQuery(followingPostsQuery,{
    skip: !findFollowingPostsArgs?._id || !findFollowingPostsArgs?.email,
    variables: { ... findFollowingPostsArgs },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  })

  useEffect(()=>{
    if(followingPostsState?.data?.findManyFollowing){
      let newFollowingPosts: Post[] = [...followingPostsState?.data?.findManyFollowing].reverse()
      if(!_.isEqual(newFollowingPosts, followingPosts)){
        setFollowingPosts(newFollowingPosts)
      }
    }
  },[followingPostsState?.data])

  useEffect(()=>{
    try{
      localStorage.setItem('cart_index', "2")
    }catch(err){}
  },[])

  const [updateUser] = useMutation(updateUserMutation,{
    notifyOnNetworkStatusChange: true,
    onCompleted:async(e): Promise<void>=>{
      await followingPostsState.refetch()
    }
  })

  const actionCard=(post: Post): ReactElement=>{
    return(
    <Box display={'flex'} justifyContent='flex-end' alignItems='center' gridColumnGap={4} p={1} pr={0}>
      <Tooltip title="Unfollow" placement="left">
        <IconButton
          color="inherit"
          onClick={async(): Promise<void>=>{
            await updateUser({
              variables: { email : user?.email, following_id: post?._id, isFollow: false }
            })
          }}
        >
          <DeleteOutlineIcon/>
        </IconButton>
      </Tooltip>

      <Button
        size={'small'}
        className={classes.buttonView}
        onClick={(): void =>{
          router.push({
            pathname:'/shop/item/[postId]',
            query: { postId: post?._id.toString() }
          })
        }}
      >
          View
      </Button>
    </Box>
  )}

  return(
    <Box>
      <Box mb={4}>
        <Typography variant={'h5'}><strong>Followed Items</strong></Typography>
      </Box>
      <LoaderSpinner isVisible={followingPostsState?.loading}/>
      {followingPosts?.map((followingPost: Post): ReactElement=>{
        return (
          <CardCard
            key={followingPost?._id?.toString()}
            post={followingPost}
            actionCard={actionCard}
          />
        )
      })}
      {!followingPostsState?.loading && (!followingPosts || followingPosts?.length===0) &&
        <Typography variant="subtitle1" align="center">
          <i>{'No items founds'}</i>
        </Typography>
      }
    </Box>
  )
}
export default FollowingTab
