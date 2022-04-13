import { PreviewGallery } from '../types'
import { Binary } from 'bson'

const formatPreviewGallery=(gallery: Binary[]): PreviewGallery[]=>{  //set of galleries
  let previewGallery: PreviewGallery[] = []

  if(gallery && Array.isArray(gallery)){
    gallery.forEach((data: Binary): void =>{
        previewGallery.push({ 
          original: `data:image/png;base64,${data}`, 
          thumbnail: `data:image/png;base64,${data}` 
        })
    })
    return previewGallery
  }
  return []
}

export {
  formatPreviewGallery
}