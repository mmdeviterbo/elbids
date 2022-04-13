import React, {ReactElement, SyntheticEvent, useState} from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const Notification=({
  isOpen,
  error,
  message
}:{
  isOpen: boolean
  error: boolean
  message: string
}):ReactElement=> {
  const [open, setOpen] = useState(isOpen);

  const handleClose=(event?: SyntheticEvent, reason?: string)=>{
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  return ( 
    <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
      <MuiAlert 
        onClose={handleClose} 
        severity={error? "error" : "success"}>
          {message}
      </MuiAlert>
    </Snackbar>
  )
}

export default Notification