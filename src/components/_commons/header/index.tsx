import React, { ReactElement, useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, InputBase, Badge, MenuItem, Menu, Box, Divider, Tooltip, Avatar } from '@material-ui/core';
import { green, red, yellow } from '@material-ui/core/colors';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/PersonOutlineOutlined';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCartOutlined';
import NotificationsIcon from '@material-ui/icons/NotificationsNoneOutlined';
import MoreIcon from '@material-ui/icons/MoreVert';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import SettingsIcon from '@material-ui/icons/Settings';
import VerifiedUserIcon from '@material-ui/icons/CheckCircle';
import RejectedUserIcon from '@material-ui/icons/Cancel';
import UnverifiedUserIcon from '@material-ui/icons/NewReleases';
import WaitingUserIcon from '@material-ui/icons/Autorenew';
import {CATEGORY, PostFilter, TIMER_OPTIONS, STATUS, CookieArgs } from '../../../types'
import getUser from './../../../utils/getUser';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client'
import userQuery from './query'
import Cookies from 'js-cookie'
import useStyles from './style';
import queryString from 'query-string';
import ChatDrawer from '../../ChatDrawer'
import BannedDialog from './BannedDialog'
import RejectedDialog from './RejectedDialog'
import NotificationIcon from './NotificationsIcon'

