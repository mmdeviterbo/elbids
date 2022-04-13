import { ReactElement } from "react"
import { Typography } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { NextPage } from 'next'
import { red } from '@material-ui/core/colors'
import Link from 'next/link'

const Footer: NextPage =(): ReactElement=>{
  const useStyles = makeStyles((theme: Theme)=>({
    footer:{
      background:red[900],
      display: 'flex',
      justifyContent:'center',
      alignItems:'center',
      zIndex:-1,
      height:'4vh',
      minHeight:'25px',
    },
    link:{
      color:'white',
      textDecoration:'none',
      background:'none',
      paddingRight:theme.spacing(2),
      cursor:'pointer'
    }
  }))
  
  const classes = useStyles({})
  return(
    <div className={classes.footer}>
      <Link href='/about'><Typography variant="subtitle1" className={classes.link}>About</Typography></Link>
      <Link href='/contact'><Typography variant="subtitle1" className={classes.link}>Contact Us</Typography></Link>
    </div>
  )
}
export default Footer
