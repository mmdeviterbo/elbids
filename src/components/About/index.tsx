import React, { useState, ReactElement, ChangeEvent} from 'react'
import { NextPage } from 'next'
import { Box, Typography, Container } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Link } from '@material-ui/core'

const useStyles =  makeStyles((theme: Theme)=>({
  root:{
    backgroundColor:theme.palette.common.white,
    padding:theme.spacing(4),
    height:"95vh" 
  },
  logo:{
    width:"70%",
  }
}))

const handleEmail=()=>{
  window.open('mailto:mmdeviterbo@up.edu.ph?subject=Elbids: UPLB Online Auction System')
}


const About: NextPage =(): ReactElement=>{
  const classes = useStyles()
  return(
    <Container maxWidth="sm" className={classes.root}>
      <Box display="flex" justifyContent="center">
        <img src={'/assets/title.webp'} alt="" draggable={false} className={classes.logo}/>
      </Box>
      
      <Box p={4}>
        <Typography variant="h5">
          <strong>About and Contacts</strong>
        </Typography>
        <br/>
        <Typography paragraph={true} align="justify">
          &nbsp;&nbsp;&nbsp;&nbsp;
          The <strong>ElBids: UPLB Online Auction System</strong> is a web application based from its original Facebook group named&nbsp;

          <Link rel="noopener noreferrer" href="https://www.facebook.com/groups/379192859313297" target="_blank">
            <strong>ElBids</strong>
          </Link>.
          With one of the admins' permission, this web app is mainly made to produce an efficient online auction system while having safer and transparent transactions only within the UPLB stakeholders.
        </Typography>


        <Typography paragraph={true} align="justify">
          &nbsp;&nbsp;&nbsp;&nbsp;
          This web app is for educational purposes only. Any credentials such as ID image submission(s) will not be saved and is immediately deleted after the verification process.
        </Typography>

        <Typography paragraph={true} align="justify">
          &nbsp;&nbsp;&nbsp;&nbsp;
          For any concerns, kindly contact the creator at&nbsp; 
          <Link rel="noopener noreferrer" href="javascript:void(0)" target="_blank" onClick={()=>handleEmail()}>
            <strong>mmdeviterbo@up.edu.ph</strong>
            
          </Link>
        </Typography>
      </Box>
    </Container>
  )
}
export default About