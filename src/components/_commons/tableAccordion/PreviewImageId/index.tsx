import React, { ReactElement, Dispatch, SetStateAction} from 'react'
import { Button } from '@material-ui/core';
import { Box, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import { Binary } from 'bson'

const PreviewIdImage=(
  {
    openPreviewImage,
    setOpenPreviewImage,
    data 
  }:{
    openPreviewImage: boolean
    setOpenPreviewImage: Dispatch<SetStateAction<boolean>>
    data: Binary[]
}): ReactElement=>{
  return(
    <Dialog
      maxWidth={'lg'}    
      open={openPreviewImage}
      onClose={()=>setOpenPreviewImage(!openPreviewImage)}
      aria-labelledby="max-width-dialog-title"
    >
    <DialogContent style={{padding: '20px'}}>
        <img
          src={`data:image/png;base64,${data[0]}`}
          draggable={false}
          style={{'objectFit':'cover', height:'400px'}}
        />
    </DialogContent>
    <DialogActions>
      <Button onClick={()=>setOpenPreviewImage(false)}>Close</Button>
    </DialogActions>
    </Dialog>
  )
}
export default PreviewIdImage