import { ReactElement, useState } from "react"
import {Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import { Box, Typography, Button } from '@material-ui/core';
import { Avatar, ListItem, ListItemText, ListItemAvatar} from '@material-ui/core';
import { Accordion, AccordionSummary, AccordionDetails, AccordionActions, Link } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import useStyles from './style'
import { User, DATE_FORMAT, STATUS } from "../../../types";
import formatDate from "../../../utils/formatDate";
import { titleCase } from "title-case";
import PreviewIdImage from "./PreviewImageId";

const TableAccordion=({
  user,
  isUsers=false,
  isVerification=false,
  handleVerifyAccount,
  handleAddAdminAccount,
  handleBanAccount,
}:{
  user: User
  isUsers?: boolean
  isVerification?: boolean
  handleVerifyAccount?:(email: string, status: STATUS)=>void
  handleAddAdminAccount?: (email: string, admin: boolean)=>void
  handleBanAccount?: (email: string, banned: boolean)=>void
}): ReactElement =>{
  const classes = useStyles()
  const [openPreviewImage, setOpenPreviewImage] = useState<boolean>(false)

  const {
    full_name,
    email,
    status,
    imageUrl,
    admin,
    banned,
    date_created,
    report_count,
    id_image
  } = user

  const handleButtons=(): ReactElement=>{
    let buttons: ReactElement
    if(isUsers){
      buttons = (
        <>
          <Button 
            className={classes.buttonRed}
            onClick={()=>handleBanAccount(user?.email, !banned)}
            size="small"
          >
            {banned? "Unban" : "Ban"}
          </Button>
          {!admin? <Button 
            className={classes.buttonBlack}
            onClick={()=>handleAddAdminAccount(user?.email, true)}
            size="small"
          >Add admin
          </Button>
          :
          <Button 
            className={classes.buttonBlack}
            onClick={()=>handleAddAdminAccount(user?.email, false)}
            size="small"
          >Remove admin
          </Button>
        }
        </>
      )
    }
    if(isVerification){
      buttons = (
        <>
          <Button
            onClick={():void=>handleVerifyAccount(user?.email, STATUS.REJECTED)}
            className={classes.buttonWhite}
            size="small"
          >
            Reject
          </Button>
          <Button
            className={classes.buttonBlack}
            onClick={():void=>handleVerifyAccount(user?.email, STATUS.VERIFIED)}
            size="small"
          >
            Accept
          </Button>
        </>
      )
    }
    return buttons
  }

  return (
    <>
      <Accordion square={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <ListItem alignItems="flex-start" style={{paddingTop:0, paddingBottom:0}}>
            <ListItemAvatar>
              <Avatar alt={full_name} src={imageUrl} />
            </ListItemAvatar>
            <ListItemText primary={titleCase(full_name)} secondary={admin? 'Admin' : 'Member'}/>
          </ListItem>
        </AccordionSummary>

        <AccordionDetails>
          <Box px={2} width={'100%'}>
            <Table className={classes.table} size="small">
              <TableBody>
                {isVerification && <TableRow>
                  <TableCell className={classes.tableCell}>
                    <Typography color="textSecondary">ID</Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography>
                      <Link onClick={()=>setOpenPreviewImage(true)} color={'primary'} style={{cursor:'pointer'}}>View Image</Link>
                    </Typography>
                  </TableCell>
                </TableRow>}

                <TableRow>
                  <TableCell className={classes.tableCell}>
                    <Typography color="textSecondary">Name</Typography>
                  </TableCell>
                  <TableCell align="left">
                    {admin? <Typography>{titleCase(full_name)}</Typography> : <Typography>{titleCase(full_name)}</Typography>}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.tableCell}>
                    <Typography color="textSecondary">Email</Typography>
                  </TableCell> 
                  <TableCell align="left">
                  <Typography>{email}</Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableCell}>
                    <Typography color="textSecondary">Status</Typography>
                  </TableCell>

                  <TableCell align="left">
                    <Typography >{titleCase(status.toLowerCase())}</Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableCell}>
                    <Typography color="textSecondary">Date Joined</Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography>{formatDate(date_created, DATE_FORMAT.DATE_WORD)}</Typography>
                  </TableCell>
                </TableRow>

                {isUsers && <TableRow>
                  <TableCell className={classes.tableCell}>
                    <Typography color="textSecondary">Report count</Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography>{report_count}</Typography>
                  </TableCell>
                </TableRow>}

              </TableBody>
            </Table>
          </Box>
        </AccordionDetails>
        <AccordionActions>
          <Box px={2} pb={1}>
            {handleButtons()}
          </Box>      
        </AccordionActions>
    </Accordion> 
    {isVerification && 
      <PreviewIdImage 
        openPreviewImage={openPreviewImage}
        setOpenPreviewImage={setOpenPreviewImage}
        data={id_image?.data}
      />
    } 
  </>
  )
}

export default TableAccordion