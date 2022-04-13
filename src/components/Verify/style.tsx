import { makeStyles, Theme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors';


export default makeStyles((theme: Theme)=>({
  root:{
    height:'100vh',
    width:'100vw',
    minHeight:'500px',
    minWidth:'400px',
    display:'grid',
    placeItems:'center',
  },  
  container:{
    borderRadius:'5px',
    height:'calc(15vh + 400px)',
    minHeight:'400px',
    minWidth:'400px',
    paddingTop:'2em',
    background:red[900]
  },
  innerContainer:{
    marginTop:'0.5em',
    height:'calc(100% - 2.5em)',
    width:'100%',
    padding:'2em',
    paddingTop:'0.5em',
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-between',
  },
  input: {
    display: 'none',
  },
  imageHolder:{
    display:'grid',
    placeContent:'center'
  },
  image:{
    maxWidth:'350px',
    maxHeight:'200px',
    objectFit:'cover',
    borderRadius:'3px',
    boxShadow:'1px 1px 4px black',
  },
  submit:{
    background:red[900],
    color:'white',
    '&:hover':{
      background:red[600],
    }
  },
  title:{
    color:'white'
  }
}))