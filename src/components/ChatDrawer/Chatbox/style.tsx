import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme)=>({
  root: {
    width: '50vw',
    height:'85vh',
    [theme.breakpoints.down('md')]:{
      width:'85vw'
    }
  },

}))