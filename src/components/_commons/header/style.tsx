import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

export default makeStyles((theme: Theme) =>
  createStyles({
    appBar:{
      background:theme.palette.common.white,
      padding:theme.spacing(12),
      paddingTop:theme.spacing(0.2),
      paddingBottom:theme.spacing(0.2),
      minHeight:'8vh',
      [theme.breakpoints.down('md')]:{
        padding:theme.spacing(1)
      }
    },
    grow: {
      position:'sticky',
      top:0,
      flexGrow: 1,
      zIndex:99,
    },
    menu:{
      '& div': {
        margin:5
      },
      padding:0,
    },
    menuProfile:{
      height:100,
      width:200,
      display:'flex',
      alignItems:'center',
      flexDirection:'column',
      justifyContent:'center',
      cursor:'default'
    },
    title: {
      display: 'inline',
      color:'black',
      cursor:'pointer',
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    search: {
      position: 'relative',
      borderRadius:0,
      color: theme.palette.common.black,
      border:'1.5px solid black',
      marginRight: theme.spacing(2),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      }
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit'
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    }
  }),
);