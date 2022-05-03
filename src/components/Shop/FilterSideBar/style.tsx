import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme)=>({
  container:{
    height:'95vh',
    minHeight:'600px',
    width:'calc(170px + 7vw)',
    minWidth:'calc(170px + 7vw)',
    [theme.breakpoints.down('sm')]:{
      display:'none'
    }
  },
  textfieldLeft:{
    [`& fieldset`]: {
      height:47,
      width:'98%',
      borderRadius: 0,
      border:'1.5px solid black',
    },
  },
  textfieldRight:{
    [`& fieldset`]: {
      height:47,
      marginLeft:2,      
      borderRadius: 0,
      border:'1.5px solid black',
    },
  },
  select:{
    [`& fieldset`]: {
      height:60,
      borderRadius: 0,
      border:'1.5px solid black',
    },
  },
  tagsField:{
    marginBottom: theme.spacing(2),
    [`& fieldset`]: {
      borderRadius: 0,
      border:'1.5px solid black',
    },
  },
  submit:{
    border:'2px solid black',
    borderRadius:0,
    width:'100%',
    padding:theme.spacing(1.5)

  }

}))