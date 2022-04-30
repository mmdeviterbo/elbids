import React, { Component } from 'react'
import {Table, TableBody, TableHead, TableRow, TableCell, TableContainer, Paper } from '@material-ui/core';
import { Box, Typography, Grid, Button, Divider, Tooltip } from '@material-ui/core';
import _ from 'lodash'
import { CATEGORY, DATE_FORMAT } from '../../../../types';
import formatDate from '../../../../utils/formatDate';
import { titleCase } from 'title-case';

class PrintItemsReport extends Component{
  state = {
    rows: [],
  }

  handlePrice=(post)=>{
    if(post?.category === CATEGORY.BID){
      return `₱${post?.item?.starting_price} (+${post?.item?.additional_bid})`
    }else return post?.item?.starting_price
  }

  handleItem=(post)=>{
    let row
    if(post?.category === CATEGORY.BID){
      if(post?.archived){ //sold
        row = this.createData(
          post?._id,
          titleCase(post?.item?.title.toLowerCase()),
          titleCase(post?.category?.toLowerCase()),
          titleCase(post?.seller?.full_name.toLowerCase()),
          titleCase(post?.item?.buyer?.full_name.toLowerCase()),
          `₱${post?.item?.starting_price} (+${post?.item?.additional_bid})`,
          post?.item?.current_bid,
          formatDate(post?.item?.date_latest_bid, DATE_FORMAT.DATE_WORD),
        )
      }else{
        row = this.createData(
          post?._id,
          titleCase(post?.item?.title.toLowerCase()),
          titleCase(post?.category?.toLowerCase()),
          titleCase(post?.seller?.full_name.toLowerCase()),
          '-',
          `₱${post?.item?.starting_price} (+${post?.item?.additional_bid})`,
          '-',
          '-'
        )
      }
    }else{
      if(post?.archived){
        row = this.createData(
          post?._id,
          titleCase(post?.item?.title.toLowerCase()),
          titleCase(post?.category?.toLowerCase()),
          titleCase(post?.seller?.full_name.toLowerCase()),
          titleCase(post?.item?.buyer?.full_name.toLowerCase()),
          `₱${post?.item?.starting_price}`,
          '-',
          formatDate(post?.item?.date_first_bid, DATE_FORMAT.DATE_WORD),
        )
      }else{
        row = this.createData(
          post?._id,
          titleCase(post?.item?.title.toLowerCase()),
          titleCase(post?.category?.toLowerCase()),
          titleCase(post?.seller?.full_name.toLowerCase()),
          '-',
          `₱${post?.item?.starting_price}`,
          '-',
          '-'
        )
      }
    }
    return row
  }

  componentDidMount(){
    const { posts } = this.props
    console.log(this.props.posts)
    let tempRows = []
    if(!this.state?.rows?.length){
      posts?.map((post)=>tempRows.push(this.handleItem(post)))
      this.setState({rows: [...tempRows]})
    }
  }
  
  columns = [
    { id: 'id', label: 'ID' },
    { id: 'item', label: 'Item', align: 'right'},       //item.title
    { id: 'category', label: 'Category', align: 'right'},
    { id: 'seller', label: 'Seller', align: 'right'},
    { id: 'buyer', label: 'Buyer', align: 'right'},
    { id: 'price', label: 'Price', align: 'right'},     //bid: starting (+ addn bid)
    { id: 'bid', label: 'Bid', align: 'right'},
    { id: 'date_latest_bid', label: 'Date', align: 'right'}
  ];

  createData=(id, item, category, seller, buyer, price, bid, date_latest_bid)=>{
    return { id, item, category, seller, buyer, price, bid, date_latest_bid }
  }

  handleRow=(e)=>{
    this.setState({page: e.target.value})
  }

  handlePage=(e)=>{
    this.setState({rowsPerPage: e.target.value})
  }

  render() {    
    const { rows } = this.state
    const { classes } = this.props;

    return (
      <Table stickyHeader aria-label="sticky table" size="small">
        <TableHead>
          <TableRow>
            {this.columns?.map((column) => (
              <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                <strong>{column.label}</strong>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                {this.columns?.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === 'number' ? column.format(value) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

export default PrintItemsReport
