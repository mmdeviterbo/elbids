import React, {useState, useEffect, ReactElement} from 'react'
import { NextPage } from 'next';
import { useQuery } from '@apollo/client'
import { userQuery, usersQuery } from './query';
import { CookieArgs } from '../../types'
import getUser from '../../utils/getUser'
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import {User} from '../../types'
import CardItem from './Card'
import useStyles from './style'
import { useMutation } from '@apollo/client';
import mutation from './mutation'
import { STATUS } from '../../types'
import { ObjectId } from 'bson';

const AdminVerify: NextPage=(): ReactElement=>{
  const classes = useStyles()
  const user: CookieArgs = getUser()
  const router = useRouter()
  
  const [users, setUsers] = useState<User[]>([])

  const { data, loading } = useQuery(userQuery,{
    variables: { email: user?.email},
    skip: !user,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })
  
  const usersState = useQuery(usersQuery,{
    variables: { email: user?.email, status: STATUS.WAITING},
    skip: !user,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onCompleted:(e): void =>{
      let tempUsers: User[] = e?.users.filter((tempUser: User)=>tempUser.email!==user?.email) 
      setUsers(tempUsers)
    },
    onError:(): void =>{
      router.reload()
    }
  })

  const [updateOneUser] = useMutation(mutation, {
    notifyOnNetworkStatusChange: true,
    onError:(): void =>{
      router.reload()
    }
  })

  const handleVerificationButton=(email: string, status: STATUS): void =>{
    let tempUsers: User[] = users.filter((user: User)=>user?.email!==email) 
    setUsers(tempUsers)
    updateOneUser({
      variables: { email, status } 
    })
  }

  const handleLoader=(): ReactElement=>{
    return (
    <>

    </>)
  }

  if(!user) router.push('/signin')

  return(
    <>
      {loading && usersState?.loading && <h2>{'Loading ...'}</h2>}
      {!loading && !data?.user?.admin && <h2>{'Unauthorized access'}</h2>}
      {!loading && data?.user?.admin && !usersState?.loading && 
        <Container className={classes.root}>
          <>
            { 
              users?.map((user: User): ReactElement=>{
                const {full_name, first_name, last_name, id, email, date_created, status, imageUrl, token} = user
                return(
                    <CardItem
                      key={token}
                      full_name={full_name} 
                      first_name={first_name} 
                      last_name={last_name}
                      id={id}
                      email={email}
                      date_created={date_created}
                      status={status}
                      imageUrl={imageUrl}
                      handleVerificationButton={handleVerificationButton}
                    />
                )
              })
            }
          </>
        </Container>
      }
    </>
  )
}
export default AdminVerify