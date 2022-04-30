import React, { ReactElement, useState } from 'react';
import { SwipeableDrawer, IconButton, Button } from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Chatbox from './Chatbox';
import useStyles from './style'
import { UserDisplay } from '../../types'

type Anchor = "right" | "bottom" | "left" | "top";

const ChatDrawer=({
  longButton=false,
  isCreate=false,
  isRead=false,
  user,
  other=null,
}:{
  longButton?: boolean    //if true, use <Button>, else it will use <IconButton>
  isCreate?: boolean
  isRead?: boolean
  user: UserDisplay         //who is the user current, either buyer/seller
  other?: UserDisplay        //other buyer/seller
}): ReactElement=>{
  const classes = useStyles()
  const anchor: Anchor = 'right'
  const [state, setState] = useState({right: false});

  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    setState({ ...state, [anchor]: open });
  };
  return(
    <>
      {longButton?
        <Button
          fullWidth 
          className={classes.unLikeButton}
          onClick={toggleDrawer(anchor, true)}
        >
        <MailOutlineIcon/>
        &nbsp;Message
      </Button>
        :
        <IconButton 
          color="inherit"  
          onClick={toggleDrawer(anchor, true)}
        >
          <MailOutlineIcon/>
        </IconButton>
      }
      
      <SwipeableDrawer
        anchor={anchor}
        open={state[anchor]}
        onClose={toggleDrawer(anchor, false)}
        onOpen={toggleDrawer(anchor, true)}
      >
        <Chatbox
          isCreate={isCreate}
          isRead={isRead}
          user={user}
          other={other}
        />
      </SwipeableDrawer>
    </>
  )
}
export default ChatDrawer