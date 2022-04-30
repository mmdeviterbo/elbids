import { ReactElement } from "react"
import { Typography, Box, Divider } from '@material-ui/core'
import { Post, DATE_FORMAT, CATEGORY } from '../../../types'
import formatDate from "../../../utils/formatDate"
import useStyles from './style'
import { useRouter } from 'next/router';
import {titleCase} from 'title-case'

const CardCard=({
  post,
  actionCard,
  isClickable=true
} : {
  post: Post
  actionCard?: (post: Post)=>ReactElement
  isClickable?: boolean
}): ReactElement=>{
  const classes = useStyles()
  const router = useRouter()

  let { item, category, seller } = post
  let { 
    buyer,
    title,
    date_created,
    timer,
    starting_price,
    additional_bid,
    current_bid,
    gallery
  } = item
  let { data } = gallery
  
  return(
    <>
      <Divider/>
      <Box mb={isClickable? 2 : 4}>
        <Box 
          bgcolor={'rgba(251,251,251, 0.9)'}
          display={'grid'}
          gridTemplateColumns="repeat(3, 1fr)"
          justifyContent= "space-evenly"
          justifyItems= "center"
          alignContent= "space-evenly"
          alignItems= "center"
          height={120}
          style={{cursor: isClickable? 'pointer' : 'default'}}
          onClick={():void=>{
            if(isClickable){
              router.push({
                pathname:'/shop/item/[postId]',
                query: { postId: post?._id.toString() }
              })
            }
          }}
        >
          <Box width={95}>
            <img src={`data:image/png;base64,${data[0]}`} draggable={false} alt="" className={classes.image}/>
          </Box>

          {isClickable && 
            <>
              <Box justifySelf="start">
                <Typography><strong>{title?.toUpperCase()}</strong></Typography>
                <Typography color="textSecondary" variant="caption">{formatDate(date_created, DATE_FORMAT.DATE_WORD)}</Typography>
              </Box>
              
              <Box justifySelf="start">
                {category===CATEGORY.SALE && <Typography>{`₱${starting_price}`}</Typography>}
                {category===CATEGORY.BID && <Typography>{`₱${starting_price} (+${additional_bid})`}</Typography>}
                <Typography color="textSecondary" variant="caption">{category}</Typography>
                {category===CATEGORY.BID && <Typography color="textSecondary" variant="caption">{`• ${timer}`}</Typography>}
              </Box>
            </>
          }

          {!isClickable &&
            <>
              <Box justifySelf="start">
                <Typography><strong>{title?.toUpperCase()}</strong></Typography>
                {category===CATEGORY.SALE && <Typography>{`₱${starting_price}`}</Typography>}
                {category===CATEGORY.BID && <Typography>{`₱${current_bid}`}</Typography>}
                <Typography color="textSecondary" variant="caption">{category}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" display="block">
                  <strong>Seller:&nbsp;</strong>
                    {`${titleCase(seller?.full_name?.toLowerCase() || '')}`}
                </Typography>
                <Typography variant="caption">
                  <strong>Buyer:&nbsp;</strong>
                  {`${titleCase(buyer?.full_name?.toLowerCase() || '')}`}
                </Typography>
                <Typography color="textSecondary" variant="caption" display="block">{formatDate(date_created, DATE_FORMAT.DATE_WORD)}</Typography>
              </Box>
              
            </>
          }

        </Box>
        <Divider/>
        {isClickable && actionCard(post)}
    </Box>
    </>
  )
}
export default CardCard
