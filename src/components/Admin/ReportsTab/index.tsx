import React, { ReactElement, useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { User, Post, CATEGORY, TIMER_OPTIONS } from '../../../types';
import UsersReport from './PrintReports/PrintUsersReport';
import ItemsReport from './PrintReports/PrintItemsReport';
import {Box, Typography, Button, IconButton } from '@material-ui/core'
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import { usersQuery, postsQuery } from './query'
import LoaderSpinner from '../../_commons/loaderSpinner'
import useStyles from './style'
import _ from 'lodash'
import PrintIcon from '@material-ui/icons/Print';
import DisplayItemsReport from './DisplayReports/DisplayItemsReport';
import DisplayUsersReport from './DisplayReports/DisplayUsersReport';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GroupIcon from '@material-ui/icons/Group';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { ListItemText, ListItem }from '@material-ui/core';
import { useRouter } from 'next/router';

const ReportsTab=({
  user
}:{
  user: User
}): ReactElement=>{
  const router = useRouter()
  const classes=useStyles()
  const componentRefUsers = useRef()
  const componentRefItems = useRef()

  const pageStyle = `
    @media print {
      @page { size: landscape; }
    }
  `

  const handlePrintUsers = useReactToPrint({
    content: () => componentRefUsers.current,
    pageStyle,
    documentTitle:'Elbids: Users',
  });

  const handlePrintItems = useReactToPrint({
    content: () => componentRefItems.current,
    pageStyle,
    documentTitle:'Elbids: Transaction History',

  });

  const [users,  setUsers] = useState<User[]>()
  const usersState = useQuery(usersQuery,{
    skip: !user || !user?.admin,
    variables: { email : user?.email },
    fetchPolicy:'cache-and-network',
    nextFetchPolicy:'cache-first',
    onCompleted:(e)=>{
      let tempUsers: User[] = e?.findManyUsers
      if((tempUsers && !users) || !_.isEqual(tempUsers, users)) setUsers([...tempUsers])
    }
  })

  const [posts,  setPosts] = useState<Post[]>()
  const [archived,  setArchived] = useState<boolean>()
  const [category,  setCategory] = useState<CATEGORY>()
  const [timer,  setTimer] = useState<TIMER_OPTIONS>()

  const postsState = useQuery(postsQuery,{
    skip: !user || !user?.admin,
    variables: { _id : user?._id },
    fetchPolicy:'cache-and-network',
    nextFetchPolicy:'cache-first',
    onCompleted:(e)=>{
      let summaryPosts: Post[] = e?.findSummaryReportPosts
      if((summaryPosts && !posts) || !_.isEqual(summaryPosts, posts)) setPosts([...summaryPosts])
    }
  })

  useEffect(()=>{
    if(user?.admin === false) router.push('/shop')
  },[user])

  useEffect(()=>{
    try{
      localStorage.setItem('adminroles_index', "2")
    }catch(err){}
  },[])


  return (
    <>
      <Box mb={4}>
        <Typography variant={'h5'}>
          <strong>Summary Reports</strong>
        </Typography>
      </Box>
      <LoaderSpinner isVisible={usersState.loading || postsState.loading}/>
      <Box className={classes.root}>
        
        <div style={{ display: 'none' }}>
          {users?.length>0 && <UsersReport users={users} ref={componentRefUsers}/>}
          {posts?.length>0 && <ItemsReport posts={posts} ref={componentRefItems}/>}
        </div>
      
        {users?.length>0 && posts?.length>0 &&
          <Accordion square={true}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ListItem>
              <GroupIcon fontSize="medium"/>&nbsp;&nbsp;
              <ListItemText primary={<Typography variant="body1"><strong>{'Users'}</strong></Typography>}/>
            </ListItem>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" justifyContent="space-between" flexDirection="column" width="100%">
              <DisplayUsersReport users={users}/>
              <Box display={'flex'} justifyContent="flex-end">
                <IconButton onClick={handlePrintUsers}><PrintIcon/></IconButton>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion> 
        }
        {users?.length>0 && posts?.length>0 &&
          <Accordion square={true}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ListItem>
              <ReceiptIcon fontSize="medium"/>&nbsp;&nbsp;
              <ListItemText primary={<Typography variant="body1"><strong>{'Transactions'}</strong></Typography>}/>
            </ListItem>
          </AccordionSummary>
          <AccordionDetails>
           <Box display="flex" justifyContent="space-between" flexDirection="column" width="100%">
              <DisplayItemsReport posts={posts}/>
              <Box display={'flex'} justifyContent="flex-end">
                <IconButton onClick={handlePrintItems} ><PrintIcon/></IconButton>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        }
      </Box>
    </>
    );
}
export default ReportsTab;



