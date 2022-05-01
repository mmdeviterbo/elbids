import React, {ReactElement} from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fabButton: {
      position: 'fixed',
      margin: theme.spacing(1),
      bottom: '2vh',
      right: '2vw',
      padding:'2rem',
      zIndex:9999
    }
  }),
);

export default function FloatingActionButtonSize({
  handleOpen
}:{
  handleOpen: VoidFunction
}): ReactElement {
  const classes = useStyles({});
  return (
    <Fab 
      color="secondary" 
      style={{backgroundColor: red[900]}}
      aria-label="add" 
      className={classes.fabButton}
      onClick={handleOpen}
      >
      <PostAddIcon/>
    </Fab>
  );
}
