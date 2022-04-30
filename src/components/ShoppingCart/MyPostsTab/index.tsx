import { ReactElement, useEffect, useState, MouseEvent} from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Button, Divider, IconButton, MenuItem, Menu } from '@material-ui/core'
import useStyles from './style'
import myPostsQuery from './query'
import { deletePostMutation } from './mutation'
import { useQuery, useMutation } from '@apollo/client';
import {  UserDisplay, FindCartPostsArgs, Post } from '../../../types';
import { ObjectId } from 'bson';
import LoaderSpinner from '../../_commons/loaderSpinner'
import CardCard from '../../_commons/cartCard';
import _ from 'lodash'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ChatDrawer from '../../ChatDrawer'
import queryString from 'query-string';
import EditIcon from '@material-ui/icons/Edit';

const MyPostsTab=(
  {
    user
  }:{
    user: UserDisplay
  }
): ReactElement=> {
  const router = useRouter()
  const classes = useStyles()
  let findMyPostsArgs: FindCartPostsArgs = { email: user?.email, _id: new ObjectId(user?._id) }
  const [myPosts, setMyPosts]=useState<Post[]>()
  const [anchorElLogout, setAnchorElLogout] = useState<null | HTMLElement>(null);

  const myPostsState = useQuery(myPostsQuery,{
    skip: !findMyPostsArgs?._id || !findMyPostsArgs?.email,
    variables: { ... findMyPostsArgs },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    ssr: false,
  })

  useEffect(()=>{
    if(myPostsState?.data?.findManyMyPosts){
      let newMyPosts: Post[] = [...myPostsState?.data?.findManyMyPosts].reverse()
      if(!_.isEqual(newMyPosts, myPosts)){
        setMyPosts(newMyPosts)
      }
    }
  },[myPostsState?.data])
  
  useEffect(()=>{
    try{
      localStorage.setItem('cart_index', "0")
    }catch(err){}
  },[])

  useEffect(()=>{
    console.log('router.query.edit')
    console.log(router.query.edit)
  },[router.query])

  const [deleteOnePost] = useMutation(deletePostMutation,{
    notifyOnNetworkStatusChange: true,
  })

  const handleClickLogout=(event: MouseEvent<HTMLButtonElement>): void =>{
    setAnchorElLogout(event.currentTarget);
  }

  const handleCloseLogout = (): void => {
    setAnchorElLogout(null);
  };

  const deleteOption=(post: Post): ReactElement => {
    return (
    <>
      <Box position={'absolute'} right={0}>
        <IconButton 
        aria-label="close" 
        onClick={handleClickLogout}
        >
          <MoreHorizIcon fontSize="small"/>
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorElLogout}
          keepMounted
          style={{boxShadow:'none'}}
          open={Boolean(anchorElLogout)}
          onClose={handleCloseLogout}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          disableScrollLock={true}
        >
          <MenuItem 
            style={{boxShadow:'none'}}
            onClick={async(): Promise<void> =>{
            setAnchorElLogout(null);
            await deleteOnePost({variables : { _id : new ObjectId(post?._id) }})
            await myPostsState.refetch()
          }}>Delete</MenuItem>
        </Menu>
      </Box>
    </>)
  }

  let actionCard=(post: Post):ReactElement=>{
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
      <Box display={'flex'} justifyContent='flex-end' alignItems='center' gridColumnGap={4} p={1} pr={0}>
        {post?.archived?
          <ChatDrawer
            isCreate={true}
            user={tempUser}
            other={tempOther}
          />
          :
          <IconButton
            color="inherit"
            onClick={()=>{
            router.push({
              pathname:`/shop/item/[postId]`,
              query: { postId : post?._id.toString(), edit: true }
            })
          }}>
            <EditIcon/>
          </IconButton>
        }
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
        <Typography variant={'h5'}><strong>My Items</strong></Typography>
      </Box>
      <LoaderSpinner isVisible={myPostsState?.loading}/>
      {myPosts?.map((myPost: Post): ReactElement=>{
        return (
          <Box position={'relative'} key={myPost?._id.toString()}>
            {!myPost?.archived && deleteOption(myPost)}
            <CardCard
              post={myPost}
              actionCard={actionCard}
            />
          </Box>
        )
      })}
      {!myPostsState?.loading && (!myPosts || myPosts?.length===0) &&
        <Typography variant="subtitle1" align="center">
          <i>{'No items founds'}</i>
        </Typography>
      }
    </Box>
  )
}
export default MyPostsTab
