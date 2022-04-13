import React, { ReactElement, useEffect, useState, Dispatch, SetStateAction, MouseEvent } from 'react'
import "react-image-gallery/styles/css/image-gallery.css";
import { Post, DATE_FORMAT, ItemUpdateArgs, TIMER_OPTIONS, PreviewGallery } from '../../../types'
import { Box, Typography } from '@material-ui/core'
import { Grid, Button, Dialog, DialogTitle, DialogContent, Divider, Tooltip, Container } from '@material-ui/core';
import { Avatar, ListItem, ListItemText, ListItemAvatar, MenuItem, Menu } from '@material-ui/core';
import {Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import ImageGallery from 'react-image-gallery';
import { useQuery, useMutation } from '@apollo/client'
import GavelIcon from '@material-ui/icons/Gavel';
import PersonIcon from '@material-ui/icons/Person';
import TimerIcon from '@material-ui/icons/Timer';
import useStyles from './style'
import { updateItemMutation, updateUserMutation, updatePostMutation, deletePostMutation } from './mutation'
import { userQuery, postQuery, buyerQuery } from './query' 
import getUser from '../../../utils/getUser';
import { ObjectId, Binary } from 'bson';
import { formatPreviewGallery } from '../../../utils/formatGallery'
import Countdown from 'countdown-js'
import CommentSection from './CommentSection';
import { useRouter } from 'next/router';
import _ from 'lodash'
import formatDate from '../../../utils/formatDate';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

const ViewPostDialog=({
  postPreview,
  open,
  likePosts,
  handleLikeButton,
  followingPosts,
  handleFollowingButton,
  setOpen
}:{
  postPreview?: Post
  likePosts?: ObjectId[]
  handleLikeButton?: (post: Post)=>Promise<void>
  followingPosts?: ObjectId[]
  handleFollowingButton?: (post: Post)=>Promise<void>
  open?: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
}): ReactElement=>{
  const router = useRouter()
  const classes = useStyles()
  const [post, setPost]= useState<Post>(postPreview)
  const [gallery, setGallery]= useState<PreviewGallery[]>([]) //set of gallery, [][]
  const [isFinished, setIsFinished]= useState<boolean>(false)

  const [dateFirstBid, setDateFirstBid] = useState<string>(post?.item?.date_first_bid)
  const [timerLength, setTimerLength]= useState<TIMER_OPTIONS>(post?.item?.timer) //15s, 12 hours, 1 day, 2 days, 5 days
  const [anchorElLogout, setAnchorElLogout] = useState<null | HTMLElement>(null);

  const handleClickLogout=(event: MouseEvent<HTMLButtonElement>): void =>{
    setAnchorElLogout(event.currentTarget);
  }

  const handleCloseLogout = (): void => {
    setAnchorElLogout(null);
  };

  const isBidding=(post: Post): boolean=>{
    return post?.item?.additional_bid>0? true: false
  }

  const findPost = useQuery(postQuery,{
    skip: !post,
    variables: { _id: new ObjectId(post?._id), deleted: false, archived: false },
    notifyOnNetworkStatusChange: true,
    pollInterval: 500,
    fetchPolicy: 'cache-and-network'
  })

  const [updateUser] = useMutation(updateUserMutation,{
    notifyOnNetworkStatusChange: true,
  })

  const [deleteOnePost] = useMutation(deletePostMutation,{
    notifyOnNetworkStatusChange: true,
  })

  const userState = useQuery(userQuery,{    //who currently logged in
    skip: !getUser().email || !open,
    variables: { email : getUser().email },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network'
  })
  
  const findBuyer = useQuery(buyerQuery,{   //finds who is the current buyer
    skip: !post?.item?.buyer_id || !open,
    variables: { _id : new ObjectId(post?.item?.buyer_id) },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    pollInterval: 500
  })

  const [updateItem] = useMutation(updateItemMutation,{
    notifyOnNetworkStatusChange: true,
    onCompleted:async():Promise<void>=>{
      await updateUser({variables: {
        email: getUser()?.email,
        following_id: post?.item?._id
      }})
    }
  })

  const [updatePost] = useMutation(updatePostMutation,{
    notifyOnNetworkStatusChange: true,
    onCompleted:(): void=>{
      router.reload()
    }
  })

  useEffect((): void =>{
    setPost(postPreview)
    setDateFirstBid(postPreview?.item?.date_first_bid)
    setTimerLength(postPreview?.item?.timer)
    setGallery(formatPreviewGallery(postPreview?.item?.gallery?.data))
  },[postPreview, open])

  useEffect((): void =>{
    setPost(findPost?.data?.findOnePost)
    setDateFirstBid(findPost?.data?.findOnePost?.item?.date_first_bid)
  },[findPost?.data])

  let user_id: ObjectId = new ObjectId(userState?.data?.findOneUser?._id)
  let buyer_id: ObjectId = new ObjectId(post?.item?.buyer_id)
  let seller_id: ObjectId =  new ObjectId(post?.seller_id)
  
  const handleBidderButton=(): boolean =>{
    // if you are the creator, then you tried to buy your own item
    if(user_id.equals(seller_id)) return true

    // if you are the already the top bidder/buyer, then you tried to buy the item
    else if(user_id.equals(buyer_id)) return true
 
    return false
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

  if(!isFinished && isBidding(post) && isBidExist() && (days<0 || hours<0 || minutes<0 || seconds<0)){
    updatePost({variables: { _id : new ObjectId(post?._id), archived: true }})
    setIsFinished(true)
  }

  return(
    <>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={postPreview && post && open}
        onClose={()=>setOpen(false)}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="alert-dialog-slide-title">
          <Box justifyContent="flex-end" display="flex" alignItems="center" flexDirection="row">
            {user_id.equals(seller_id) && 
              <div>
                <ListItem alignItems="center">
                  <ListItemAvatar><Avatar src={userState?.data?.findOneUser?.imageUrl} /></ListItemAvatar>
                  <ListItemText 
                    primary={userState?.data?.findOneUser?.full_name}
                  />
                </ListItem>
              </div>
              }
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
                open={Boolean(anchorElLogout)}
                onClose={handleCloseLogout}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={async(): Promise<void> =>{
                  await deleteOnePost({variables : { _id : new ObjectId(post?._id) }})
                  router.reload()
                }}>Delete</MenuItem>
              </Menu>

              <IconButton 
                aria-label="close" 
                onClick={()=>setOpen(false)}
              >
                <CloseIcon fontSize="small"/>
              </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
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
                  <Tooltip title={post?.item?.title} placement={'top-start'}>
                    <Typography variant={'h3'} noWrap><strong>{post?.item?.title}</strong></Typography>
                  </Tooltip>
                </Box>

                <Box display={'flex'} justifyContent='space-between'pt={1}>
                  <div>
                    <Typography variant={'h5'} color="error" display="inline"><strong>{`PHP ${post?.item?.starting_price} `}</strong></Typography>
                    {isBidding(post) && 
                      <Tooltip title="Additional bid" placement="bottom-start">
                        <Typography variant={'subtitle1'} display="inline">{`(+${post?.item?.additional_bid})`}</Typography>
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
                  <Typography color="textSecondary" variant="body2">{post?.item?.description}</Typography>
                </Box>
                
                <Tooltip title="Reason for sale" placement="left">
                  <Box py={1}>
                    <Typography color="textPrimary" variant="body1">{'RFS'}</Typography>
                    <Typography color="textSecondary" variant="body2">{post?.item?.reason}</Typography>
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
                          <Typography color="textSecondary" variant="body2" component="span">{findBuyer?.data?.findOneUser?.full_name || ''}</Typography>
                          {findBuyer?.data?.findOneUser?._id === userState?.data?.findOneUser._id &&
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
                    disabled={handleBidderButton()}
                    fullWidth
                    className={followingPosts.includes(post?._id)? classes.unFollowingButton : classes.followingButton}
                    onClick={async(): Promise<void>=> await handleFollowingButton(post)}
                    >
                    {followingPosts.includes(post?._id)? 
                      <><NotificationsActiveIcon/>&nbsp;Unfollow</>
                      : 
                      <><NotificationsNoneOutlinedIcon/>&nbsp;Follow</>}
                  </Button>
                  
                  <Button
                    disabled={handleBidderButton()}
                    fullWidth 
                    className={likePosts.includes(post?._id)? classes.unLikeButton : classes.likeButton}
                    onClick={async(): Promise<void>=> await handleLikeButton(post)}
                  >
                    {likePosts.includes(post?._id)? 
                      <><FavoriteIcon/>&nbsp;Remove to favorites</>
                      : 
                      <><FavoriteBorderIcon/>&nbsp;Add to favorites</>}
                  </Button>
                </Box>
              </Box>
              </Grid>
          </Grid>

          {userState?.data?.findOneUser && 
            <CommentSection
              open={open}
              post_id={post?._id}
              user_id={new ObjectId(userState?.data?.findOneUser?._id)}
              full_name={userState?.data?.findOneUser?.full_name}
              imageUrl={userState?.data?.findOneUser?.imageUrl}
            />
          }
        </DialogContent>
      </Dialog>
    </>
  )
}
export default ViewPostDialog