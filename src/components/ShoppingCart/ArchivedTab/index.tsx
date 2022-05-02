import { ReactElement, useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Divider, Button, Tooltip, IconButton } from '@material-ui/core'
import useStyles from './style'
import archivedQuery from './query'
import { useQuery } from '@apollo/client';
import {  UserDisplay, Post } from '../../../types';
import LoaderSpinner from '../../_commons/loaderSpinner'
import CardCard from '../../_commons/cartCard';
import _ from 'lodash'

const ArchivedTab= (
  {
    user
  }:{
    user: UserDisplay
  }
): ReactElement=> {
  const router = useRouter()
  const classes = useStyles()

  const [archivedPosts, setArchivedPosts]=useState<Post[]>()

  const archivedPostsState = useQuery(archivedQuery,{
    skip: !user?._id,
    variables: { _id: user?._id, archived: true },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  })

  useEffect(()=>{
    if(archivedPostsState?.data?.findSummaryReportPosts){
      let newArchivedPosts: Post[] = [...archivedPostsState?.data?.findSummaryReportPosts].reverse()
      if(!_.isEqual(newArchivedPosts, archivedPosts)){
        setArchivedPosts(newArchivedPosts)
      }
    }
  },[archivedPostsState?.data])

  useEffect(()=>{
    try{
      localStorage.setItem('cart_index', "4")
    }catch(err){}
  },[])


  return(
    <Box>
      <Box mb={4}>
        <Typography variant={'h5'}><strong>Archived Items</strong></Typography>
      </Box>
      <LoaderSpinner isVisible={archivedPostsState?.loading}/>
      {archivedPosts?.map((archivedPost: Post): ReactElement=>{
        return (
          <CardCard
            key={archivedPost?._id.toString()}
            post={archivedPost}
            isClickable={false}
          />
        )
      })}
      {!archivedPostsState?.loading && (!archivedPosts || archivedPosts?.length===0) &&
        <Typography variant="subtitle1" align="center">
          <i>{'No items founds'}</i>
        </Typography>
      }
    </Box>
  )
}
export default ArchivedTab
