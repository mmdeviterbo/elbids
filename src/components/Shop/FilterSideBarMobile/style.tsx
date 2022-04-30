import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme)=>({
  list: {
    width:'calc(200px + 7vw)',
    minWidth:'calc(200px + 7vw)',
    borderRight:'1px solid rgba(0,0,0,0.20)',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  fullList: {
    width: 'auto',
  },
  filterMobile:{
    display:'none',
    marginRight:theme.spacing(2),
    [theme.breakpoints.down('sm')]:{
      display:'block'
    }
  },
}));