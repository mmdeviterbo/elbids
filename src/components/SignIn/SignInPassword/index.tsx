import { ReactElement, SetStateAction, Dispatch, useState} from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, Box, TextField, Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { useLazyQuery, useMutation } from '@apollo/client';
import userQuery  from '../query'
import { updateUserMutation } from '../mutation'
import { useRouter } from 'next/router';
import useStyles from './style'
import authenticatePassword from './../../../utils/authenticatePassword';
import Cookies from 'js-cookie'

const SignInPassword=({
  openPassword,
  setOpenPassword,
}:{
  openPassword: boolean,
  setOpenPassword: Dispatch<SetStateAction<boolean>>,
}): ReactElement=> {
  const classes = useStyles()
  const router = useRouter()
  
  const [email, setEmail]=useState<string>('')
  const [password, setPassword]=useState<string>('')

  const [error, setError]=useState<boolean>(false)
  const [errorMessage, setErrorMessage]=useState<string>('')

  const setCookies=(email: string, full_name: string, token: string, _id: string): void =>{
    const namesToken = { email, full_name, token, _id }
    console.log(namesToken)
    Cookies.set('currentUser', JSON.stringify(namesToken), { 
      expires:1,
      secure: true,
      sameSite: 'strict'
    })
  }

  const [updateUser] = useMutation(updateUserMutation,{
    notifyOnNetworkStatusChange: true
  })

  const [findOneUser, { data, loading }] = useLazyQuery(userQuery,{
    ssr:false,
    fetchPolicy:'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onCompleted:async(e): Promise<void>=>{
      if(e?.user){
        if(!e?.user?.password){
          setErrorMessage('No password registered for this account.')
          setError(true)
        }
        if(e?.user?.password){
          let hashPass: string = e?.user?.password
          let isValidPass: boolean = await authenticatePassword(hashPass, email, password)
          if(isValidPass) {
            const { email, full_name, token, _id } = e?.user
            setCookies(email, full_name, token, _id)
            await updateUser({ variables: { email, deactivated: false }})
            setOpenPassword(false)
            router.push('/shop')
          }
          else {
            setErrorMessage('Incorrect password.')
            setError(true)
          }
        }
      }else {
        setError(true)
        setErrorMessage('User not found')
      }
    }
  })

  return(
    <Dialog
      open={openPassword}
      onClose={()=>setOpenPassword(false)}
      aria-labelledby="password-label"
      aria-describedby="password-description"
    >
    <DialogTitle id="password-id">
      <Box px={2}>{"Sign in using password"}</Box>
    </DialogTitle>
    <DialogContent>
      <Box px={2} pb={2}>
        <Typography>Email</Typography>
        <TextField 
          value={email}
          onChange={(e)=>{
            setError(false)
            setErrorMessage('')
            setEmail(e.target.value)
          }}
          type={"email"}
          fullWidth
          size="small"
          variant="outlined"
          className={classes.textfield}
        />
      </Box>

      <Box px={2} pb={2}>
        <Typography>Password</Typography>
        <TextField
          value={password}
          onChange={(e)=>{
            setError(false)
            setErrorMessage('')
            setPassword(e.target.value)}
          }
          fullWidth
          helperText={errorMessage}
          error={error}
          type={'password'}
          size="small"
          variant="outlined"
          className={classes.textfield}
          onKeyPress={async(e)=>{
            if(email?.length>0 && password?.length>0 && e.key==='Enter'){
              await findOneUser({variables : {email}})
            }
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
          onClick={async()=>{
            await findOneUser({variables : {email}})
          }}
          autoFocus
          className={classes.signin}
          disabled={email?.length===0 || password?.length===0 || loading}
        >
          Signin
        </Button>
      </Box>
    </DialogActions>
  </Dialog>
  )
}
export default SignInPassword
