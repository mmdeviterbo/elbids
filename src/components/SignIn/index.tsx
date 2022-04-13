import React, {ReactElement, useState, useEffect} from 'react';
import axios from 'axios';
import GoogleLogin from 'react-google-login'
import Cookies from 'js-cookie'
import { ObjectId } from 'bson';
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { Grid } from '@material-ui/core';
import { User } from "../../types"
import mutation from "./mutation"
import generateToken from './../../utils/generateToken';
import { getURI } from '../../utils/getURI';
import { STATUS } from '../../types';
import useStyles from './style'
import userQuery from './query';
import { useLazyQuery } from '@apollo/client';
import { NextPage } from 'next';


const SignIn: NextPage =(): ReactElement=> {
  const [imageLoading, setImageLoading] = useState<boolean>(true)
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [titleUrl, setTitleUrl] = useState<string>('')
  
  const [email, setEmail] = useState<string>('')
  const [full_name, setFull_name] = useState<string>('')
  const [first_name, setFirst_name] = useState<string>('')
  const [last_name, setLast_name] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [token, setToken] = useState<string>('')
  
  const classes = useStyles({})
  const router = useRouter()

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

  const setCookies=(email: string, full_name: string, token: string): void =>{
    const namesToken = { email, full_name, token }
    Cookies.set('currentUser', JSON.stringify(namesToken), { 
      expires:1,
      secure: true,
      sameSite: 'strict'
    })
  }

  const [insertOneUser] = useMutation(mutation, {
    variables: user,
    notifyOnNetworkStatusChange:true,
    awaitRefetchQueries: true,
    onCompleted: (e): void => {
      const {email, full_name, token} = e?.user
      setCookies(email, full_name, token)
      router.push('/verify')
    }
  })

  const [findOneUser] = useLazyQuery(userQuery,{
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onCompleted:async(e):Promise<void> => {
      const userStatus: string = e?.user?.status
      if(!userStatus) await insertOneUser()
      else{
        const {email, full_name, token} = e?.user
        setCookies(email, full_name, token)
        if(userStatus === STATUS.UNVERIFIED || userStatus === STATUS.REJECTED) router.push('/verify')
        else if(userStatus === STATUS.VERIFIED || userStatus === STATUS.WAITING) router.push('/shop')
      }
    },
    onError:(e): void => {
      console.log('Fail')
      console.log(e)
    }
  })

  const handleHomeAssets=async(): Promise<void> =>{
    const getLogo = await axios({
      url:getURI('/find-image-asset'),
      method: 'POST',
      data: { _id : new ObjectId('61e805737e05cb32e6ae7a58') }
    })

    const getTitle = await axios({
      url: getURI('/find-image-asset'),
      method: 'POST',
      data: { _id : new ObjectId('61e8058a7e05cb32e6ae7a59') }
    })
    
    setLogoUrl(getLogo?.data?.data)
    setTitleUrl(getTitle?.data?.data)
    setImageLoading(false);
  }

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

  useEffect(()=>{
    handleHomeAssets()
  },[])

  return (
    <>
      {!imageLoading? (
        <>
          <Grid container className={classes.container}>
            <Grid item xs={6}> 
              {logoUrl && <img src={`data:image/png;base64,${logoUrl}`} alt="" draggable={false} className={classes.logo}/>}
            </Grid>
            <Grid item xs={6} className={classes.rightContainer}>
              {titleUrl && <img src={`data:image/png;base64,${titleUrl}`} draggable={false} alt="" className={classes.title}/>}
              <GoogleLogin
                clientId={"804855284131-20pnrqf3s9c9teqm76dlk6n5lo88er73.apps.googleusercontent.com"}
                render={renderProps => (
                  <button onClick={renderProps.onClick} disabled={renderProps.disabled} className={classes.loginButton}>
                    Sign In
                  </button>
                )}
                onSuccess={responseGoogleSuccess}
                onFailure={responseGoogleFail}
                cookiePolicy={'single_host_origin'}
              />
            </Grid>
          </Grid>
        </>
      ) : <h1>Loading ...</h1>}
    </>
  )
}
export default SignIn