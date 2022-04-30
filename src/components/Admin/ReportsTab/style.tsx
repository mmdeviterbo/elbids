import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme)=>({
  root: {
    backgroundColor: theme.palette.background.paper,
    minHeight: '95vh'
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    minWidth:'calc(200px + 2vw)',
  },
  tab:{
    padding:theme.spacing(2),
  },
  tabPanel:{
    flexGrow:1
  },
  buttonBlack:{
    backgroundColor: theme.palette.common.black,
    color:theme.palette.common.white,
    border:'1px solid black',
    borderRadius:0,
    padding:theme.spacing(0.7),
    marginLeft:theme.spacing(1),
    "&:hover":{
      backgroundColor: 'rgba(20,20,20,0.85)',
    }
  }
}))