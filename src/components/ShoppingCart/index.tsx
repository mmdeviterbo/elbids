import { ReactElement, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Container } from '@material-ui/core'
import { Tabs, Tab } from '@material-ui/core';
import useStyles from './style'
import userQuery from './query'
import { useQuery } from '@apollo/client';
import getUser from './../../utils/getUser';
import { CookieArgs, UserDisplay } from './../../types';
import FollowingTab from './FollowingTab';
import MyPostsTab from './MyPostsTab';
import BoughtTab from './BoughtTab';
import FavoriteTab from './FavoriteTab';
import ArchivedTab from './ArchivedTab';
import _ from 'lodash'

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
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

const ShoppingCart: NextPage = (): ReactElement=> {
  const userCookie: CookieArgs = getUser()
  const classes = useStyles()
  const [value, setValue] = useState<number>(parseInt(localStorage.getItem('cart_index')  || "0"));
  const [user, setUser]=useState<UserDisplay>()

  const handleChange = (_ , newValue: number) => {
    setValue(newValue);
  };

  const userState = useQuery(userQuery ,{
    skip: !userCookie?.email,
    variables: { email : userCookie?.email },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  })

  useEffect(()=>{
    if(!user || !_.isEqual(user, userState?.data?.findOneUser)){
      setUser(userState?.data?.findOneUser)
    }
  },[userState?.data])

  useEffect(()=>{
    if(!value && value !== 0){
      try{
        let cart_index = localStorage.getItem('cart_index')  || "0"
        setValue(parseInt(cart_index))
      }catch(err){
        setValue(0)
      }
    }
  },[value])


  return(
    <Container maxWidth="md">
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          className={classes.tabs}
        >
          <Tab label={'My Items'} className={classes.tab} {...a11yProps(0)} />
          <Tab label={'Bought'}  className={classes.tab} {...a11yProps(1)} />
          <Tab label={'Following'} className={classes.tab} {...a11yProps(2)} />
          <Tab label={'Favorites'} className={classes.tab} {...a11yProps(3)} />
          <Tab label={'Archived'} className={classes.tab} {...a11yProps(4)} />
        </Tabs>

        <TabPanel value={value} index={0}>
          <MyPostsTab
            user={userState?.data?.findOneUser}
          />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <BoughtTab
            user={userState?.data?.findOneUser}
          />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <FollowingTab 
            user={userState?.data?.findOneUser}
          />
        </TabPanel>
        

        <TabPanel value={value} index={3}>
          <FavoriteTab
            user={userState?.data?.findOneUser}
          />
        </TabPanel>


        <TabPanel value={value} index={4}>
          <ArchivedTab
            user={userState?.data?.findOneUser}
          />
        </TabPanel>
      </div>
    </Container>
  )
}
export default ShoppingCart
