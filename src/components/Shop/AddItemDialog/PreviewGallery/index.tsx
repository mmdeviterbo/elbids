import React, {ReactElement, useState, useEffect, Dispatch, SetStateAction, ChangeEvent} from 'react'
import useStyles from './style'
import {IconButton, Button, Typography} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const PreviewGallery=({
  gallery,
  setGallery
}:{
  gallery: File[]
  setGallery: Dispatch<SetStateAction<File[]>>
}):ReactElement=> {
  const classes = useStyles({})
  return (
    <>
      <Paper elevation={0} className={classes.galleryContainer}>
        {gallery?.map((photo: File) =>{
          return(
              <div className={classes.imageContainer} key={photo?.name}>
                <IconButton 
                  onClick={()=>setGallery(gallery?.filter((currPhoto: File)=>currPhoto?.name!=photo?.name))}
                  className={classes.deleteIcon} >
                  <CancelIcon fontSize={'medium'}/>
                </IconButton>
                <img src={URL.createObjectURL(photo)} className={classes.image} draggable={false}/>
              </div>
            )
        })}
      </Paper>
      
      <Grid container direction='row' justifyContent="center">
        {gallery?.length<5 &&
            <>
               <input
                accept="image/*"
                style={{display:'none'}}
                id="contained-button-file"
                multiple
                type="file"
                onChange={(e: ChangeEvent<HTMLInputElement>): void =>{
                  const tempGallery: File[] = [...gallery]
                  const files: File[] = Array.from(e.target.files)
                  files.forEach((file: File)=>{
                    let exist: Boolean = tempGallery.some((temp: File)=>temp.name === file.name)
                    !exist && tempGallery.length<5 && tempGallery.push(file)
                  })
                  setGallery(tempGallery)
                }}
              />
               <label htmlFor="contained-button-file">
                <IconButton 
                  component="span"
                  aria-label="add"
                  color="primary"
                  >
                  <AddAPhotoIcon />
                </IconButton>
              </label>
            </>
        }
        {gallery?.length>0 &&
            <Button
              aria-label="delete"
              color="secondary"
              onClick={()=>setGallery(null)}
              >
              <DeleteIcon />
            </Button>
        }
      </Grid>
  </>
  )
}
export default PreviewGallery