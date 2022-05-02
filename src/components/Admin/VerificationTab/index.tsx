import React, {useState, useEffect, ReactElement} from 'react'
import { useQuery } from '@apollo/client'
import { userQuery, usersQuery } from './query';
import { useRouter } from 'next/router';
import { Container, Box, Typography } from '@material-ui/core';
import { User, STATUS } from '../../../types'
import useStyles from './style'
import { useMutation } from '@apollo/client';
import mutation from './mutation'
import LoaderSpinner from '../../_commons/loaderSpinner'
import TableAccordion from '../../_commons/tableAccordion';

const VerificationTab=({
  user
}:{
  user: User
}): ReactElement=>{
  const classes = useStyles()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])

  useEffect(()=>{
    if(user?.admin === false) router.push('/shop')
  },[user])

  const usersState = useQuery(usersQuery,{
    variables: { email: user?.email, status: STATUS.WAITING},
    skip: !user || !user?.admin,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onCompleted:(e): void =>{
      let tempUsers: User[] = e?.users?.filter((tempUser: User)=>tempUser.email!==user?.email) 
      setUsers(tempUsers)
    }
  })

  useEffect(()=>{
    try{
      localStorage.setItem('adminroles_index', "0")
    }catch(err){}
  },[])


  const [updateOneUser] = useMutation(mutation, {
    notifyOnNetworkStatusChange: true
  })

  const handleVerifyAccount=(email: string, status: STATUS): void =>{
    let tempUsers: User[] = users?.filter((user: User)=>user?.email!==email) 
    setUsers(tempUsers)
    updateOneUser({
      variables: { email, status } 
    })
  }

  return(
    <>
      <Box mb={4}>
        <Typography variant={'h5'}>
          <strong>Verification</strong>
        </Typography>
      </Box>
      <LoaderSpinner isVisible={usersState?.loading}/>
      {!usersState?.loading && users && users?.length===0 &&
        <Typography variant="subtitle1" align="center">
          <i>{'All users were already checked!'}</i>
        </Typography>
      }
      <Box className={classes.root}>
        <>
          {users?.map((user: User, index: number): ReactElement=>{
            return(
              <TableAccordion
                key={index}
                user={user}
                isVerification={true}
                handleVerifyAccount={handleVerifyAccount}
            />)
            })
          }
        </>
      </Box>
    </>
  )
}
export default VerificationTab