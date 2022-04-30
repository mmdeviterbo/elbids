import { makeStyles, Theme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

export default makeStyles((theme: Theme)=>({
  table: {
    minWidth: '100%',
    width: '100%',
    '& tbody tr:last-child th, & tbody tr:last-child td': {
      border: 0,
    }
  },
  tableCell:{
    margin:0,
    padding:0,
    width:'22%'
  },

  buttonRed:{
    backgroundColor: red[500],
    color:theme.palette.common.white,
    border:'1px solid white',
    borderRadius:0,
    padding:theme.spacing(0.7),
    "&:hover":{
      backgroundColor: red[600],
    }
  },
  buttonWhite:{
    backgroundColor: theme.palette.common.white,
    color:theme.palette.common.black,
    border:'1px solid black',
    borderRadius:0,
    padding:theme.spacing(0.7),
    marginLeft:theme.spacing(1),
    "&:hover":{
      backgroundColor: 'rgba(250,250,250,0.9)',
    }
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
  },
}))