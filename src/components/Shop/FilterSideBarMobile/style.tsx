import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme)=>({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  filterMobile:{
    display:'none',
    marginRight:theme.spacing(2),
    [theme.breakpoints.down('sm')]:{
      display:'inline'
    }
  },
}));