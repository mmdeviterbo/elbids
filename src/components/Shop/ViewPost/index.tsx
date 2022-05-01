import React, { ReactElement, useEffect, useState, Dispatch, SetStateAction, MouseEvent, ChangeEvent } from 'react'
import "react-image-gallery/styles/css/image-gallery.css";
import { Post, DATE_FORMAT, ItemUpdateArgs, TIMER_OPTIONS, PreviewGallery, CookieArgs, UserDisplay } from '../../../types'
import { Box, Typography, Grid, Button, Divider, Tooltip, Container } from '@material-ui/core';
import { Avatar, ListItem, ListItemText, ListItemAvatar, MenuItem, Menu } from '@material-ui/core';
import {Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import ImageGallery from 'react-image-gallery';
import { useQuery, useMutation } from '@apollo/client'
import GavelIcon from '@material-ui/icons/Gavel';
import PersonIcon from '@material-ui/icons/Person';
import TimerIcon from '@material-ui/icons/Timer';
import useStyles from './style'
import { updateItemMutation, updatePostMutation, deletePostMutation, updateUserMutation } from './mutation'
import { userQuery, postQuery, buyerQuery } from './query' 
import getUser from '../../../utils/getUser';
import { ObjectId } from 'bson';
import { formatPreviewGallery } from '../../../utils/formatGallery'
import Countdown from 'countdown-js'
import CommentSection from './CommentSection';
import { useRouter } from 'next/router';
import _ from 'lodash'
import formatDate from '../../../utils/formatDate';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import ChatDrawer from '../../ChatDrawer'
import LoaderSpinner from '../../_commons/loaderSpinner'
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import {titleCase} from 'title-case'


const ViewPost=(props): ReactElement=>{
  
  const user: CookieArgs = getUser()
  const router = useRouter()
  const classes = useStyles()
  
  const [post, setPost]= useState<Post>()
  const [gallery, setGallery]= useState<PreviewGallery[]>([])
  const [isFinished, setIsFinished]= useState<boolean>(false)
  const [dateFirstBid, setDateFirstBid] = useState<string>(post?.item?.date_first_bid || '')
  const [likePosts, setLikePosts]=useState<ObjectId[]>([])
  const [followingPosts, setFollowingPosts]=useState<ObjectId[]>([])
  const [anchorElLogout, setAnchorElLogout] = useState<null | HTMLElement>(null);
  const post_id = router?.query?.postId as string
  // const [post_id, setPost_id]=useState<string>()
  
  const editQuery = router?.query?.edit as string
  const [isEdit, setIsEdit]=useState<boolean>(false)
  const [title, setTitle]=useState<string>('')
  const [description, setDescription]=useState<string>('')
  const [reason, setReason]=useState<string>('')

  const isExistArray=(postIds: ObjectId[], postId: ObjectId): boolean =>{
    return postIds?.includes(postId)
  }
  
  const userState = useQuery(userQuery,{    //who currently logged in
    skip: !user?.email,
    variables: { email : user?.email },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    ssr: false,
    onCompleted:(e)=>{
      let tempLikeIds: ObjectId[] = e?.findOneUser?.favorite_ids
      let tempFollowingIds: ObjectId[] = e?.findOneUser?.following_ids
      if(tempLikeIds && !_.isEqual(likePosts, tempLikeIds)) setLikePosts(tempLikeIds)
      if(tempFollowingIds && !_.isEqual(followingPosts, tempFollowingIds)) setFollowingPosts(tempFollowingIds)
    }
  })

  const [updateUser] = useMutation(updateUserMutation,{ //when update the user's favorite and following posts
    notifyOnNetworkStatusChange: true,
    onCompleted:(e)=>{
      let tempLikeIds: ObjectId[] = e?.updateOneUser?.favorite_ids
      let tempFollowingIds: ObjectId[] = e?.updateOneUser?.following_ids
      if(!_.isEqual(likePosts, tempLikeIds)) setLikePosts(tempLikeIds)
      if(!_.isEqual(followingPosts, tempFollowingIds)) setFollowingPosts(tempFollowingIds)
    }
  })

  const findPostState = useQuery(postQuery,{   //find the current post
    skip: !post_id,
    variables: { _id: new ObjectId(post_id), deleted: false },
    notifyOnNetworkStatusChange: true,
    pollInterval: 500,
    ssr: false,
    fetchPolicy: 'cache-and-network'
  })

  useEffect(()=>{
    const refetchPost=async()=>{
      let tempQuery = router?.query?.postId as string
      if(tempQuery){
        await findPostState.refetch({ _id: new ObjectId(tempQuery), deleted: true })
        await findPostState.stopPolling()
        await findPostState.refetch({ _id: new ObjectId(tempQuery), deleted: false })
        await findPostState.startPolling(500)
      }
    }
    refetchPost()
  },[router?.query?.postId])



  const [deleteOnePost] = useMutation(deletePostMutation,{
    notifyOnNetworkStatusChange: true
  })

  const [updateItem] = useMutation(updateItemMutation,{
    notifyOnNetworkStatusChange: true,
    onCompleted:async():Promise<void>=>{
      await findPostState.refetch()
    }
  })

  const [updatePost] = useMutation(updatePostMutation,{
    notifyOnNetworkStatusChange: true,
    onCompleted:async(): Promise<void>=>{
      await findPostState.refetch()
    }
  })

  useEffect((): void =>{
    let post: Post = findPostState?.data?.findOnePost 
    if(post){
      setPost(post)
      setDateFirstBid(post?.item?.date_first_bid)
      setGallery(formatPreviewGallery(post?.item?.gallery?.data))
    }
  },[findPostState?.data])

  useEffect(()=>{
    setIsEdit(false)
    if(findPostState?.data?.findOnePost){
      try{
        if(!findPostState?.data?.findOnePost?.archived){
          setIsEdit(JSON.parse(editQuery))
        }
      }catch(err){
        setIsEdit(false)
      }
    }
  },[router.query, findPostState?.data])


  let user_id: ObjectId = new ObjectId(userState?.data?.findOneUser?._id)
  let buyer_id: ObjectId = new ObjectId(post?.item?.buyer_id)
  let seller_id: ObjectId =  new ObjectId(post?.seller_id)
  
  const handleBidderButton=(): boolean =>{
    if(user_id.equals(seller_id)) return true // if you are the creator, then you tried to buy your own item
    else if(user_id.equals(buyer_id)) return true // if you are the already the top bidder/buyer, then you tried to buy the item
    return false
  }

  const isBidding=(post: Post): boolean=>{
    return post?.item?.additional_bid>0? true: false
  }

  const isBidExist=(): boolean =>{
    let hasBid = true
    const buyer_id: ObjectId = post?.item?.buyer_id
    if(!buyer_id) hasBid=false
    return hasBid
  }

  let timerType: TIMER_OPTIONS = Object.values(TIMER_OPTIONS).find((timer: TIMER_OPTIONS)=>post?.item?.timer===timer)
  let lengthTime: number = 0

  if(timerType === TIMER_OPTIONS.FIFTEEN_SECONDS) lengthTime = 17000
  else if(timerType === TIMER_OPTIONS.TWELVE_HOURS) lengthTime = 43200000      
  else if(timerType === TIMER_OPTIONS.ONE_DAY) lengthTime = 86400000
  else if(timerType === TIMER_OPTIONS.TWO_DAYS) lengthTime = 172800000
  else if(timerType === TIMER_OPTIONS.FIVE_DAYS) lengthTime = 432000000

  let end = new Date(lengthTime + new Date(dateFirstBid).getTime())
  let time = Countdown.timer(end, function(){}, function(){})
  const { days, hours, minutes, seconds } = time.getTimeRemaining()

  const timerFormat=(): string =>{
    if(days<0 || hours<0 || minutes<0 || seconds<0) return 'Time is up!'
    if(days){
      if(days===1) return `${days}day ${hours}hr ${minutes}m ${seconds}s`
      else return `${days}days ${hours}hr ${minutes}m ${seconds}s`
    }else if(hours>=0) return `${hours}hr ${minutes}m ${seconds}s`
    else return `${minutes}m ${seconds}s`
  }

  useEffect(()=>{
    if(isFinished){
      const updatePostFun=async(): Promise<void>=>{
        await updatePost({variables: { _id : new ObjectId(post?._id), archived: true }})
      }
      updatePostFun()
    }
  },[isFinished])

  
  if((days<0 || hours<0 || minutes<0 || seconds<0) && !isFinished && isBidding(post) && isBidExist() && !post?.archived){
    setIsFinished(true)
  }

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
    <>
    {!post && <Box height="95vh" width="100vw">
      <LoaderSpinner isVisible={!post}/>
    </Box>}

    {post && <Container className={classes.root} maxWidth={'md'} key={post_id?.toString()|| ""}>
      <Box justifyContent="flex-end" display="flex" alignItems="center" flexDirection="row">
        {user_id.equals(seller_id) && 
          <div>
            <ListItem alignItems="center">
              <ListItemAvatar><Avatar src={userState?.data?.findOneUser?.imageUrl} /></ListItemAvatar>
              <ListItemText 
                primary={titleCase(userState?.data?.findOneUser?.full_name?.toLowerCase() || '')}
              />
            </ListItem>
          </div>
          }
          
          {user_id.equals(seller_id) && 
            <>
              {!isBidExist() && 
                <IconButton 
                  aria-label="close" 
                  onClick={(e: MouseEvent<HTMLButtonElement>):void=> setAnchorElLogout(e.currentTarget)}
                >
                  <MoreHorizIcon fontSize="small"/>
                </IconButton>
              }
              <Menu
                id="simple-menu"
                anchorEl={anchorElLogout}
                keepMounted
                open={Boolean(anchorElLogout)}
                onClose={(): void =>setAnchorElLogout(null)}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                disableScrollLock={true}
              >
                
                {!post?.archived && user_id.equals(seller_id) && !isEdit && <MenuItem onClick={():void=>{
                  setIsEdit(true)
                  setAnchorElLogout(null)
                }}>Edit</MenuItem>}

                <MenuItem onClick={async(): Promise<void> =>{
                  await deleteOnePost({variables : { _id : new ObjectId(post?._id) }})
                  router.push('/cart')
                }}>Delete</MenuItem>

                {!post?.archived && user_id.equals(seller_id) && isEdit && <MenuItem onClick={():void=>{
                  setIsEdit(false)
                  setAnchorElLogout(null)
                }}>Cancel</MenuItem>}

              </Menu>
            </>}
      </Box>

      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Box py={1}>
            <ImageGallery
              items={gallery} 
              showBullets={false}
              showFullscreenButton={false}
              showPlayButton={false}
            />
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box p={1} pl={2}>
            <Box>
              {!post?.archived && user_id.equals(seller_id) && isEdit?
                <TextField
                  className={classes.textfield}
                  variant='outlined'
                  fullWidth
                  label="Title"
                  InputLabelProps={{ shrink: true }}
                  value={title}
                  onChange={(e: ChangeEvent<HTMLInputElement>): void =>{
                    let tempTitle: string = e?.target?.value
                    setTitle(tempTitle?.length<20? tempTitle : tempTitle?.slice(0,20))
                  }}
                />
              :
                <Tooltip title={post?.item?.title} placement={'top-start'}>
                  <Typography variant={'h3'} noWrap><strong>{post?.item?.title}</strong></Typography>
                </Tooltip>
              }

            </Box>

            <Box display={'flex'} justifyContent='space-between'pt={1}>
              <div>
                <Typography variant={'h5'} color="error" display="inline"><strong>{`PHP ${post?.item?.starting_price} `}</strong></Typography>
                {isBidding(post) && 
                  <Tooltip title="Additional bid" placement="bottom-start">
                    <Typography variant={'h5'} display="inline">{`(+${post?.item?.additional_bid})`}</Typography>
                  </Tooltip>}
                <Box display="inline" ml={1}>
                  <Typography 
                    color="textSecondary"
                    display="inline"
                    className={isBidding(post)? classes.bid : classes.sale}
                    >
                    {post?.category}
                  </Typography></Box>
              </div>

              <div>
                <Tooltip title="Date created" placement="right">
                  <Typography color="textSecondary">{formatDate(post?.item?.date_created, DATE_FORMAT.DATE_WORD)}</Typography>
                </Tooltip>
              </div>
            </Box>

            <Divider/>

            {isBidding(post) && <Box py={1}>
              <Typography color="textPrimary" variant="body1">{'Timer Set'}</Typography>
              <Typography color="textSecondary" variant="body2">{post?.item?.timer}</Typography>
            </Box>}

            <Box py={1}>
              <Typography color="textPrimary" variant="body1">{'Description'}</Typography>
              {!post?.archived && user_id.equals(seller_id) && isEdit? 
                <TextField
                  margin="dense"
                  className={classes.textfield}
                  variant='outlined'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={description}
                  onChange={(e: ChangeEvent<HTMLInputElement>): void =>{
                    let tempDescription: string = e?.target?.value
                    setDescription(tempDescription?.length<200? tempDescription : tempDescription?.slice(0,200))
                  }}
                />
              :
                <Typography color="textSecondary" variant="body2">{post?.item?.description}</Typography>
              }
            </Box>

            <Tooltip title="Reason for sale" placement="left">
              <Box py={1}>
                <Typography color="textPrimary" variant="body1">{'RFS'}</Typography>
                {!post?.archived && user_id.equals(seller_id) && isEdit? 
                  <TextField
                    margin="dense"
                    className={classes.textfield}
                    variant='outlined'
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={reason}
                    onChange={(e: ChangeEvent<HTMLInputElement>): void =>{
                      setReason(e?.target?.value || '')
                    }}
                  />
                :
                  <Typography color="textSecondary" variant="body2">{post?.item?.reason}</Typography>
                }
              </Box>
            </Tooltip>                

            {isBidding(post) && isBidExist() && (
              <Table className={classes.table}>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.tableCell}>
                      <Tooltip title="Ends in" placement="left"><TimerIcon/></Tooltip>
                    </TableCell>
                    <TableCell align="left">
                      <Typography color="textSecondary" variant="body2">
                          {timerFormat()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tableCell}>
                        <Tooltip title="Top bidder" placement="left"><PersonIcon/></Tooltip>
                      </TableCell> 
                    <TableCell align="left">
                      <Typography color="textSecondary" variant="body2" component="span">{post?.item?.buyer?.full_name && titleCase(post?.item?.buyer?.full_name?.toLowerCase() || "")}</Typography>
                      {post?.item?.buyer?._id === userState?.data?.findOneUser._id &&
                        <Typography color="textPrimary" variant="body2" component="span">&nbsp;(YOU)</Typography>
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tableCell}>
                      <Tooltip title="Number of bids" placement="left"><GavelIcon/></Tooltip>
                    </TableCell>
                    <TableCell align="left">
                      <Typography color="textSecondary" variant="body2">
                        {(post?.item?.current_bid-post?.item?.starting_price)/post?.item?.additional_bid || ''}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}

        {!isEdit && !post?.archived && 
          <>
            <Button
              disabled={handleBidderButton()}
              className={classes.button}
              fullWidth
              onClick={async(): Promise<void> =>{
                let updateItemVariable: ItemUpdateArgs = { _id : new ObjectId(post?.item?._id) }
                const { current_bid, starting_price, additional_bid } = post?.item

                updateItemVariable.current_bid = current_bid + additional_bid
                updateItemVariable.post_id = new ObjectId(post?._id)
                updateItemVariable.buyer_id = new ObjectId(userState?.data?.findOneUser?._id)
                
                if(current_bid !== 0){
                  if(current_bid === starting_price){
                    updateItemVariable.date_first_bid = new Date().toString()
                    setDateFirstBid(new Date().toString())
                  }
                  updateItemVariable.date_latest_bid = new Date().toString()
                }else if(current_bid === 0){
                  updateItemVariable.date_first_bid = new Date().toString()
                }
                await updateItem({variables: updateItemVariable})
              }}
              >
              {isBidding(post)?
                <Typography color={handleBidderButton()? "textSecondary" : "textPrimary"} variant="body1">
                  {`Place a Bid (₱${post?.item?.current_bid+post?.item?.additional_bid})`}
                </Typography>
                  :
                <Typography color={handleBidderButton()? "textSecondary" : "textPrimary"} variant="body1">Buy Now</Typography>
              }
            </Button>
            <Box display="flex" flexDirection="row" gridGap={10}>
              <Button
                disabled={user_id.equals(seller_id)}
                fullWidth
                className={isExistArray(followingPosts, post?._id)? classes.unFollowingButton : classes.followingButton}
                onClick={async(): Promise<void>=>{                  
                  if(!followingPosts?.includes(post?._id)) setFollowingPosts([... followingPosts, post?._id])
                  else setFollowingPosts(followingPosts?.filter((followingPostId: ObjectId)=> followingPostId !== post?._id))
                  
                  await updateUser({
                    variables: { email: user?.email, following_id : new ObjectId(post?._id), isFollow : isExistArray(followingPosts, post?._id)? false : true}
                  })
                  await userState.refetch()
                }}>
                {isExistArray(followingPosts, post?._id)? 
                  <><NotificationsActiveIcon/>&nbsp;Unfollow</>
                  : 
                  <><NotificationsNoneOutlinedIcon/>&nbsp;Follow</>
                }
              </Button>
              
              <Button
                disabled={user_id.equals(seller_id)}
                fullWidth 
                className={isExistArray(likePosts, post?._id)? classes.unLikeButton : classes.likeButton}
                onClick={async():Promise<void>=>{
                  if(!likePosts?.includes(post?._id)) setLikePosts([... likePosts, post?._id])
                  else setLikePosts(likePosts?.filter((likePostId: ObjectId)=> likePostId!==post?._id))

                  await updateUser({
                    variables: { email: user?.email, favorite_id : new ObjectId(post?._id), isFavorite: isExistArray(likePosts, post?._id)? false : true}
                  })
                  await userState.refetch()
                }}>
                {isExistArray(likePosts, post?._id)? 
                  <><FavoriteIcon/>&nbsp;Remove</>
                  : 
                  <><FavoriteBorderIcon/>&nbsp;Favorite</>
                }
              </Button>
            </Box>
          </>}

            {!isEdit && post?.archived && (user_id?.equals(buyer_id) || user_id?.equals(seller_id))  &&
              <Box mt={2}>
                <ChatDrawer
                  longButton={true}
                  isCreate={true}
                  user={tempUser}
                  other={tempOther}
                />
                <Typography align={'center'} display='block' color={'textSecondary'} variant={'caption'}>
                  <>
                    {user_id?.equals(buyer_id) && `Message the seller`}
                    {user_id?.equals(seller_id) && `Message the buyer`}
                  </>
                </Typography> 
              </Box>
            }

            {!post?.archived && user_id.equals(seller_id) && isEdit &&
             <>
             <Box mt={2} mb={2}>
                <Button
                  fullWidth 
                  className={classes.unLikeButton}
                  onClick={async(): Promise<void>=>{
                    let updateItemVariable: ItemUpdateArgs = { _id : new ObjectId(post?.item?._id) }
                    if(title) updateItemVariable.title = title
                    if(description) updateItemVariable.description = description
                    if(reason) updateItemVariable.reason = reason
                    await updateItem({variables: updateItemVariable})
                    router.push({
                      pathname: '/shop/item/[postId]',
                      query: { postId: post?._id.toString() }
                    })
                  }}
                >
                  <EditIcon/>&nbsp;Edit
                </Button>
            </Box>
            <Box>
                <Button
                  fullWidth 
                  className={classes.likeButton}
                  onClick={()=>setIsEdit(false)}
                >
                  Cancel
                </Button>
            </Box>
            </>
            }

          </Box>
        </Grid>
      </Grid>
      {!isEdit && post?.archived && !user_id?.equals(buyer_id) && !user_id?.equals(seller_id) &&
        <Box 
          position="absolute"
          height="100%"
          width="100%"
          top='0'
          left='0'
          display="flex"
          alignItems="center" 
          justifyContent="center"
        >
            <Typography align={'center'} color={'error'} variant={'h1'} className={classes.blinking}>
              <strong>{`SOLD!`}</strong>
            </Typography>            
        </Box>
      }

      <CommentSection
        post={post}
        user_id={new ObjectId(userState?.data?.findOneUser?._id)}
        full_name={userState?.data?.findOneUser?.full_name}
        imageUrl={userState?.data?.findOneUser?.imageUrl}
      />
    </Container>}
    </>
  )
}
export default ViewPost