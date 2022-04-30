import { ReactElement, SetStateAction, Dispatch, useState} from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Box, TextField, Typography } from '@material-ui/core';
import { Button, InputAdornment, IconButton } from '@material-ui/core';
import useStyles from '../style'
import { useMutation, useQuery } from '@apollo/client';
import { updateUserMutation } from './mutation'
import { UserDisplay } from '../../../types/index';
import { useRouter } from 'next/router';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import generatePassword from './../../../utils/generatePassword';

const CreatePasswordDialog=({
  openPassword,
  setOpenPassword,
  user,
  isCreate=true
}:{
  openPassword: boolean,
  setOpenPassword: Dispatch<SetStateAction<boolean>>,
  user: UserDisplay,
  isCreate?: boolean
}): ReactElement=> {
  const classes = useStyles()
  const router = useRouter()
  
  const [password, setPassword]=useState<string>('')
  const [repassword, setRepassword]=useState<string>('')
  const [isPasswordChanged, setIsPasswordChanged]=useState<boolean>(false)
  const [isRepasswordChanged, setIsRepasswordChanged]=useState<boolean>(false)

  const [showPassword, setShowPassword]=useState<boolean>(false)
  const [showRepassword, setShowRepassword]=useState<boolean>(false)


  const [updateUser, {called, loading}] = useMutation(updateUserMutation,{
    notifyOnNetworkStatusChange: true,
    onCompleted:(): void=>{
      router.reload()
    }
  })

  const handleCreatePassword=async(): Promise<void> =>{
    let hashPassword: string = await generatePassword(user?.email, password)
    await updateUser({variables:{
      _id: user?._id,
      password: hashPassword
    }})
  }

  const checkTwoPasswords=(): [boolean, string]=>{
    if(isPasswordChanged && isRepasswordChanged && password && repassword){
      return password!==repassword? [true,"Password mismatched."] : [false,""]
    }
    return [false, ""]
  }

  const handlePasswordValidator=(pass: string, isChanged: boolean):[boolean, string]=>{
    if(isChanged && pass?.length<5) return [true, "Password length must be at least 5 characters"]
    else return [false, ""]
  }

  return(
    <Dialog
      open={openPassword}
      onClose={()=>setOpenPassword(false)}
      aria-labelledby="password-label"
      aria-describedby="password-description"
    >
    <DialogTitle id="password-id">
      <Box px={2}>{"Create your password"}</Box>
    </DialogTitle>
    <DialogContent>
      <Box px={2} pb={2}>
        <Typography>Password</Typography>
        <TextField 
          value={password}
          onChange={(e)=>{
            !isPasswordChanged && setIsPasswordChanged(true)
            setPassword(e.target.value)
          }}
          type={showPassword? "text" : "password"}
          fullWidth
          error={handlePasswordValidator(password, isPasswordChanged)[0]}
          helperText={handlePasswordValidator(password, isPasswordChanged)[1]}
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

      <Box px={2} pb={2}>
        <Typography>Re-enter password</Typography>
        <TextField
          value={repassword}
          type={showRepassword? "text" : "password"}
          onChange={(e)=>{
            !isRepasswordChanged && setIsRepasswordChanged(true)
            setRepassword(e.target.value)
          }}
          error={handlePasswordValidator(repassword, isRepasswordChanged)[0] || checkTwoPasswords()[0]}
          helperText={handlePasswordValidator(repassword, isRepasswordChanged)[1] || checkTwoPasswords()[1]}
          fullWidth
          size="small"
          variant="outlined"
          className={classes.textfield}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {showRepassword? 
                  <IconButton style={{padding:0, margin: 0}} onClick={()=>setShowRepassword(!showRepassword)}>
                    <Visibility />
                  </IconButton>
                  :
                <IconButton style={{padding:0, margin: 0}} onClick={()=>setShowRepassword(!showRepassword)}>
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
      <Box p={2} py={1}>
        <Button 
          onClick={()=>setOpenPassword(false)}
          className={classes.button}
        >
          Cancel
        </Button>
        <Button
          onClick={()=>handleCreatePassword()}
          autoFocus
          className={classes.deactivate}
          startIcon={<VpnKeyIcon/>}
          disabled={!isPasswordChanged || !isRepasswordChanged || handlePasswordValidator(password, isPasswordChanged)[0] || handlePasswordValidator(repassword, isRepasswordChanged)[0] || checkTwoPasswords()[0]}
        >
          {isCreate? "Create" : "Update"}
        </Button>
      </Box>
    </DialogActions>
  </Dialog>
  )
}
export default CreatePasswordDialog