const Header: NextPage=(): ReactElement=> {
  const user: CookieArgs = getUser()
  const classes = useStyles({});
  const router = useRouter()

  const queryMin_price = router.query.min_price as string
  const queryMax_price = router.query.max_price as string
  const queryCategory = router.query.category as string
  const queryDate_range = router.query.date_range as string
  const queryTimer = router.query.timer as string
  const querySearch = router.query.search as string
  const queryTags = router.query.tags as string

  const [getUserState, {data}] = useLazyQuery(userQuery,{
    variables: { email: user?.email},
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy:'cache-first',
    notifyOnNetworkStatusChange: true,
    pollInterval: 1000,

  })

  const statusTooltip=():string=>{
    const status: STATUS = data?.user?.status
    if(status === STATUS.WAITING) return "Your status is currently in reivew"
    else if(status === STATUS.UNVERIFIED) return "Submit your ID to verify"
    else if(status === STATUS.VERIFIED) return "Verified User"
    else return "Your status is rejected"
  }
  const handleStatusIcon=(): ReactElement=>{
    const status: STATUS = data?.user?.status
    if(status === STATUS.WAITING) return <WaitingUserIcon fontSize={'small'} color={'primary'}/>
    else if(status === STATUS.UNVERIFIED) return <UnverifiedUserIcon fontSize={'small'} style={{color: yellow[700]}}/>
    else if(status === STATUS.VERIFIED) return <VerifiedUserIcon fontSize={'small'} style={{color: green[500]}}/>
    else return <RejectedUserIcon fontSize={'small'} color={'error'} style={{color: red[500]}}/>
  }

  useEffect((): void=>{
    setSearch(querySearch || '')
  },[querySearch])

  useEffect((): void=>{
    user && getUserState()
  },[])


  useEffect((): void=>{
    if(data?.user && router.asPath!=='/verify' && (data?.user?.status===STATUS.UNVERIFIED || !data?.user?.status)){
      router.push('/verify')
    }
  },[data])

  const [search, setSearch] = useState<string>('')
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null)
  const [anchorElLogout, setAnchorElLogout] = useState<null | HTMLElement>(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleClickLogout=(event: React.MouseEvent<HTMLButtonElement>): void =>{
    setAnchorElLogout(event.currentTarget);
  }

  const handleCloseLogout = (): void => {
    setAnchorElLogout(null);
  };

  const handleMobileMenuClose=(): void=> {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>): void=> {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId: string = 'primary-search-account-menu-mobile';

  const renderMobileMenu: ReactElement = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      open={isMobileMenuOpen || false}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      onClose={handleMobileMenuClose}
    >
      <MenuItem
        onClick={(): void =>{
          router.push({
            pathname: "/[username]",
            query:  {username : user.email.split("@")[0]}
          })
        }}
      >
        <AccountCircle/>&nbsp;
        <p>Profile</p>
      </MenuItem>

      <MenuItem
        onClick={(): void =>{
          router.push('/cart')
        }}
      >
        <ShoppingCartIcon/>&nbsp;
        <p>Shopping Cart</p>
      </MenuItem>

      {data?.user?.admin &&
        <MenuItem onClick={()=>{
          router.push({
            pathname: "/[username]/admin",
            query:  {username : user.email.split("@")[0]}
          })
        }}>
          <SupervisorAccountIcon fontSize="small"/>&nbsp;
          <p>Admin Roles</p>
        </MenuItem>
      }

      <MenuItem
        onClick={async(): Promise<void> =>{
          await Cookies.remove('currentUser')
          router.replace('/signin')
        }}
      >
        <PowerSettingsNewIcon/>&nbsp;
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar elevation={1} position="static" color="default" className={classes.appBar}>
        <Toolbar>
            {/* title: Elbids */}
          {/* <Typography 
            variant="h6"
            color="textPrimary"
            onClick={()=>router.push('/shop')}
            className={classes.title}
          >
            ElBids
          </Typography> */}
          <img 
            src={'/assets/logo.png'}
            alt="elbids logo"
            draggable={false}
            className={classes.logoImg}
            onClick={()=>router.push('/shop')}
          />
          
          {/* <FilterSideBarMobile/> */}

          {/* search bar */}
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon/>
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              value={search || ''}
              onChange={(e)=>setSearch(e.target.value || '')}
              onKeyUp={(event): void => {
                if(event.key== 'Enter'){
                  let query: PostFilter = {}
                  if(queryMin_price) query.min_price = parseInt(queryMin_price)
                  if(queryMax_price) query.max_price = parseInt(queryMax_price)
                  if(queryTimer) query.timer = Object.values(TIMER_OPTIONS).find((timerVal: TIMER_OPTIONS)=>timerVal===queryTimer) || TIMER_OPTIONS.FIVE_DAYS
                  if(queryDate_range) query.date_range = queryDate_range
                  if(queryCategory) query.category = Object.values(CATEGORY).find((categoryVal: CATEGORY)=>categoryVal===queryCategory) || CATEGORY.ANY
                  if(queryTags) query.tags = queryTags
                  if(search) query.search = search
                  let queryPath: string = queryString.stringify(query)
                  router.push(`/shop?${queryPath}`)
                }
              }}
            />
          </div>
          <div className={classes.grow} />


          {/* desktop  view */}
          <div className={classes.sectionDesktop}>
            <ChatDrawer
              longButton={false}
              isCreate={false}
              isRead={true}
              user={data?.user}
            />

            <NotificationIcon user={data?.user}/>
            
            <Tooltip title="Cart">
              <IconButton aria-label="shopping cart" color="inherit" onClick={()=>router.push('/cart')}>
                <ShoppingCartIcon/>
              </IconButton>
            </Tooltip>

            <Tooltip title="Logout">
              <>
              <IconButton 
                aria-label="logout" 
                color="inherit" 
                edge="end"
                onClick={handleClickLogout}
              >
                <Badge color="secondary">
                  <ArrowDropDownIcon fontSize="small"/>
                </Badge>

              </IconButton>
              
              {user && 
              <Menu
                id="simple-menu"
                anchorEl={anchorElLogout}
                keepMounted
                open={(data?.user && Boolean(anchorElLogout)) || false}
                onClose={handleCloseLogout}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                className={classes.menu}
                disableScrollLock={true}
              >
                {data && 
                <Tooltip title={statusTooltip()} placement="left">
                <MenuItem 
                  className={classes.menuProfile}
                >
                  <Avatar alt="display picture" src={data?.user?.imageUrl}/> 
                  <Typography variant="body1" color="textPrimary">
                    <span style={{textTransform:'capitalize'}}>{data?.user?.full_name}</span>
                  </Typography>
                  <Box style={{display:'flex', alignItems:'center', justifyContent:'center', gap:4}}>
                    {handleStatusIcon()}
                    <Typography variant="caption" color="textSecondary">{data?.user?.status}</Typography>
                  </Box>
                </MenuItem>
                </Tooltip>
                }

                <Divider variant="fullWidth" style={{margin:3}}/>

                <MenuItem onClick={()=>{
                  setAnchorElLogout(null);
                  router.push({
                    pathname: "/[username]",
                    query:  {username : user.email.split("@")[0]}
                  })
                }}>
                  <SettingsIcon fontSize="small"/>
                  <Box ml={1}>
                    <Typography variant="body1">Settings</Typography>
                  </Box>
                </MenuItem>

                {data?.user?.admin && 
                  <MenuItem onClick={()=>{
                    setAnchorElLogout(null);
                    router.push({
                      pathname: "/[username]/admin",
                      query:  {username : user.email.split("@")[0]}
                    })
                  }}>
                    <SupervisorAccountIcon fontSize="small"/>
                    <Box ml={1}>
                      <Typography variant="body1">Admin Roles</Typography>
                    </Box>
                  </MenuItem>
                }
                <MenuItem onClick={(): void =>{
                  setAnchorElLogout(null);
                  Cookies.set('currentUser')
                  router.push('/signin')
                }}>
                  <PowerSettingsNewIcon fontSize="small"/>
                  <Box ml={1}>
                    <Typography variant="body1">Logout</Typography>
                  </Box>
                </MenuItem>
              </Menu>}
              </>
            </Tooltip>
          </div>


          {/* mobile view */}
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      <BannedDialog open={data?.user?.banned}/>
      <RejectedDialog open={data?.user?.status===STATUS.REJECTED? true : false}/>
    </div>
  );
}
export default Header