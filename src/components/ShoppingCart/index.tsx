import { ReactElement, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Typography, Container } from '@material-ui/core'
import { Tabs, Tab } from '@material-ui/core';
import useStyles from './style'
import userQuery from './query'
// import mutation from './mutation'
import { useQuery, useMutation } from '@apollo/client';
import getUser from './../../utils/getUser';
import { CookieArgs } from './../../types/index';
import FollowingTab from './FollowingTab';
import SoldTab from './SoldTab';
import BoughtTab from './BoughtTab';
import FavoriteTab from './FavoriteTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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
  const user: CookieArgs = getUser()
  const router = useRouter()
  const classes = useStyles()
  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const userState = useQuery(userQuery ,{
    skip: !user?.email,
    variables: { email : user?.email },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  })

  // const [doMutation, { loading }] = useMutation(mutation,{
  //   notifyOnNetworkStatusChange: true,
  // })

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
          <Tab label={'Following'} className={classes.tab} {...a11yProps(0)} />
          <Tab label={'Bought'}  className={classes.tab} {...a11yProps(1)} />
          <Tab label={'Sold'} className={classes.tab} {...a11yProps(2)} />
          <Tab label={'Favorites'} className={classes.tab} {...a11yProps(3)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <FollowingTab 
            user={userState?.data?.findOneUser}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <BoughtTab
            user={userState?.data?.findOneUser}
          
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <SoldTab
            user={userState?.data?.findOneUser}
          
          />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <FavoriteTab
            user={userState?.data?.findOneUser}
          
          />
        </TabPanel>
      </div>
    </Container>
  )
}
export default ShoppingCart
