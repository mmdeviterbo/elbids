import React, {ReactElement} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { Typography, ListItem, ListItemText, Button, Box} from '@material-ui/core';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import Cookies from 'js-cookie'
import { useRouter } from 'next/router';
import { makeStyles, Theme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';


const useStyles = makeStyles((theme: Theme)=>({
  buttonBlack:{
    backgroundColor: theme.palette.common.black,
    color:theme.palette.common.white,
    border:'1px solid black',
    borderRadius:0,
    padding:theme.spacing(0.7),
    marginLeft:theme.spacing(1),
    "&:hover":{
      backgroundColor: 'rgba(20,20,20,0.85)',
    }
  }
}))

const BannedDialog=({
  open=false,
}:{
  open: boolean,
}): ReactElement=>{
  const router = useRouter()
  const classes = useStyles()
  return (
    <Dialog open={open}>
      <DialogTitle id="alert-dialog-title">
        <Typography color="textPrimary" variant="h5">
          <strong>{"Report"}</strong>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
            <ListItem>
              <NotInterestedIcon fontSize="large" color="error"/>&nbsp;&nbsp;
              <ListItemText primary={<Typography color="error" variant="subtitle1">You are currently banned from using Elbids!</Typography>}/>
            </ListItem>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Box px={4} pb={1}>
            <Button
              className={classes.buttonBlack}
              onClick={()=>{
                try{
                  Cookies.remove('currentUser')
                  router.push('/signin')
                }catch(err){
                  router.push('/signin')
                }
              }}
            >
              Sign out
            </Button>
          </Box>
        </DialogActions>
    </Dialog>
  );
}

export default BannedDialog