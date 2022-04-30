import { ReactElement, useState, useEffect, MouseEvent } from 'react';
import NotificationsIcon  from '@material-ui/icons/NotificationsNoneOutlined';
import { Tooltip, IconButton, Badge, Typography, Menu, MenuItem, ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core';
import { User, NOTIFICATION_TYPE, Notification } from '../../../../types'
import { useQuery, useMutation } from '@apollo/client';
import notificationQuery from './query'
import updateNotificationsMutation from './mutation';
import { useRouter } from 'next/router';
import useStyles from './style'
import _ from 'lodash'
import { titleCase } from 'title-case';

const NotificationIcon=({
  user
}:{
  user: User
}): ReactElement=>{
  const router = useRouter()
  const classes = useStyles()  

  const [length, setLength] = useState<number>(0)
  const [notifications, setNotifications]=useState<Notification[]>()
  const [anchorElLogout, setAnchorElLogout] = useState<null | HTMLElement>(null);

  const notificationsState = useQuery(notificationQuery,{
    skip: !user?._id,
    variables: { user_id : user?._id },
    notifyOnNetworkStatusChange: true,
    fetchPolicy:'cache-and-network',
    nextFetchPolicy:'cache-first',
    pollInterval: 1000,
    onCompleted:(e)=>{
      if(e?.notifications && !_.isEqual(e?.notifications, notifications)){
        setNotifications([...e?.notifications].reverse())
        let lenUnread: number = e?.notifications?.filter((notif: Notification)=>notif?.read === false)?.length
        setLength(lenUnread)
      }
    }
  })

  const [updateNotifications] = useMutation(updateNotificationsMutation,{
    notifyOnNetworkStatusChange: true,
    onError:(e)=>{
    }
  })


  const handleClickLogout=async(event: MouseEvent<HTMLButtonElement>): Promise<void> =>{
    setAnchorElLogout(event.currentTarget);
    await updateNotifications({variables: { user_id: user?._id }})
  }

  const handleCloseLogout = async(): Promise<void> => {
    setAnchorElLogout(null);
    await updateNotifications({variables: { user_id: user?._id }})
  };

  const returnBg=(read: boolean)=>{
    return read? {backgroundColor: "white"} : {backgroundColor: "rgba(245,245,245, 0.95)"} 
  }

  const createMenuItem=(notif: Notification): ReactElement=>{
    if(!notif) return <></>
      return(
        <MenuItem 
          key={notif?._id.toString()}
          style={returnBg(notif?.read)} 
          onClick={()=>{
            setAnchorElLogout(null);
            router.push({
              pathname:"/shop/item/[postId]",
              query: {postId : notif?.post?._id?.toString()}
            })
          }}>
          <ListItem alignItems="center" style={{padding:2, gap:"5px"}}>
              <ListItemAvatar>
                <Avatar 
                  src={`data:image/png;base64,${notif?.post?.item?.gallery?.data[0]}`}
                  style={{ height: '50px', width: '50px'}}
                  
                />
              </ListItemAvatar>
            {notif?.type === NOTIFICATION_TYPE.BOUGHT && 
              <ListItemText 
                primary={<Typography variant="subtitle2">{`You successfully bought the item`}</Typography>}
                secondary={<Typography variant="subtitle2" color="textSecondary">{`${notif?.post?.item?.title}`}</Typography>}
              />}

            {notif?.type === NOTIFICATION_TYPE.SOLD &&
              <ListItemText
                primary={<Typography variant="subtitle2">Your item has been sold</Typography>}
                secondary={<Typography variant="subtitle2" color="textSecondary">{`${notif?.post?.item?.title}`}</Typography>}
            />}

            {notif?.type === NOTIFICATION_TYPE.FOLLOWING &&
              <ListItemText
                primary={<Typography variant="subtitle2">{`${titleCase(notif?.post?.item?.buyer?.first_name.toLowerCase())} placed a bid for ₱${notif?.current_bid || notif?.post?.item?.current_bid}`}</Typography>}
                secondary={<Typography variant="subtitle2" color="textSecondary">{`${notif?.post?.item?.title}`}</Typography>}
            />}
          </ListItem>
        </MenuItem>
      )
  }

  return (
    <>
      <Tooltip title="Notification">
        <IconButton
          color="inherit" 
          onClick={handleClickLogout}
          >
          {length>0? <Badge badgeContent={length} color="secondary"><NotificationsIcon/></Badge> : <NotificationsIcon/>}
        </IconButton>
      </Tooltip>

      <Menu
        id="simple-menu"
        anchorEl={anchorElLogout}
        keepMounted
        open={(notifications && Boolean(anchorElLogout)) || false}
        onClose={handleCloseLogout}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        disableScrollLock={true}
      >
        <MenuItem style={{padding: 15, paddingTop: 0}} disabled>
          Notifications
        </MenuItem>
        {notifications?.map((notif: Notification): ReactElement=>createMenuItem(notif))}
        
        {notifications?.length === 0 && 
          <MenuItem style={{padding:'10px', paddingRight:"80px"}}>
            <Typography variant="body2" align="center" color="textSecondary">Empty</Typography>
          </MenuItem>
        }
      </Menu>
    </>
  )
}
export default NotificationIcon