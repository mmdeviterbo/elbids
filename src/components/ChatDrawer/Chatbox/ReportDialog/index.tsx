import { ReactElement, Dispatch, SetStateAction } from 'react';
import { ObjectId } from 'bson';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import userMutation from './mutation'
import { Dialog, DialogTitle, DialogContent, Typography, Button, DialogActions, Box, ListItem, ListItemText, DialogContentText} from '@material-ui/core';
import useStyles from './style'
import InfoIcon from '@material-ui/icons/Info';

const ReportDialog=({
  openReport,
  setOpenReport,
  user_id,
}:{
  openReport: boolean
  setOpenReport: Dispatch<SetStateAction<boolean>>
  user_id: ObjectId
}
): ReactElement=>{
  const classes = useStyles()
  
  const [updateOneUser, {loading}] = useMutation(userMutation,{
    variables: { _id : user_id, report_count: 1 },
    notifyOnNetworkStatusChange: true
  })
  
  return(
    <Dialog open={openReport} onClose={()=>setOpenReport(false)}>
      <DialogTitle id="report-id">
        <Typography color="textPrimary" variant="h5">
          <strong>{"Report"}</strong>
        </Typography>
      </DialogTitle>
      <DialogContent>
          <Box px={4} py={0}>
          <ListItem>
            <InfoIcon fontSize="large" color="error"/>&nbsp;&nbsp;
            <ListItemText primary={<Typography color="error" variant="subtitle1">
                Report this account?
            </Typography>}/>
          </ListItem>
          </Box>
      </DialogContent>
  <DialogActions>
    <Box p={2} py={1}>
      <Button onClick={()=>setOpenReport(false)} className={classes.button}>
        Cancel
      </Button>
      <Button
        onClick={async(): Promise<void>=>{
          await updateOneUser()
          setOpenReport(false)
        }}
        autoFocus
        className={classes.submit}
        disabled={loading}
      >
        Submit
      </Button>
    </Box>
  </DialogActions>
</Dialog>
  )
}
export default ReportDialog