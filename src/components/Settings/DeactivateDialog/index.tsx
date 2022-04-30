import { ReactElement, SetStateAction, Dispatch} from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Box} from '@material-ui/core';
import { Button } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import useStyles from '../style'
import { useMutation } from '@apollo/client';
import { updateUserMutation } from './mutation'
import Cookies from 'js-cookie'
import { UserDisplay } from '../../../types/index';
import { useRouter } from 'next/router';

const CreatePasswordDialog=({
  openDeactivate,
  setOpenDeactivate,
  user
}:{
  openDeactivate: boolean,
  setOpenDeactivate: Dispatch<SetStateAction<boolean>>,
  user: UserDisplay
}): ReactElement=> {
  const classes = useStyles()
  const router = useRouter()
  
  const [updateUser] = useMutation(updateUserMutation,{
    notifyOnNetworkStatusChange: true,
    onCompleted:()=>{
      Cookies.remove('currentUser')
      router.push('/sign')
    }
  })

  const handleDeactivate=async(): Promise<void> =>{
    await updateUser({variables:{
      email: user?.email,
      deactivated: true
    }})
  }

  return(
    <Dialog
      open={openDeactivate}
      onClose={()=>setOpenDeactivate(false)}
      aria-labelledby="deactivate-label"
      aria-describedby="deactivate-description"
    >
    <DialogTitle id="deactivate-id">
      <Box p={2} py={0}>{"Deactivate your account?"}</Box>
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        <Box p={2} py={0}>
          This will hide all your posts or items. You can reactivate once you logged in.
        </Box>
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Box p={2} py={1}>
        <Button 
          onClick={()=>setOpenDeactivate(false)}
          className={classes.button}
        >
          Cancel
        </Button>
        <Button
          onClick={()=>handleDeactivate()}
          autoFocus
          className={classes.deactivate}
          startIcon={<HighlightOffIcon/>}
        >
          Deactivate
        </Button>
      </Box>
    </DialogActions>
  </Dialog>
  )
}
export default CreatePasswordDialog
