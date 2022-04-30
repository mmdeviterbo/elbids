import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme)=>({
  root:{
    minHeight:'95vh',
    paddingTop: theme.spacing(2),
    position:'relative'
  },
 button:{
   marginTop:theme.spacing(4),
   marginBottom:theme.spacing(1.5),
   height:50,
   borderRadius: 0,
   border:'2px solid black',
   background:'none',
   "&:disabled": {
     border:'2px solid rgba(192,192,192, 0.5)',
   },
   "&:hover": {
    border:'2px solid red',
    },
  },
  table: {
    minWidth: '100%',
    width: '100%',
    marginTop: theme.spacing(),
    '& tbody tr:last-child th, & tbody tr:last-child td': {
      border: 0,
    }
  },
  tableCell:{
    paddingLeft:0,
    width:'10%'
  },
  sale:{
    backgroundColor: 'black',
    borderRadius:'25px',
    padding:'0.6em',
    paddingTop:'0.22em',
    paddingBottom:'0.22em',
    color:'white',
  },
  bid:{
    backgroundColor: 'red',
    borderRadius:'25px',
    padding:'0.6em',
    paddingTop:'0.22em',
    paddingBottom:'0.22em',
    color:'white',
  },
  likeButton:{
    borderRadius: 0,
    border: '2px solid black',
    height:42,
    background:'none',
    transition:'0.2s',
    "&:disabled": {
      border:'2px solid rgba(192,192,192, 0.5)',
      background:'none'
    },
  },
  unLikeButton:{
    borderRadius: 0,
    border: '2px solid black',
    height:42,
    background:'rgba(5,5,5,0.85)',
    color:'white',
    transition:'0.2s',
    "&:hover":{
      background:'rgba(2,2,2,1)',
      color:'white',
    },
    "&:disabled": {
      border:'2px solid rgba(192,192,192, 0.5)',
      background:'none',
    },
  },
  unFollowingButton:{
    borderRadius: 0,
    border: '2px solid black',
    height:42,
    background:'rgba(5,5,5,0.85)',
    color:'white',
    transition:'0.2s',
    "&:hover":{
      background:'rgba(2,2,2,1)',
      color:'white',
    },
    "&:disabled": {
      border:'2px solid rgba(192,192,192, 0.5)',
      background:'none',
    },
  },
  followingButton:{
    borderRadius: 0,
    border: '2px solid black',
    height:42,
    transition:'0.2s',
    background:'none',
    "&:disabled": {
      border:'2px solid rgba(192,192,192, 0.5)',
      background:'none',
    },
  },
  "@keyframes blinker": {
    "50%": {
      opacity: 0
    }
  },
  blinking:{
    opacity: 1,
    animation: '$blinker 1.5s linear infinite',
  },
  textfield:{
    padding:0,
    [`& fieldset`]: {
      borderRadius: 0,
      border:'1.5px solid black',
    },
  },
}))