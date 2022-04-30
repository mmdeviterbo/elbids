import { ReactElement, SetStateAction, Dispatch, useState} from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Box, TextField, Typography } from '@material-ui/core';
import { Button, InputAdornment, IconButton } from '@material-ui/core';
import useStyles from '../style'
import { useQuery } from '@apollo/client';
import { userQuery } from '../query'
import { UserDisplay } from '../../../types/index';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import authenticatePassword from './../../../utils/authenticatePassword';
import CreatePasswordDialog from '../CreatePasswordDialog';

const UpdatePasswordDialog=({
  openUpdatePassword,
  setOpenUpdatePassword,
  user
}:{
  openUpdatePassword: boolean,
  setOpenUpdatePassword: Dispatch<SetStateAction<boolean>>,
  user: UserDisplay
}): ReactElement=> {
  const classes = useStyles()
  
  const [password, setPassword]=useState<string>('')
  const [isPasswordChanged, setIsPasswordChanged]=useState<boolean>(false)
  const [showPassword, setShowPassword]=useState<boolean>(false)

  const [error, setError]=useState<boolean>(false)
  const [errorMessage, setErrorMessage]=useState<string>('')

  //reuse CreatePasswordDialog compoent
  const [openPassword, setOpenPassword]=useState<boolean>(false)

  const handlePasswordValidator=(pass: string, isChanged: boolean):[boolean, string]=>{
    if(isChanged && pass?.length<5) return [true, "Password length must be at least 5 characters"]
    else return [false, ""]
  }

  const handleOldPassword=async(): Promise<void>=>{
    let hashPassword: string = user?.password
    if(hashPassword){
      let isValid: boolean = await authenticatePassword(hashPassword, user?.email, password)
      if(isValid) {
        setOpenUpdatePassword(false)
        setOpenPassword(true)
      }
      else {
        setErrorMessage('Incorrect password.')
        setError(true)
      }
    }
  }

  return(
    <>
      <Dialog
        open={openUpdatePassword}
        onClose={()=>setOpenUpdatePassword(false)}
        aria-labelledby="password-label"
        aria-describedby="password-description"
      >
      <DialogTitle id="password-id">
        <Box px={2}>{"Change password"}</Box>
      </DialogTitle>
      <DialogContent>
        <Box px={2} pb={1}>
          <Typography>Enter old password</Typography>
          <TextField 
            value={password}
            onChange={(e)=>{
              setError(false)
              setErrorMessage('')
              !isPasswordChanged && setIsPasswordChanged(true)
              setPassword(e.target.value)
            }}
            type={showPassword? "text" : "password"}
            fullWidth
            error={handlePasswordValidator(password, isPasswordChanged)[0] || error}
            helperText={handlePasswordValidator(password, isPasswordChanged)[1] || errorMessage}
            size="small"
            variant="outlined"
            className={classes.textfield}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {showPassword? 
                    <IconButton style={{padding:0, margin: 0}} onClick={()=>setShowPassword(!showPassword)}>
                      <Visibility />
                    </IconButton>
                    :
                  <IconButton style={{padding:0, margin: 0}} onClick={()=>setShowPassword(!showPassword)}>
                    <VisibilityOff />
                  </IconButton>
                  }
                </InputAdornment>
              )
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Box p={4} py={1}>
          <Button 
            onClick={()=>setOpenUpdatePassword(false)}
            className={classes.button}
          >
            Cancel
          </Button>
          <Button
            onClick={()=>handleOldPassword()}
            autoFocus
            className={classes.deactivate}
            startIcon={<VpnKeyIcon/>}
            disabled={!isPasswordChanged || handlePasswordValidator(password, isPasswordChanged)[0]}
          >
            Confirm
          </Button>
        </Box>
      </DialogActions>
    </Dialog>

    <CreatePasswordDialog
      openPassword={openPassword}
      setOpenPassword={setOpenPassword}
      user={user}
      isCreate={false}
    />

  </>
  )
}
export default UpdatePasswordDialog
