import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme)=>({
  container:{
    height:'96vh',
    width:'100wh'
  },
  logo:{
    maxHeight:'100%',
    maxWidth:'80%',
    objectFit:'cover',
    float:'right'
  },
  rightContainer:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
  },
  title:{
    maxHeight:'100%',
    maxWidth:'80%', 
  },
  loginButton:{
    height:'calc(25px + 3vh)',
    width:'calc(100px + 6vw)',
    background:'none',
    border:'2.5px solid black',
    borderRadius:0,
    color:theme.palette.common.black,
    fontSize:'1.5em',
    cursor:'pointer',
    transition:'0.2s',
    '&:hover':{
      color:theme.palette.common.white,
      background:theme.palette.common.black
    }
  }
}))