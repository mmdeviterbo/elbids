import React, {ReactElement, useState, useEffect, ChangeEvent, MouseEvent} from 'react';
import { NextPage } from 'next';
import { Grid, Button, Dialog, DialogTitle, DialogActions, DialogContent, InputAdornment, Typography, Divider, Tooltip, MenuItem, Select, InputLabel } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete from "@material-ui/lab/Autocomplete";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import TimerIcon from '@material-ui/icons/Timer';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { ObjectId } from 'bson';
import { useQuery, useMutation } from '@apollo/client';
import axios from 'axios'
import Dropzone from './Dropzone';
import userQuery from './userQuery';
import Fab from '../fab'
import mutation from './mutation'
import { Item, CATEGORY, Post, TIMER_OPTIONS } from '../../../types';
import  { getURI } from '../../../utils/getURI'
import tagValues from '../../../utils/tagValues' 
import Notification from '../../_commons/notification';
import { useRouter } from 'next/router'
import useStyles from './style'
import getUser from './../../../utils/getUser';
import { SpinnerCircularFixed } from 'spinners-react';
import SendIcon from '@material-ui/icons/Send'

const AddItemDialog: NextPage=():ReactElement=> {
  const userCookies = getUser()
  const classes = useStyles({});
  const router = useRouter()

  const { data } = useQuery(userQuery,{
    variables: {email : userCookies?.email},
    skip: !getUser()?.email,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })

  const [insertPost, { loading, error }] = useMutation(mutation, {
    notifyOnNetworkStatusChange: true,
  	onCompleted:(): void => {
      setOpen(false)
      router.reload()
    },
	  onError: (): void => {
      setOpenError([true, true])
    }
  })

  const [open, setOpen]=useState<boolean>(false)
  const [openError, setOpenError]=useState<boolean[]>([false,false])

  const [title, setTitle]=useState<string>('')
  const [description, setDescription]=useState<string>('')
  const [reason, setReason]=useState<string>('')
  const [starting_price, setStarting_price]=useState<string>('')
  const [timer, setTimer]=useState<TIMER_OPTIONS>(TIMER_OPTIONS.FIFTEEN_SECONDS)
  const [additional_bid, setAdditional_bid]=useState<string>('')
  const [gallery, setGallery] = useState<File[]>()
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<CATEGORY>(CATEGORY.BID);

  const [isTitleChanged, setIsTitleChanged]=useState<boolean>(false)
  const [isDescriptionChanged, setIsDescriptionChanged]=useState<boolean>(false)
  const [isReasonChanged, setIsReasonChanged]=useState<boolean>(false)
  const [isStartingPriceChanged, setIsStartingPriceChanged]=useState<boolean>(false)
  const [isAdditionalBidChanged, setIsAdditionalBidChanged]=useState<boolean>(false)
  const [isGalleryChanged, setIsGalleryChanged] = useState<boolean>(false)
  const [isTagsChanged, setIsTagsChanged] = useState<boolean>(false)
  const [isFormInvalid, setIsFormInvalid] = useState<boolean>(true)

  const [loadingImage, setLoadingImage] = useState<boolean>(false)

  const handleCategory = (event: MouseEvent<HTMLElement>, newCategory: CATEGORY) => {
    setCategory(newCategory);
  };

  useEffect(()=>{
    let states = [title, description, reason, starting_price, tags, gallery]

    try{
      setIsFormInvalid(false)

      if(category===CATEGORY.BID && !additional_bid.length) setIsFormInvalid(true)
      if(category===CATEGORY.BID && additional_bid?.length>0){
        if(parseInt(additional_bid)<=0) setIsFormInvalid(true)
      }
      if(category===CATEGORY.BID && starting_price?.length>0){
        if(parseInt(starting_price)<=0) setIsFormInvalid(true)
      }

      for(let i=0;i<states.length;i++){
        if(states[i].length === 0 || !states[i]) {
          setIsFormInvalid(true)
          break
        } 
      }
    }catch(err){
      setIsFormInvalid(true)
    }

    if(tags.length===0) setIsFormInvalid(true)
  },[title, description, reason, starting_price, tags, gallery, category, additional_bid])


  const handleSubmit=async(): Promise<void>=>{
    setLoadingImage(true)
    const seller_id = data?.user?._id
    const post_id: ObjectId = new ObjectId()
    const formData = new FormData()

    for(let i=0;i<gallery.length;i++){
      formData.append('file', gallery[i])
    }

    const saveImage = await axios({
      url: getURI('/insert-image-gallery'), 
      method: 'POST',
      data: formData
    })
    const gallery_id = new ObjectId(saveImage?.data?._id)

    const item: Item  = {
      post_id,
      title,
      description,
      reason,
      current_bid: category===CATEGORY.BID? parseInt(starting_price) : 0, 
      additional_bid: category===CATEGORY.BID? parseInt(additional_bid) : 0,
      timer: category===CATEGORY.BID? timer : TIMER_OPTIONS.NA,
      starting_price: parseInt(starting_price),
      gallery_id,
      tags,
      date_created: new Date().toString(),
    }
    
    const postVariable: Post = {
      _id: post_id,
      seller_id,
      item,
      category,
      deleted: false,
      archived: false,
    }

    await insertPost({variables : postVariable})
    setLoadingImage(false)
    !loading && error && setOpen(true)
    !loading && !error && setOpen(false) 
  }

  const handleTags=(_, value: string[]): void =>{
    if(value?.length<4){
      let upperCase, remaining, final;
      for(let i=0;i<value.length;i++){
        if(!value[i].includes('#elbids')){
          upperCase = value[i].substring(0,1).toUpperCase()
          remaining = value[i].substring(1)
          final = `#elbids${upperCase}${remaining}`
          if(!value.includes(final)){
            value[i]=final
          }else{
            value.pop()
          }
        }
      }
      !isTagsChanged && setIsTagsChanged(true)
      setTags(value)
      value.length===0? setIsFormInvalid(true) : setIsFormInvalid(false) 
    }
  }

  const handleHelperText=(state, isChanged: boolean): boolean =>{
    if(isChanged){
      if(!state) return true
      return state.toString().length===0? true : false
    }
    return false
  }

  let loadingSpinner: ReactElement = (
    <SpinnerCircularFixed
    size={18}
    color={'#808080'}
    thickness={90}
    speed={250}
    enabled={true}
  />
  )

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={open}
        onClose={()=>setOpen(!open)}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title" className={classes.title}>
          <Typography variant="body1">BID YOUR ITEM</Typography>
        </DialogTitle>
        
        <DialogContent>
          <Grid container className={classes.root} spacing={2}>
            <ToggleButtonGroup
              value={category}
              exclusive
              onChange={handleCategory}
              size={'small'}
              style={{position:'absolute', top:0, marginLeft:8}}
            >
              <ToggleButton value={CATEGORY.BID}>
               <Tooltip title="For bidding"><TimerIcon /></Tooltip>
              </ToggleButton>
              <ToggleButton value={CATEGORY.SALE}>
                <Tooltip title="For sale"><AttachMoneyIcon /></Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
            <Grid item xs={6} className={classes.dropzoneContainer}>
              <Dropzone 
                gallery={gallery}
                setGallery={setGallery}
                isGalleryChanged={isGalleryChanged}
                setIsGalleryChanged={setIsGalleryChanged}/>
            </Grid>
            <Grid item xs={6}>
              <Grid container className={classes.items}>
                <TextField
                  className={classes.textfield}
                  error={handleHelperText(title, isTitleChanged)? true : false}
                  helperText={handleHelperText(title, isTitleChanged)? 'Required' : null}
                  variant='outlined'
                  label="Title"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={title}
                  onChange={(e: ChangeEvent<HTMLInputElement>): void =>{
                    setIsTitleChanged(true)
                    let tempTitle: string = e?.target?.value
                    setTitle(tempTitle?.length<20? tempTitle : tempTitle?.slice(0,20))
                  }}
                />
                <TextField
                  className={classes.textfield}
                  error={handleHelperText(description, isDescriptionChanged)? true : false }
                  helperText={handleHelperText(description, isDescriptionChanged)? 'Required' : null}
                  variant='outlined'
                  label="Description"
                  multiline
                  fullWidth
                  minRows={1}
                  maxRows={6}
                  InputLabelProps={{ shrink: true }}
                  value={description}
                  onChange={(e: ChangeEvent<HTMLInputElement>): void =>{
                    setIsDescriptionChanged(true)
                    let tempDescription: string = e?.target?.value
                    setDescription(tempDescription?.length<200? tempDescription : tempDescription?.slice(0,200))
                  }}
                />
                <TextField
                  className={classes.textfield}
                  error={handleHelperText(reason, isReasonChanged)? true : false }
                  helperText={handleHelperText(reason, isReasonChanged)? 'Required' : null}
                  variant='outlined'
                  label="RFS"
                  multiline
                  fullWidth
                  minRows={1}
                  maxRows={6}
                  InputLabelProps={{ shrink: true }}
                  value={reason}
                  onChange={(e: ChangeEvent<HTMLInputElement>): void =>{
                    setIsReasonChanged(true)
                    setReason(e.target.value)
                  }}
                />
                <Grid container spacing={1}>
                  <Grid item xs={category===CATEGORY.BID? 6 : 12}>
                    <TextField
                      className={classes.textfield}
                      error={handleHelperText(starting_price, isStartingPriceChanged)}
                      helperText={handleHelperText(starting_price, isStartingPriceChanged)? 'Required' : null}
                      fullWidth
                      variant='outlined'
                      label="Price"
                      type="number"
                      InputProps={{startAdornment: <InputAdornment position="start">₱</InputAdornment>}}
                      value={starting_price}
                      onChange={(e: ChangeEvent<HTMLInputElement>): void =>{
                        setIsStartingPriceChanged(true)
                        setStarting_price(e.target.value) 
                      }}
                    />
                  </Grid>
                  
                  {category===CATEGORY.BID && <Grid item xs={6}>
                    <TextField
                      className={classes.textfield}
                      error={handleHelperText(additional_bid, isAdditionalBidChanged)}
                      helperText={handleHelperText(additional_bid, isAdditionalBidChanged)? 'Required' : null}
                      fullWidth
                      variant='outlined'
                      label="Additional Bid"
                      type="number"
                      InputProps={{startAdornment: <InputAdornment position="start">₱</InputAdornment>}}
                      value={additional_bid}
                      onChange={(e: ChangeEvent<HTMLInputElement>): void =>{
                        setIsAdditionalBidChanged(true)
                        setAdditional_bid(e.target.value)
                      }}
                    />
                  </Grid>}
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={category===CATEGORY.BID? 8 : 12}>
                  <Tooltip title="Maximum of 3 only" placement='left'>
                    <Autocomplete
                      className={classes.textfield}
                      limitTags={category===CATEGORY.BID? 1 : 2}
                      multiple
                      id="autocomplete-tags"
                      freeSolo
                      options={tagValues.map((option) => option.tagName)}
                      onChange={handleTags}
                      value={tags}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          InputLabelProps={{ shrink: true }}
                          label="Tags"
                          variant='outlined'
                          error={isTagsChanged && tags.length==0}
                          helperText={isTagsChanged && tags.length==0? "Required" : null}
                        />
                      )}
                    />
                  </Tooltip>
                </Grid>
                {category===CATEGORY.BID && <Grid item xs={4}>
                    <Tooltip title="Timer for bidding" placement='right'>
                      <Select 
                        value={timer}
                        onChange={(e): void =>{
                          let value: TIMER_OPTIONS
                          let valueSelect: string = e.target.value.toString()
                          if(valueSelect===TIMER_OPTIONS.FIFTEEN_SECONDS) value =  TIMER_OPTIONS.FIFTEEN_SECONDS
                          else if(valueSelect===TIMER_OPTIONS.TWELVE_HOURS) value =  TIMER_OPTIONS.TWELVE_HOURS
                          else if(valueSelect===TIMER_OPTIONS.ONE_DAY) value =  TIMER_OPTIONS.ONE_DAY
                          else if(valueSelect===TIMER_OPTIONS.TWO_DAYS) value =  TIMER_OPTIONS.TWO_DAYS
                          else if(valueSelect===TIMER_OPTIONS.FIVE_DAYS) value =  TIMER_OPTIONS.FIVE_DAYS
                          setTimer(value)
                        }}
                        fullWidth
                        variant="outlined"
                        className={classes.textfield}
                        >
                        {Object.values(TIMER_OPTIONS).slice(1).map((timer_option: string): ReactElement =><MenuItem key={timer_option} value={timer_option}>{`< ${timer_option}`}</MenuItem>)}
                      </Select>
                    </Tooltip>
                  </Grid>}
              </Grid>              
            </Grid>
          </Grid>
        </DialogContent>
        
        <Divider/>
        <DialogActions className={classes.buttonAction}>
          <Button onClick={()=>setOpen(!open)}>Cancel</Button>
          <Button 
            disabled={isFormInvalid || loadingImage || loading}
            onClick={handleSubmit}
            className={classes.submit}
            endIcon={loadingImage? loadingSpinner : <SendIcon/>}
            >Upload</Button>
        </DialogActions>
      </Dialog>

      <Fab handleOpen={()=>setOpen(!open)}/>
  
      {openError[0] && 
          <Notification 
            isOpen={openError[0]} 
            error={openError[1]} 
            message={openError[1]? "Error adding your item" : "Successfully added!"}    
          />
      }
    </>
  );
}
export default AddItemDialog