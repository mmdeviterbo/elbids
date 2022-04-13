import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    galleryContainer:{
      display:'flex',
      flexWrap: 'wrap',
      justifyContent:'center',
      alignItems:'center',
      padding:theme.spacing(),
      backgroundColor:'rgb(245,245,245)',
      marginBottom:theme.spacing()
    },
    imageContainer:{
      position:'relative',
      margin:theme.spacing(0.5),
      height:'150px',
      width:'130px',
    },
    image:{
      '&:hover':{
        filter:"brightness(0.7)"
      },
      height:'100%',
      width:'100%',
      objectFit:'cover',
      boxShadow:'1px 1px 2px black',
      borderRadius:'2px'
    },
    deleteIcon:{
      position:'absolute',
      right:0,
      top:0,
      color:'white',
      zIndex:2,
      padding:theme.spacing(0.5)
    },
  }),
);