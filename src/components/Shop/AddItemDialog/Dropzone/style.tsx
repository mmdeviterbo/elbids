import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    grid:{
      border: '2px dashed rgb(220, 220, 220)',
      padding:'2.5em',
      rowGap:'1em',
      justifyContent:'center',
      alignItems:'center',
      cursor: 'pointer'
    },
    icon:{
      fontSize:'5em',
    },
    gridDisabled:{
      border: '3px dashed rgba(225, 225, 225, 0.4)',
      backgroundColor:'rgba(250, 250, 250,0.7)',
    }
  }),
);