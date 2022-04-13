import React, { ReactElement, useState, useEffect} from "react";
import useStyles from './style'
import { Box, TextField, Typography, Button, MenuItem, Select } from '@material-ui/core';
import { DateRangePicker, DateRange } from "materialui-daterange-picker";
import formatDate from '../../../utils/formatDate'
import {DATE_FORMAT, TIMER_OPTIONS, CATEGORY, PostFilter} from '../../../types'
import { useRouter } from "next/router";
import queryString from 'query-string';
import Autocomplete  from '@material-ui/lab/Autocomplete';
import tagValues from '../../../utils/tagValues'
import Link from '@material-ui/core/Link';

const FilterSideBar=({
}):ReactElement=>{
  const router = useRouter()
  const queryMin_price = router.query.min_price as string
  const queryMax_price = router.query.max_price as string
  const queryCategory = router.query.category as CATEGORY
  const queryDate_range = router.query.date_range as string
  const queryTimer = router.query.timer as string 
  const querySearch = router.query.search as string
  const queryTags = router.query.tags as string

  const [min_price, setMinPrice]=useState<string>('');
  const [max_price, setMaxPrice]=useState<string>('');
  const [timer, setTimer]=useState<string>('')
  const [category, setCategory]=useState<string>(CATEGORY.ANY)
  const [tags, setTags] = useState<string[]>([]);
  const [date_range, setDateRange] = useState<DateRange>();
  const [search, setSearch] = useState<string>('');


  const classes = useStyles({})
  const [open, setOpen] = useState<boolean>(false);

  useEffect((): void=>{
    setMinPrice(queryMin_price || '')
    setMaxPrice(queryMax_price || '')
    setCategory(queryCategory || CATEGORY.ANY)
    setSearch(querySearch || '')
    
    let tempTags:string[] = queryTags?.split('-')
    tempTags = tempTags?.filter((tag: string)=>tag.length!==0)
    tempTags? setTags([...tempTags]) : setTags([])
  },[queryMin_price, queryMax_price, queryCategory, queryTags, querySearch])

  useEffect((): void =>{
    if(category===CATEGORY.BID) setTimer(queryTimer)
  },[category])

  const isDisabled=(): boolean =>{
    if(min_price && parseInt(min_price)<0) return true
    else if(max_price && parseInt(max_price)<0) return true
    if(!min_price && !max_price && !date_range && !category && !timer) return true
    if(min_price && max_price && parseInt(min_price)>parseInt(max_price)) return true
    return false
  }

  const handleDatePlaceHolder=(): string=>{
    let placeHolder: string = ""
    let startDate: string, endDate: string
    if(date_range){
      startDate = formatDate(date_range?.startDate, DATE_FORMAT.DATE)
      endDate = formatDate(date_range?.endDate, DATE_FORMAT.DATE)
      placeHolder = `${startDate} - ${endDate}`
    }
    return placeHolder
  }

  const handleTags=(_, value: string[]): void =>{
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
    setTags(value)
  }

  return (
    <Box className={classes.container} pt={4} pr={2}>
      <Typography variant="subtitle1">Price</Typography>
      <Box display="flex" justifyContent="center" alignItems="center" mb={1} mt={1}>
        <TextField 
          value={min_price}
          variant="outlined" 
          size="small"
          type="number"
          error={(min_price && parseInt(min_price)<0) || false}
          helperText={ (min_price && parseInt(min_price) < 0) ? 'Error' : 'MIN' }
          onChange={(e)=>setMinPrice(e.target.value)}
          className={classes.textfieldLeft}
        />
        <Typography variant="caption">{`-`}</Typography>
        <TextField
          value={max_price}
          variant="outlined"
          size="small"
          type="number"
          onChange={(e)=>setMaxPrice(e.target.value)}
          error={(max_price && parseInt(max_price)<0) || (min_price && max_price && parseInt(max_price)<parseInt(min_price)) || false}
          helperText={ ((max_price && parseInt(max_price)) < 0 || (min_price && max_price && parseInt(max_price)<parseInt(min_price))) ? 'Error' : 'MAX' }
          className={classes.textfieldRight}/>
      </Box>

      <Typography variant="subtitle1">Date</Typography>
      <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2} mt={1}>
        <Box  position={'absolute'}>
          <DateRangePicker
            open={open}
            toggle={()=>setOpen(!open)}
            onChange={(range) => setDateRange(range)}
            />
        </Box>
        { 
          <TextField 
            onClick={(): void=>setOpen(true)}
            fullWidth
            variant="outlined"
            className={classes.select}
            placeholder={date_range? handleDatePlaceHolder() : queryDate_range}
            >
        </TextField>}
      </Box>

      <Typography variant="subtitle1">Category</Typography>
      <Box display="flex" justifyContent="center" alignItems="center" mb={2} mt={1}>
      <Select value={category}
          onChange={(e)=>setCategory(e.target.value.toString())}
          fullWidth
          variant="outlined"
          className={classes.select}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left"
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left"
            },
            getContentAnchorEl: null
          }}
          >
          <MenuItem value={CATEGORY.ANY}>{CATEGORY.ANY}</MenuItem>
          <MenuItem value={CATEGORY.BID}>{CATEGORY.BID}</MenuItem>
          <MenuItem value={CATEGORY.SALE}>{CATEGORY.SALE}</MenuItem>
        </Select>
      </Box>
        
      {category===CATEGORY.BID && <>
        <Typography variant="subtitle1">Time Remaining</Typography>
        <Box display="flex" justifyContent="center" alignItems="center" mb={2} mt={1}>
          <Select value={timer}
            onChange={(e)=>setTimer(e.target.value.toString())}
            fullWidth
            variant="outlined"
            className={classes.select}
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left"
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left"
              },
              getContentAnchorEl: null
            }}
            >
            {Object.values(TIMER_OPTIONS)?.slice(1)?.map((timerItem: string)=><MenuItem key={timerItem} value={timerItem}>{`< ${timerItem}`}</MenuItem>)}
          </Select>
        </Box>
      </>}

      <Typography variant="subtitle1">Tags</Typography>
        <Box display="flex" justifyContent="center" alignItems="center" mb={4} mt={1}>
        <Autocomplete
          className={classes.tagsField}
          limitTags={1}
          multiple
          id="autocomplete-tags"
          freeSolo
          fullWidth
          options={tagValues.map((option) => option.tagName)}
          onChange={handleTags}
          value={tags}
          renderInput={(params) => (
            <TextField
              {...params}
              InputLabelProps={{ shrink: true }}
              label=""
              variant='outlined'
            />
          )}
        />
        </Box>

      <Button className={classes.submit}
        disabled={isDisabled()}
        onClick={(): void =>{
          let query: PostFilter = {}
          if(min_price) query.min_price = parseInt(min_price)
          if(max_price) query.max_price = parseInt(max_price)
          if(timer) query.timer = timer
          if(category) query.category = Object.values(CATEGORY).find((categoryVal: CATEGORY)=>categoryVal===category) || CATEGORY.ANY
          if(search) query.search = search

          if(tags?.length){
            let tagsStr: string = ''
            tags?.map((tag: string)=>tagsStr=`${tagsStr}-${tag}`)
            if(tagsStr) query.tags = tagsStr
          }

          if(date_range) {
            let startDate = formatDate(date_range?.startDate, DATE_FORMAT.DATE)
            let endDate = formatDate(date_range?.endDate, DATE_FORMAT.DATE)
            let dateRangeFormat: string = `${startDate}-${endDate}`
            if(dateRangeFormat) query.date_range =dateRangeFormat
          }else if(queryDate_range) query.date_range = queryDate_range

          let queryPath: string = queryString.stringify(query)
          router.push(`/shop?${queryPath}`)
        }}>Filter</Button>
        <Box mt={1}>
          <Typography variant="body2" style={{textDecoration: 'underline', cursor:'pointer'}} align="right" onClick={()=>router.push('/shop')}>
            Reset
          </Typography>
        </Box>
    </Box>

  )
}
export default FilterSideBar