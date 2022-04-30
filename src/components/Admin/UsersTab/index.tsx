import React, {useState, useEffect, ReactElement} from 'react'
import { useQuery } from '@apollo/client'
import { usersQuery } from './query';
import { useRouter } from 'next/router';
import { Box, Typography } from '@material-ui/core';
import { STATUS, User, UserUpdateArgs } from '../../../types'
import useStyles from './style'
import { useMutation } from '@apollo/client';
import mutation from './mutation'
import LoaderSpinner from '../../_commons/loaderSpinner'
import TableAccordion from '../../_commons/tableAccordion';

const UsersTab=({
  user
}:{
  user: User
}): ReactElement=>{
  const classes = useStyles()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])

  useEffect(()=>{
    if(user && !user?.admin) router.push('/shop')
  },[user])

  const usersState = useQuery(usersQuery,{
    variables: { email: user?.email, status: STATUS.VERIFIED},
    skip: !user || !user?.admin,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    ssr:false,
    notifyOnNetworkStatusChange: true,
    onCompleted:(e): void =>{
      let tempUsers: User[] = e?.users?.filter((tempUser: User)=>tempUser.email!==user?.email) 
      setUsers(tempUsers)
    }
  })

  useEffect(()=>{
    try{
      localStorage.setItem('adminroles_index', "1")
    }catch(err){}
  },[])


  const [updateOneUser] = useMutation(mutation, {
    notifyOnNetworkStatusChange: true,
    onCompleted:async():Promise<void>=>{
      await usersState.refetch()
    }
  })

  const handleBanAccount=async(email: string, banned: boolean): Promise<void> =>{
    console.log('Fun')
    console.log(banned)
    let updateArgs: UserUpdateArgs = { email, banned }
    await updateOneUser({variables : { ...updateArgs }}) 
  }

  const handleAddAdminAccount=async(email: string, admin: boolean): Promise<void> =>{
    let updateArgs: UserUpdateArgs = { email, admin }
    await updateOneUser({variables : { ...updateArgs }}) 
  }

  return(
    <>
      <Box mb={4}>
        <Typography variant={'h5'}>
          <strong>Users</strong>
        </Typography>
      </Box>
      <LoaderSpinner isVisible={usersState?.loading}/>
      {!usersState?.loading && users?.length===0 &&
        <Typography variant="subtitle1" align="center">
          <i>{'No users are currently registered!'}</i>
        </Typography>
      }
      <Box className={classes.root}>
        <>
          {users?.map((user: User, index: number): ReactElement=>{
            return (
              <TableAccordion
                key={index}
                user={user}
                isUsers={true}
                handleBanAccount={handleBanAccount}
                handleAddAdminAccount={handleAddAdminAccount}
              />
          )})
          }
        </>
      </Box>
    </>
  )
}
export default UsersTab