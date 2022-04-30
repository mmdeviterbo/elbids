import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme)=>({
  root: {
    width: '55%',
  },
  inline: {
    display: 'inline',
  },
  input:{
    border:'1px solid rgba(192,192,192,0.5)',
    padding:theme.spacing()
  }
}))