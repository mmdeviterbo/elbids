import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme)=>({
  root:{
    minHeight:'95vh',
    borderLeft:'1px solid rgba(0,0,0,0.20)',
    [theme.breakpoints.down('sm')]:{
      borderLeft:'0',
    }
  },
  cardItem:{
    width:'calc(150px + 2vw)',
    margin: theme.spacing(1),
    cursor:'pointer',
  },
  imageContainer:{
    height:'calc(150px + 2vw)',
    width:'100%',
  },
  image:{
    width:'100%',
    height:'100%',
    objectFit:'cover',
    backgroundColor: theme.palette.common.white
  },
  containerSelect:{
    width:200,
  },
  select:{
    [`& fieldset`]: {
      borderRadius: 0,
      border:'1.5px solid black',
    },
  },
}))