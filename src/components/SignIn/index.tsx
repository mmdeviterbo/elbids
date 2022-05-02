import React, {ReactElement, useState, useEffect} from 'react';
import GoogleLogin from 'react-google-login'
import Cookies from 'js-cookie'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { Grid, Typography, Link, Box, Button } from '@material-ui/core';
import { User } from "../../types"
import {insertUserMutation, updateUserMutation} from "./mutation"
import generateToken from './../../utils/generateToken';
import { STATUS } from '../../types';
import useStyles from './style'
import userQuery from './query';
import { useLazyQuery } from '@apollo/client';
import { NextPage } from 'next';
import SignInPassword from './SignInPassword'
import authenticate from './../../utils/authenticate';
import { SpinnerCircularFixed } from 'spinners-react';


const SignIn: NextPage =(): ReactElement=> {
  const [loader, setLoader]=useState<boolean>(true)
  const [email, setEmail] = useState<string>('')
  const [full_name, setFull_name] = useState<string>('')
  const [first_name, setFirst_name] = useState<string>('')
  const [last_name, setLast_name] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const [openPassword, setOpenPassword] = useState<boolean>(false)
  
  const classes = useStyles({})
  const router = useRouter()

  let loadingSpinner: ReactElement = (
    <SpinnerCircularFixed
      size={18}
      color={'#344345'}
      thickness={90}
      speed={250}
      enabled={true}
  />
  )

  useEffect(()=>{
    const validateCurrUser=async()=>{
      let res: boolean = await authenticate()
      if(res) router.push('/shop')
      else setLoader(false)
    }
    validateCurrUser()
  },[])

  const user: User = { 
    email, 
    full_name, 
    first_name, 
    last_name, 
    imageUrl, 
    date_created: new Date().toString(),
    status: STATUS.UNVERIFIED,
    deactivated:false,
    banned: false,
    report_count: 0,
    notification_count: 0,
    admin: false,
    token
  }

  const setCookies=(email: string, full_name: string, token: string, _id: string): void =>{
    const namesToken = { email, full_name, token, _id }
    Cookies.set('currentUser', JSON.stringify(namesToken), { 
      expires:1,
      secure: true,
      sameSite: 'strict'
    })
  }

  const [insertOneUser, insertOneUserState] = useMutation(insertUserMutation, {
    variables: user,
    notifyOnNetworkStatusChange:true,
    awaitRefetchQueries: true,
    onCompleted: (e): void => {
      const {email, full_name, token, _id} = e?.user
      setCookies(email, full_name, token, _id)
      router.push('/verify')
    }
  })
  const [updateUser, updateUserState] = useMutation(updateUserMutation,{
    notifyOnNetworkStatusChange:true
  })

  const [findOneUser, findOneUserState] = useLazyQuery(userQuery,{
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: 'cache-first',
    onCompleted:async(e):Promise<void> => {
      const userStatus: string = e?.user?.status
      if(!userStatus) await insertOneUser()
      else{
        const { email, full_name, token, _id } = e?.user
        setCookies(email, full_name, token, _id)
        await updateUser({ variables: { email, deactivated: false }})
        if(userStatus === STATUS.UNVERIFIED || userStatus === STATUS.REJECTED) router.push('/verify')
        else if(userStatus === STATUS.VERIFIED || userStatus === STATUS.WAITING) router.push('/shop')
      }
    }
  })


  const responseGoogleSuccess=async(response):Promise<void>=>{
    const {email, name, familyName, givenName, imageUrl} = response.profileObj
    setEmail(email)
    setFull_name(name)
    setFirst_name(givenName)
    setLast_name(familyName)
    setImageUrl(imageUrl)

    const full_name: string = name
    const token : string = await generateToken(email, full_name)
    setToken(token)
    await findOneUser({variables : { email }})
  }
  
  const responseGoogleFail=():void=>{}

  return (
    <>
      {!loader && 
      <>
      <Grid container className={classes.container}>
        <Grid item xs={6} className={classes.logoContainer}> 
          <img src={'/assets/oble.webp'} alt="" draggable={false} className={classes.logo}/>
        </Grid>
        <Grid item xs={6} className={classes.rightContainer}>
          <img src={'/assets/title.webp'} alt="" draggable={false} className={classes.title}/>
          <GoogleLogin
            clientId={"804855284131-20pnrqf3s9c9teqm76dlk6n5lo88er73.apps.googleusercontent.com"}
            render={renderProps => (
              <Button 
                onClick={renderProps.onClick} 
                disabled={renderProps.disabled || insertOneUserState?.loading || updateUserState?.loading ||  findOneUserState?.loading} 
                className={classes.loginButton}
                endIcon={(insertOneUserState?.loading || updateUserState?.loading ||  findOneUserState?.loading)? loadingSpinner : null}
              >
                <Typography variant="h6">Sign In</Typography>
              </Button>
            )}
            onSuccess={responseGoogleSuccess}
            onFailure={responseGoogleFail}
            cookiePolicy={'single_host_origin'}
          />

          <Box py={1}>
            <Typography variant="subtitle2">
              <Link href="#" color="textSecondary" onClick={()=>setOpenPassword(true)}>Sign in using password</Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <SignInPassword
        openPassword={openPassword}
        setOpenPassword={setOpenPassword}
      />
      </>}
    </>
  )
}
export default SignIn