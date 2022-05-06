import React, { ReactElement, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TablePagination, TableRow, Table, TableHead, TableContainer, TableBody, TableCell} from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Item, CATEGORY, User, Post, DATE_FORMAT } from '../../../../types'
import formatDate from '../../../../utils/formatDate';
import { titleCase } from 'title-case';

const useStyles = makeStyles({
  root: {
  },
});

interface Data{
  id?: string,
  title?: string,     //item title
  category?: string,
  seller?: string,    //full_name
  buyer: string,
  price: string,
  bid?: string, 
  date_latest_bid?: string  
}

const DisplayItemsReport=({
  posts
}:{
  posts: Post[]
}): ReactElement=> {
  const [rows, setRows] = useState<Data[]>()
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(0)
  const classes = useStyles();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(()=>{
    let tempRows: Data[] = []
    if(posts){
      posts?.map((post: Post)=>{
        if(post?.category === CATEGORY.BID){
          tempRows.push({
            id: post?._id.toString(),
            title: titleCase(post?.item?.title?.toLowerCase() || ""),
            category: titleCase(post?.category?.toLowerCase() || ""),
            seller: titleCase(post?.seller?.full_name?.toLowerCase() || ""),
            buyer: post?.archived? titleCase(post?.item?.buyer?.full_name?.toLowerCase() || "") : '-',
            price: `₱${post?.item?.current_bid}`,
            date_latest_bid: post?.archived? formatDate(post?.item?.date_latest_bid,DATE_FORMAT.DATE_WORD) : '-'
          })
        }else{
          tempRows.push({
            id: post?._id.toString(),
            title: post?.item?.title,
            category: titleCase(post?.category?.toLowerCase() || ""),
            seller: titleCase(post?.seller?.full_name?.toLowerCase() || ""),
            buyer: post?.archived? titleCase(post?.item?.buyer?.full_name?.toLowerCase() || "") : '-',
            price: `₱${post?.item?.starting_price}`,
            date_latest_bid: post?.archived? formatDate(post?.item?.date_first_bid, DATE_FORMAT.DATE_WORD) : '-'
          })
        }
      })
      setRows([...tempRows])
    }
  },[posts])

  return (
    <div>
      <Table aria-label="simple table" padding={'none'}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle1"><strong>Title</strong></Typography>
            </TableCell>
            <TableCell align="right">
               <Typography variant="subtitle1"><strong>Category</strong></Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle1"><strong>Seller</strong></Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle1"><strong>Buyer</strong></Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle1"><strong>Price</strong></Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle1"><strong>Date</strong></Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          )?.map((row: Data): ReactElement => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row" style={{padding:"6px 0px"}}>
              <Typography color="textPrimary" variant="subtitle2">{row.title}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="subtitle2">{row.category}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="subtitle2">{row.seller}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="subtitle2">{row.buyer}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="subtitle2">{row.price}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="subtitle2">{row.date_latest_bid}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {posts?.length>rowsPerPage && <TablePagination
        component="div"
        count={rows?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />}
    </div>
  );
}

export default DisplayItemsReport