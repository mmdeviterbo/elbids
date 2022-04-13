import React, { useState, ReactElement, ChangeEvent} from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Paper, Button, Typography } from '@material-ui/core'
import { Divider, Link, Grid } from '@material-ui/core'
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import SendIcon from '@material-ui/icons/Send'
import axios from 'axios'
import { getURI } from '../../utils/getURI'
import Terms from './Terms'
import mutation from './mutation'
import { useMutation, useQuery } from '@apollo/client';
import getUser from '../../utils/getUser'
import { STATUS } from '../../types'
import useStyles from './style'
import Notification from './../_commons/notification';
import userQuery from './query'
import { CookieArgs } from '../../types'
import { ObjectId } from 'bson'


const VerifyAccount: NextPage =(): ReactElement=>{
  const router = useRouter()
  const user: CookieArgs = getUser()

  const [imageID, setImageID] = useState<File>()
  const [termsOpen, setTermsOpen] = useState<boolean>(false)
  const [openError, setOpenError]=useState<boolean[]>([false,false])
  const [errorMessage, setErrorMessage]=useState<string>('')
  const classes = useStyles({})

  const {data, loading } = useQuery(userQuery,{
    variables: {email: user?.email},
    skip: !user,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onCompleted:async(e):Promise<void> => {
      const userStatus: STATUS = e?.user?.status
      if(userStatus){
        if(userStatus === STATUS.VERIFIED || userStatus === STATUS.WAITING) router.push('/shop')
      }else router.push('/signin')
    }
  })

  const [updateOneUser] = useMutation(mutation, {
    notifyOnNetworkStatusChange: true,
  	onCompleted:(): void => {
      router.push('/shop')
    },
	  onError: (): void => {
      setErrorMessage('Error updating your status')
      setOpenError([true,true])
    }
  })

  const handleSubmit=async(): Promise<void>=>{
    const formData: FormData = new FormData()
    formData.append('file', imageID)

    const saveImage = await axios({
      url: getURI('/insert-image-id'), 
      method: 'POST',
      data: formData
    })

    const updateOneUserVariables = {
      id: new ObjectId(saveImage?.data?.insertedId),
      email: user?.email,
      status: STATUS.WAITING
    }

    if(!saveImage?.data?.acknowledged){
      setErrorMessage('Error uploading your ID')
      setOpenError([true,true])
    }else await updateOneUser({variables : updateOneUserVariables})
  }

  return(
    <div className={classes.root}>
      {!loading && <Paper elevation={3} className={classes.container}>
          <Typography align="center" variant="h6" className={classes.title}>Account Verification</Typography>
        <Paper elevation={1} className={classes.innerContainer}>
          <div>
            <Typography align="center" color="textSecondary" variant="body2">
              <Link component="button" onClick={()=>setTermsOpen(true)}>Terms of Use</Link>
            </Typography> 
          </div>
          <div className={classes.imageHolder}>
            {imageID && <img src={URL.createObjectURL(imageID)} className={classes.image}/>}
          </div>
          <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file"
            type="file"
            onChange={(e: ChangeEvent<HTMLInputElement>)=>setImageID(e.target.files[0])}
          />

          <label htmlFor="contained-button-file" style={{display:'grid', placeItems:'center', marginBottom:'5px'}}>
            {!imageID && <Typography align="center" color="textSecondary" variant="body1" paragraph>Upload your UP ID here </Typography>}
            <Button variant="contained" component="span" startIcon={<PhotoCamera/>} size="small" >Upload</Button>
          </label>
          <Divider/>
          <Grid container justifyContent='flex-end' spacing={1}>
            <Grid item>
              <Button onClick={()=>router.push('/shop')}>Skip</Button>
            </Grid>
            <Grid item>
              <Button 
                variant="contained" 
                className={classes.submit} 
                endIcon={<SendIcon/>}
                onClick={handleSubmit}
                disabled={imageID? false : true}
                >
                  Verify
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Paper>}
      <Terms setTermsOpen={setTermsOpen} termsOpen={termsOpen}/>
      {openError[0] && <Notification isOpen={openError[0]} error={openError[1]} message={errorMessage}/>}
    </div>
  )
}
export default VerifyAccount