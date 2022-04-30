import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme)=>({
  signin:{
    marginLeft:theme.spacing(),
    border:'2px solid black',
    borderRadius:0,
    padding:theme.spacing(),
    paddingLeft:theme.spacing(1.5),
    paddingRight:theme.spacing(1.5),
    color:theme.palette.common.white,
    backgroundColor: theme.palette.common.black,
    "&:hover":{
      backgroundColor: "rgba(10,10,10,0.90)",
    },
    "&:disabled":{
      backgroundColor: "rgba(192,192,192,0.10)",
      border:'2px solid rgba(200,200,200,0.60)',
    }
  },
  password:{
    marginLeft:theme.spacing(2),
    border:'2px solid black',
    borderRadius:0,
    padding:theme.spacing(),
    paddingLeft:theme.spacing(1.5),
    paddingRight:theme.spacing(1.5),
  },
  button:{
    marginLeft:theme.spacing(2),
    border:'2px solid black',
    borderRadius:0,
    padding:theme.spacing(),
    paddingLeft:theme.spacing(1.5),
    paddingRight:theme.spacing(1.5),
  },
  textfield:{
    width:300,
    [`& fieldset`]: {
      padding:0,
      borderRadius: 0,
      border:'1.5px solid black',
    },
  }

}))