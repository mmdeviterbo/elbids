import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      minHeight:'400px',
      position:'relative'
    },
    items:{
      minHeight:'80%',
    },
    textfield:{
      marginBottom: theme.spacing(2),
      [`& fieldset`]: {
        borderRadius: 0,
        border:'1.5px solid black',
      },
    },
    dropzoneContainer:{
      display:'grid',
      placeSelf:'center'
    },
    title:{
      backgroundColor:red[900],
      color:'white',
      marginBottom: theme.spacing(2)
    },
    submit:{
      background: 'none',
      borderRadius: 0,
      border:'2px solid black',
      padding:theme.spacing(),
      paddingLeft:theme.spacing(2),
      paddingRight:theme.spacing(2),
      "&:disabled":{
        border:'2px solid rgba(192,192,192,0.5)',
      }
    },
    buttonAction:{
      margin: theme.spacing(0.5),
      marginRight: theme.spacing(2)
    }
  }),
);
