import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme)=>({
  button:{
    border:'1px solid black',
    borderRadius: 0
  },
  buttonView:{
    border:'1px solid black',
    borderRadius: 0,
    backgroundColor:theme.palette.common.black,
    color:theme.palette.common.white,
    '&:hover':{
      backgroundColor:'rgba(0,0,0,0.8)',
    }
  }
}))