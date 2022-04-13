import React, { ReactElement } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Box, Button } from '@material-ui/core';
import useStyles from './style'
import { STATUS, DATE_FORMAT } from '../../../types'
import formatDate from '../../../utils/formatDate'
import { ObjectId } from 'bson';

const CardItem=({
  full_name,
  first_name,
  last_name,
  id,
  email,
  date_created,
  status,
  imageUrl,
  handleVerificationButton
}:{
  full_name: string
  first_name: string
  last_name: string
  id: ObjectId
  email: string
  date_created: string
  status: String
  imageUrl: string
  handleVerificationButton:(email: string, status: STATUS)=>void
}): ReactElement=> {
  const classes = useStyles();
  return (
    <Card className={classes.root} elevation={1}>
      <CardHeader
        avatar={<Avatar aria-label="display image" src={imageUrl}/>}
        title={`${last_name}, ${first_name}`}
        subheader={formatDate(date_created, DATE_FORMAT.DATE_HOUR)}
      />
      <CardMedia
        className={classes.media}
        image={imageUrl}
        title="Paella dish"
      />
      <CardContent>
        <Box pr={1} component="span">
          <Typography variant="body2" color="textPrimary" display="inline">Email</Typography>
        </Box>
        <Typography variant="body2" color="textSecondary" display="inline">{email}</Typography>
        <br/>
        <Box pr={1} component="span">
          <Typography variant="body2" color="textPrimary" display="inline">Status</Typography>
        </Box>
        <Typography variant="body2" color="textSecondary" display="inline">{status}</Typography>
      </CardContent>
      <CardActions className={classes.buttons}>
        <Button size="small" onClick={()=>handleVerificationButton(email, STATUS.REJECTED)}>Reject</Button>
        <Button size="small" onClick={()=>handleVerificationButton(email, STATUS.VERIFIED)}>Verify</Button>
      </CardActions>
    </Card>
  );
}
export default CardItem
