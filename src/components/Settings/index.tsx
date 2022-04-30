import { ReactElement, useEffect, useState} from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container, Box, Typography, Button, IconButton, TextField, Divider, Tooltip } from '@material-ui/core';
import useStyles from './style'
import { userQuery } from './query'
import { useQuery, useMutation } from '@apollo/client';
import { CookieArgs, User, DATE_FORMAT } from '../../types'
import getUser from '../../utils/getUser';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import DeactivateDialog from './DeactivateDialog'
import CreatePasswordDialog from './CreatePasswordDialog'
import formatDate from '../../utils/formatDate';
import UpdatePasswordDialog from './UpdatePasswordDialog';

const Settings: NextPage = (): ReactElement=> {
  const userCookie: CookieArgs = getUser()
  const router = useRouter()
  const classes = useStyles()

  const [user, setUser] = useState<User>(null)
  const [openDeactivate, setOpenDeactivate] = useState<boolean>(false)
  const [openPassword, setOpenPassword] = useState<boolean>(false)
  const [openUpdatePassword, setOpenUpdatePassword] = useState<boolean>(false)

  const userState = useQuery(userQuery,{
    skip: !userCookie?.email,
    variables: { email: userCookie?.email },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    ssr: false,
    onCompleted:(e)=>{
      setUser(e?.findOneUser)
    }
  })

  return(
    <Container maxWidth={'sm'} className={classes.root}>
      <Box pb={4}>
        <Typography variant="h4">Settings</Typography>
      </Box>
      
      {user && 
        <Box display="flex" flexDirection="column"  justifyContent="space-between">
          <Box mb={2}>
            <Tooltip title="Cannot be edited" placement="right">
              <Typography variant="subtitle1">{user?.first_name?.toUpperCase()}</Typography>
            </Tooltip>
            <Divider/>
            <Typography variant="caption" color="textSecondary">FIRST NAME</Typography>
          </Box>

          <Box mb={2}>
            <Tooltip title="Cannot be edited" placement="right">
              <Typography variant="subtitle1">{user?.last_name?.toUpperCase()}</Typography>
            </Tooltip>
            <Divider/>
            <Typography variant="caption" color="textSecondary">LAST NAME</Typography>
          </Box>



          <Box mb={2}>
            <Tooltip title="Cannot be edited" placement="right">
              <Typography variant="subtitle1">
                {user?.status?.toUpperCase()}
              </Typography>
            </Tooltip>
            <Divider/>
            <Typography variant="caption" color="textSecondary">STATUS</Typography>
          </Box>

          <Box mb={2}>
            <Tooltip title="Cannot be edited" placement="right">
              <Typography variant="subtitle1">{user?.email?.toUpperCase()}</Typography>
            </Tooltip>
              <Divider/>
              <Typography variant="caption" color="textSecondary">EMAIL</Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="subtitle1">{formatDate(user?.date_created, DATE_FORMAT.DATE_HOUR).toUpperCase()}</Typography>
            <Divider/>
            <Typography variant="caption" color="textSecondary">DATE JOINED</Typography>
          </Box>

          <Box mb={6}>
            <Typography variant="subtitle1">{user?.report_count}</Typography>
            <Divider/>
            <Typography variant="caption" color="textSecondary">REPORT COUNT</Typography>
          </Box>

        <Box mb={2}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-end">
          {user?.password? 
            <Button
              className={classes.password}
              onClick={()=>setOpenUpdatePassword(true)}
            >Change Password</Button> 
            : 
            <Button 
              className={classes.password}
              startIcon={<LockOpenIcon/>}
              onClick={()=>setOpenPassword(true)}
            >Create Password</Button>
          }
          
          <Button 
            className={classes.deactivate}
            startIcon={<HighlightOffIcon/>}
            onClick={()=>setOpenDeactivate(true)}
          >
            Deactivate
          </Button>
        </Box>
        </Box>
      }

      <DeactivateDialog
        openDeactivate={openDeactivate}
        setOpenDeactivate={setOpenDeactivate}
        user={user}
      />

      <CreatePasswordDialog
        openPassword={openPassword}
        setOpenPassword={setOpenPassword}
        user={user}
      />

      <UpdatePasswordDialog
        openUpdatePassword={openUpdatePassword}
        setOpenUpdatePassword={setOpenUpdatePassword}
        user={user}
      />
    </Container>
  )
}
export default Settings
