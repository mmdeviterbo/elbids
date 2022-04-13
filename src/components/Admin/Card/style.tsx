import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

export default makeStyles((theme: Theme) =>
createStyles({
  root: {
    maxWidth: 345,
    borderRadius: 0,
    border: '1.5px solid black'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9,
  },
  buttons:{
    display:'flex',
    justifyContent:'flex-end',
    paddingRight:theme.spacing(2),
    paddingBottom:theme.spacing(2),
    '& Button':{
      border:'1px solid black',
      borderRadius: 0
    },
    '& Button:nth-child(2)':{
      background:theme.palette.common.black,
      color:theme.palette.common.white,
    }
  }
}),
);