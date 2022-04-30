import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme)=>({
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
  }
}))