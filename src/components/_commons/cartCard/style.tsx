import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme)=>({
  root:{
    border: '1px solid black'
  },
  image:{
    height:'100%',
    width:'100%',
    objectFit:'cover',
    borderRadius:'50%'
  }
}))