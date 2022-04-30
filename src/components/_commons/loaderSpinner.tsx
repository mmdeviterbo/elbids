import { ReactElement } from 'react';
import { SpinnerCircularFixed } from 'spinners-react';
import { Box } from '@material-ui/core'

const LoaderSpinner=({isVisible}:{isVisible: boolean}): ReactElement=>{
  return(
    <>
    {isVisible && <Box 
        style={{marginTop:20, marginBottom: 10, display:'grid', placeContent:'center'}}
      >
      <SpinnerCircularFixed
        size={25}
        color={'#344345'}
        thickness={90}
        speed={250}
        enabled={true}
      />
      </Box>}
    </>
  )
}
export default LoaderSpinner