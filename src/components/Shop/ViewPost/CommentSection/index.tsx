import { ReactElement, useState, useEffect } from 'react';
import { Box, Typography, InputBase } from '@material-ui/core';
import { Avatar, Divider, List, ListItem, ListItemText, ListItemAvatar } from '@material-ui/core';
import { InsertCommentArgs, Comment, Post } from '../../../../types'
import useStyles from './style'
import { ObjectId } from 'bson'
import { updateUserMutation, inserCommentMutation } from './mutation'
import commentQuery from './query'
import { useQuery, useMutation } from '@apollo/client'

const CommentSection=({
  open,
  post,
  user_id,
  full_name,
  imageUrl
}:{
  open?: Boolean
  post: Post
  user_id: ObjectId
  full_name: string
  imageUrl: string
}): ReactElement=>{
  const classes = useStyles({})
  const [comment, setComment]=useState<string>('')
  const [comments, setComments]=useState<Comment[]>()

  const [insertComment, { loading }] = useMutation(inserCommentMutation,{
    notifyOnNetworkStatusChange: true
  })

  const [updateUser] = useMutation(updateUserMutation,{
    notifyOnNetworkStatusChange: true
  })

  const commentsState = useQuery(commentQuery,{
    skip: !post,
    variables: { post_id: new ObjectId(post?._id) },
    notifyOnNetworkStatusChange: true,
    pollInterval: 500,
    fetchPolicy: 'cache-and-network'
  })

  useEffect((): void =>{
    if(commentsState?.data?.findManyComments){
      let resComments: Comment[] = [ ... commentsState?.data?.findManyComments]
      resComments.reverse()
      setComments(resComments)
    }
  }, [commentsState?.data])

  return(
    <>
      <Typography variant="h5">Comments</Typography>
      <List className={classes.root}>
        <ListItem alignItems="center">
          <ListItemAvatar><Avatar alt={full_name} src={imageUrl}/></ListItemAvatar>
          <ListItemText
            className={classes.input}
            primary={
              <InputBase
                fullWidth
                placeholder="Write your comment"
                inputProps={{ 'aria-label': 'comment' }}
                value={comment}
                disabled={loading}
                onChange={(e)=>setComment(e.target.value)}
                onKeyUp={async(event): Promise<void> => {
                  if(event.key== 'Enter'){
                    const commentVariables : InsertCommentArgs = {
                      user_id,
                      post_id: new ObjectId(post?._id),
                      content : comment,
                      deleted : false
                    }
                    await insertComment({ variables: commentVariables })
                    setComment('')
                    
                    if(!user_id?.equals(post?.seller_id)){
                      await updateUser({
                        variables: {
                          _id: user_id,
                          following_id: post?._id,
                          isFollow: true
                        }
                      })
                    }
                  }
                }}
              />
            }
          />
        </ListItem>

        {post?._id && comments?.map((comment: Comment): ReactElement =>{
          return(
          <ListItem key={comment?._id.toString()} alignItems="flex-start">
            <ListItemAvatar><Avatar alt={comment?.user?.first_name} src={comment?.user?.imageUrl} /></ListItemAvatar>
            <ListItemText
              primary={comment?.content}
              secondary={
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textSecondary"
                  >
                  {comment?.user?.full_name}
                  </Typography>
              }
            />
          </ListItem>
          )}
        )}
    </List>
    </>
  )
}

export default CommentSection