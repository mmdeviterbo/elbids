import React, {ReactElement, useCallback, useState, useEffect, Dispatch, SetStateAction} from 'react'
import PermMediaIcon from '@material-ui/icons/PermMedia';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import BlockIcon from '@material-ui/icons/Block';
import Grid from '@material-ui/core/Grid';
import { useDropzone } from 'react-dropzone'
import useStyles from './style'
import Typography from '@material-ui/core/Typography'
import classNames from 'classnames'
import PreviewGallery from '../PreviewGallery';
import Compressor from 'compressorjs';
import convert from 'image-file-resize';

const Dropzone=({
  gallery,
  setGallery,
  isGalleryChanged,
  setIsGalleryChanged
}:{
  gallery: File[]
  setGallery: Dispatch<SetStateAction<File[]>>
  isGalleryChanged : boolean
  setIsGalleryChanged: Dispatch<SetStateAction<boolean>>
}):ReactElement=>{
  const classes = useStyles({})
  

  const [tempFiles,setTempFiles]= useState<File[]>([])

  useEffect(()=>{
    setGallery([...tempFiles])
  }, [tempFiles])

  const onDrop = useCallback(async(acceptedFiles: File[])=> {
    !isGalleryChanged && setIsGalleryChanged(true)

    let dupTempFile: File[] = [...tempFiles]
    for(let i=0;i<acceptedFiles.length;i++){
      
      let img = new Image()
      img.src = window.URL.createObjectURL(acceptedFiles[i])
      img.onload = () => {
        let newHeight: number = 600
        let newWidth: number = (newHeight * img.width)/img.height

        //resize image file
        convert({ 
          file: acceptedFiles[i],  
          width: newWidth, 
          height: newHeight, 
          type: 'jpg'
          }).then((resp) => {

            //compress image file
            new Compressor(resp, {
              quality: 0.08,
              success: (compressedResult) => {
                let tempFile: File = new File([compressedResult], `${i}.${compressedResult.type.split("image/")[1]}`)
                dupTempFile.push(tempFile)
                setTempFiles([...dupTempFile])
              }
            })
        }).catch(error => {})

      }
    }
  }, [])


  const {getRootProps, getInputProps, fileRejections, isDragActive, isDragAccept, isDragReject} = useDropzone({
    onDrop, 
    accept: 'image/jpeg,image/png',
    maxFiles: 4,
    maxSize: 4000000
  })

  const setDragDrop=():ReactElement=>{
    let element: ReactElement
    if(isDragReject){
      element = (
        <Grid container className={classNames(classes.grid, classes.gridDisabled)} direction='column'>
          <BlockIcon className={classes.icon} color={'secondary'}/>
          <Typography variant="subtitle2" align="center" color={'secondary'}> 
            Only at most 5 image file(s) are allowed 
          </Typography>
        </Grid>)
    }else if(isDragActive || isDragAccept){
      element = (
        <Grid container className={classes.grid} direction='column'>
          <TouchAppIcon className={classes.icon} color={'primary'}/>
          <Typography variant="subtitle2" align="center"> Drop your photos here ...</Typography>
        </Grid>)
    }
    else{  
      element= ( 
        <Grid container className={classes.grid} direction='column'>
          <PermMediaIcon className={classes.icon} color={'action'}/>
          <Typography variant="subtitle2" align="center">Drag and drop your photos here ...</Typography>
        </Grid>)
    }
    return element
  }

  const setClick=(): ReactElement=>{
    let element: ReactElement
    if(isGalleryChanged && fileRejections?.length>0){
      element = (
        <Typography variant="caption" align="left" style={{margin:8, color: 'red'}}>
          Only at most 4 image file(s) with 4mb max file size is/are accepted
        </Typography>)
    } 
    else if(isGalleryChanged && gallery?.length===0){
      element = <Typography variant="caption" align="left" style={{margin:8, color: 'red'}}>Required</Typography>
    }
    return element
  }

  return (
      <>
        {!gallery || gallery?.length===0? 
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {setDragDrop()}
          </div>
          :
          <PreviewGallery gallery={gallery} setGallery={setGallery}/>
        }
        {setClick()}
      </>
  )
}
export default Dropzone