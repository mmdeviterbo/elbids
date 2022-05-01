import React, {useState, ReactElement, Dispatch, SetStateAction} from 'react'
import { Typography, Button } from '@material-ui/core';
import { Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core';
import useStyles from './style'

const Terms=(
  {
    termsOpen,
    setTermsOpen
  }:{
    termsOpen: boolean
    setTermsOpen: Dispatch<SetStateAction<boolean>>
}): ReactElement=>{
  const classes = useStyles({})
  return(
    <Dialog
      fullWidth={true}
      maxWidth={'xs'}
      open={termsOpen}
      onClose={()=>setTermsOpen(!termsOpen)}
      aria-labelledby="max-width-dialog-title"
    >

    <DialogTitle id="max-width-dialog-title">
      <Typography variant="body1" align="center">Terms of Use</Typography>
    </DialogTitle>
    
    <DialogContent dividers>
      <Typography variant="body2">
        This web app is for educational purposes only. Any credentials such as ID image submission(s) will not be saved and is immediately deleted after the verification process.
      </Typography>
    </DialogContent>

    <DialogActions>
      <Button onClick={()=>setTermsOpen(false)}>Close</Button>
    </DialogActions>
    </Dialog>
  )
}
export default Terms