import { ReactElement, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Container } from '@material-ui/core'
import { Tabs, Tab } from '@material-ui/core';
import useStyles from './style'
import userQuery from './query'
import { useQuery } from '@apollo/client';
import getUser from './../../utils/getUser';
import { CookieArgs, User } from './../../types';
import { useRouter } from 'next/router';
import VerificationTab from './VerificationTab';
import UsersTab from './UsersTab';
import ReportsTab from './ReportsTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

enum PANEL_SIZE{
  XS="xs",
  SM="sm",
  MD="md",
  lg="lg",
  xl="xl"
}

function TabPanel(props: TabPanelProps) {
  const classes = useStyles()
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      className={classes.tabPanel}
      {...other}
    >
      {value === index && (
        <Container>
          <Box p={4}>{children}</Box>
        </Container>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const Administrator: NextPage = (): ReactElement=> {
  const userCookie: CookieArgs = getUser()
  
  const router = useRouter()
  const classes = useStyles()
  const [value, setValue] = useState<number>(parseInt(localStorage.getItem('adminroles_index')  || "0"))
  const [panelSize, setPanelSize]=useState<PANEL_SIZE>(PANEL_SIZE.MD)

  const handleChange = (_ , newValue: number) => {
    setValue(newValue);
  };

  const userState = useQuery(userQuery ,{
    skip: !userCookie?._id,
    variables: { _id : userCookie?._id },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    pollInterval: 1000,
    onCompleted:(e)=>{
      if(e?.findOneUser?.admin === false) router.push('/shop')
    }
  })

  useEffect(()=>{
    if(!value && value !== 0){
      try{
        let adminroles_index = localStorage.getItem('adminroles_index')  || "0"
        setValue(parseInt(adminroles_index))
      }catch(err){
        setValue(0)
      }
    }
    if(value === 2) setPanelSize(PANEL_SIZE.lg)
    else setPanelSize(PANEL_SIZE.MD)
  },[value])

  return(
    <Container maxWidth={panelSize}>
      {(!userState?.data || !userState?.data?.findOneUser?.admin) && <div style={{height:"95vh"}}></div>}
      {userState?.data?.findOneUser?.admin && <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          className={classes.tabs}
        >
          {/* verify status*/}
          <Tab label={'Verification'} className={classes.tab} {...a11yProps(0)} /> 
    
          {/* additional of admins, ban accounts */}
          <Tab label={'Users'}  className={classes.tab} {...a11yProps(1)} />
          
          {/* summary of reports */}
          <Tab label={'Reports'}  className={classes.tab} {...a11yProps(2)} />
        </Tabs>

        <TabPanel value={value} index={0}>
          <VerificationTab user={userState?.data?.findOneUser}/>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <UsersTab user={userState?.data?.findOneUser}/>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <ReportsTab user={userState?.data?.findOneUser}/>
        </TabPanel>
      </div>}
    </Container>
  )
}
export default Administrator
