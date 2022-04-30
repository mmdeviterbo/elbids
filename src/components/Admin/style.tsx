import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme)=>({
  root: {
    display: 'flex',
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
  }
}))