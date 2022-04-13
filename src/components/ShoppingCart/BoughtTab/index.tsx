import { ReactElement, useEffect} from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Typography, Container } from '@material-ui/core'
import useStyles from './style'
// import boughtItemsQuery from './query'
import mutation from './mutation'
import { useQuery, useMutation } from '@apollo/client';
import { CART_ACTIVITIES, UserDisplay } from '../../../types';


const BoughtTab= (
  {
    user
  }:{
    user: UserDisplay
  }
): ReactElement=> {
  const router = useRouter()
  const classes = useStyles()

  // const boughtItemsState = useQuery(boughtItemsQuery,{
  //   notifyOnNetworkStatusChange: true,
  //   fetchPolicy: 'cache-and-network',
  // })

  // const [doMutation, { loading }] = useQuery(mutation,{
  //   notifyOnNetworkStatusChange: true,
  // })

  return(
    <Box>
      <Typography variant={'h5'}>Bought Items</Typography>
      
    </Box>
  )
}
export default BoughtTab
