import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme)=>({
  submit:{
    backgroundColor: theme.palette.common.black,
    color:theme.palette.common.white,
    border:'2px solid black',
    borderRadius:0,
    padding:theme.spacing(),
    paddingLeft:theme.spacing(1.5),
    paddingRight:theme.spacing(1.5),  
    marginLeft:theme.spacing(1),
    "&:hover":{
      backgroundColor: 'rgba(20,20,20,0.85)',
    },
    "&:disabled": {
      backgroundColor: "none",
      color:"rgba(192,192,192, 0.5)",
      border:'2px solid rgba(192,192,192, 0.5)',
    },
  },
  button:{
    marginLeft:theme.spacing(2),
    border:'2px solid black',
    borderRadius:0,
    padding:theme.spacing(),
    paddingLeft:theme.spacing(1.5),
    paddingRight:theme.spacing(1.5),
  },
}))