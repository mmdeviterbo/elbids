import { ReactElement, useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Divider, Button, Tooltip } from '@material-ui/core'
import useStyles from './style'
import boughtPostsQuery from './query'
// import mutation from './mutation'
import { useQuery, useMutation } from '@apollo/client';
import {  UserDisplay, FindCartPostsArgs, Post } from '../../../types';
import { ObjectId } from 'bson';
import LoaderSpinner from '../../_commons/loaderSpinner'
import CardCard from '../../_commons/cartCard';
import ChatDrawer from '../../ChatDrawer'
import _ from 'lodash'

const BoughtTab= (
  {
    user
  }:{
    user: UserDisplay
  }
): ReactElement=> {
  const router = useRouter()
  const classes = useStyles()
  let findBoughtPostsArgs: FindCartPostsArgs = { email: user?.email, _id: new ObjectId(user?._id) }

  const [boughtPosts, setBoughtPosts]=useState<Post[]>()

  const boughtPostsState = useQuery(boughtPostsQuery,{
    skip: !findBoughtPostsArgs?._id || !findBoughtPostsArgs?.email,
    variables: { ... findBoughtPostsArgs },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  })

  useEffect(()=>{
    if(boughtPostsState?.data?.findManyBought){
      let newBoughtPosts: Post[] = [...boughtPostsState?.data?.findManyBought].reverse()
      if(!_.isEqual(newBoughtPosts, boughtPosts)){
        setBoughtPosts(newBoughtPosts)
      }
    }
  },[boughtPostsState?.data])

  useEffect(()=>{
    try{
      localStorage.setItem('cart_index', "1")
    }catch(err){}
  },[])

  let actionCard=(post: Post): ReactElement=>{
    let tempUser: UserDisplay
    let tempOther: UserDisplay
    if(post?.seller?._id === user?._id){
      tempUser = post?.seller
      tempOther = post?.item?.buyer
    }else{
      tempUser = post?.item?.buyer
      tempOther = post?.seller 
    }

    return(
      <Box display={'flex'} justifyContent='flex-end' alignItems={'center'} gridColumnGap={4} p={1} pr={0}>
        <ChatDrawer
          isCreate={true}
          user={tempUser}
          other={tempOther}
        />
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
        <Typography variant={'h5'}><strong>Bought Items</strong></Typography>
      </Box>
      <LoaderSpinner isVisible={boughtPostsState?.loading}/>
      {boughtPosts?.map((boughtPost: Post): ReactElement=>{
        return (
          <CardCard
            key={boughtPost?._id.toString()}
            post={boughtPost}
            actionCard={actionCard}
          />
        )
      })}
      {!boughtPostsState?.loading && (!boughtPosts || boughtPosts?.length===0) &&
        <Typography variant="subtitle1" align="center">
          <i>{'No items founds'}</i>
        </Typography>
      }
    </Box>
  )
}
export default BoughtTab
