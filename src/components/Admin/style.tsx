import { makeStyles, Theme } from '@material-ui/core/styles'



export default makeStyles((theme: Theme)=>({
  root:{
    display:'flex',
    flexWrap:'wrap',
    gap: theme.spacing(2),
    padding: theme.spacing(4),
    justifyContent:'flex-start',
    alignItems: 'flex-start',
    height:'100vh',
  },
}))