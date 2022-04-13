import { ReactElement, useEffect} from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Typography, Container } from '@material-ui/core'
import useStyles from './style'
// import query from './query'
// import mutation from './mutation'
import { useQuery, useMutation } from '@apollo/client';
import { CART_ACTIVITIES, UserDisplay } from '../../../types';

const FollowingTab=(
  {
    user
  }:{
    user: UserDisplay
  }
): ReactElement=> {
  const router = useRouter()
  const classes = useStyles()

  // const state = useQuery(query,{
  //   notifyOnNetworkStatusChange: true,
  //   fetchPolicy: 'cache-and-network',
  // })

  // const [doMutation, { loading }] = useMutation(mutation,{
  //   notifyOnNetworkStatusChange: true,
  // })

  return(
    <Box>
      <Typography variant={'h5'}>Followed Items</Typography>
    
    </Box>
  )
}
export default FollowingTab
