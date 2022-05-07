import React, { ReactElement, useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { User, Post, Analytics } from '../../../types';
import UsersReport from './PrintReports/PrintUsersReport';
import ItemsReport from './PrintReports/PrintItemsReport';
import {Box, Typography, IconButton, Paper } from '@material-ui/core'
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import { usersQuery, postsQuery, analyticsQuery } from './query'
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
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import LocalMallIcon from '@material-ui/icons/LocalMall';

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

  const [analytics,  setAnalytics] = useState<Analytics>()
  const analyticsState = useQuery(analyticsQuery,{
    skip: !user || !user?.admin,
    fetchPolicy:'cache-and-network',
    nextFetchPolicy:'cache-first',
    returnPartialData: true,
    onCompleted:(e)=>{
      setAnalytics(e?.findAnalytics)
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

      <Box 
        display={'flex'}
        flexWrap={'wrap'}
        flexDirection={'row'}
        height={120}
        position={'relative'}
        justifyContent={'space-between'}
        mb={2}
      >
        <Paper style={{width:'24%', padding: 8 }} square>
          <ListItem>
            <GroupIcon fontSize="medium"/>&nbsp;&nbsp;
            <ListItemText primary={<Typography variant={'h6'}>Total Users</Typography>}/>
          </ListItem>
          <Typography variant={'body1'} color="textSecondary" align="center">{analytics?.users_count}</Typography>
        </Paper>
        <Paper style={{width:'24%', padding: 8 }} square>
          <ListItem>
            <LocalMallIcon fontSize="medium"/>&nbsp;&nbsp;
            <ListItemText primary={<Typography variant={'h6'}>Total Items</Typography>}/>
          </ListItem>
          <Typography variant={'body1'} color="textSecondary" align="center">{analytics?.posts_count}</Typography>
        </Paper>
        <Paper style={{width:'24%', padding: 8 }} square>
          <ListItem>
            <ReceiptIcon fontSize="medium"/>&nbsp;&nbsp;
            <ListItemText primary={<Typography variant={'h6'}>Total Sold</Typography>}/>
          </ListItem>
          <Typography variant={'body1'} color="textSecondary" align="center">
            {analytics?.sold_count}
          </Typography>
        </Paper>
        <Paper style={{width:'24%', padding: 8 }} square>
          <ListItem>
            <ShoppingCartIcon fontSize="medium"/>&nbsp;&nbsp;
            <ListItemText primary={<Typography variant={'h6'}>Total Cost</Typography>}/>
          </ListItem>
          <Typography variant={'body1'} color="textSecondary" align="center">
            {`₱${new Intl.NumberFormat().format(analytics?.total_cost || 0)}`}
          </Typography>
        </Paper>
      </Box>


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



