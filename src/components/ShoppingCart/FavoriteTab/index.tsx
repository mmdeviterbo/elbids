import { ReactElement, useEffect, useState} from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Typography, Divider, Button, IconButton, Tooltip } from '@material-ui/core'
import useStyles from './style'
import favoritePostsquery from './query'
import { updateUserMutation } from './mutation'
import { useQuery, useMutation } from '@apollo/client';
import { UserDisplay, Post, FindCartPostsArgs} from '../../../types';
import { ObjectId } from 'bson';
import LoaderSpinner from '../../_commons/loaderSpinner'
import CardCard from '../../_commons/cartCard';
import _ from 'lodash'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const LikesTab=(
  {
    user
  }:{
    user: UserDisplay
  }
): ReactElement=> {
  let findFavoritePostsArgs: FindCartPostsArgs = { email: user?.email, _id: new ObjectId(user?._id) }
  const router = useRouter()
  const classes = useStyles()

  const [favoritePosts, setFavoritePosts]=useState<Post[]>()

  const favoritePostsState = useQuery(favoritePostsquery,{
    skip: !findFavoritePostsArgs?._id || !findFavoritePostsArgs?.email,
    variables: { ... findFavoritePostsArgs},
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  })

  useEffect(()=>{
    if(favoritePostsState?.data?.findManyFavorites){
      let newFavoritePosts: Post[] = [...favoritePostsState?.data?.findManyFavorites].reverse()
      if(!_.isEqual(newFavoritePosts, favoritePosts)){
        setFavoritePosts(newFavoritePosts)
      }
    }
  },[favoritePostsState?.data])
  
  useEffect(()=>{
    try{
      localStorage.setItem('cart_index', "3")
    }catch(err){}
  },[])


  const [updateUser] = useMutation(updateUserMutation,{
    notifyOnNetworkStatusChange: true,
    onCompleted:async(e): Promise<void>=>{
      await favoritePostsState.refetch()
    }
  })

  let actionCard=(post: Post):ReactElement=>{
    return(
    <Box display={'flex'} justifyContent='flex-end' alignItems="center" gridColumnGap={4} p={1} pr={0}>
      <Tooltip title="Remove" placement="left">
        <IconButton 
          color="inherit"
          onClick={async(): Promise<void>=>{
            await updateUser({
              variables: { email : user?.email, favorite_id: post?._id, isFavorite: false }
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
        <Typography variant={'h5'}><strong>Favorite Items</strong></Typography>
      </Box>
      <LoaderSpinner isVisible={favoritePostsState?.loading}/>
      {favoritePosts?.map((favePost: Post): ReactElement=>{
        return (
          <CardCard
            key={favePost?._id.toString()}
            post={favePost}
            actionCard={actionCard}
          />
        )
      })}
      {!favoritePostsState?.loading && (!favoritePosts || favoritePosts?.length===0) &&
        <Typography variant="subtitle1" align="center">
          <i>{'No items founds'}</i>
        </Typography>
      }
    </Box>
  )
}
export default LikesTab
