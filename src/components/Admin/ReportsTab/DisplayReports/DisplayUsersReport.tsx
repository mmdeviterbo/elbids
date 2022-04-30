import React, { ReactElement, useEffect, useState, Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TablePagination, TableRow, Table, TableHead, TableContainer, TableBody, TableCell } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { User, DATE_FORMAT } from '../../../../types'
import formatDate from '../../../../utils/formatDate';
import { titleCase } from 'title-case';

const useStyles = makeStyles({
  root: {
  },
});

interface Data{
  full_name?: string,
  email?: string,    
  admin: string,
  status: string,
  date_created: string, 
  report_count?: Number  
}


const DisplayUsersReport=({
  users
}:{
  users: User[]
}): ReactElement=> {
  const [rows, setRows] = useState<Data[]>()
  const [rowsPerPage, setRowsPerPage] = useState(8)
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
    let tempUsers: Data[] = []
    if(users){
      users?.map((user: User, index: number)=>{
        <Fragment key={index}>
          {tempUsers.push({
            full_name: titleCase(user?.full_name?.toLowerCase()),
            email: user?.email,
            admin: user?.admin? 'Yes': 'No',
            status: titleCase(user?.status?.toLowerCase()),
            date_created: formatDate(user?.date_created, DATE_FORMAT.DATE_WORD),
            report_count: user?.report_count,
          })}
        </Fragment>
      })
      setRows([...tempUsers])
    }
  },[users])

  return (
    <div className={classes.root}>
      <Table aria-label="simple table" padding={'none'}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle1"><strong>Full Name</strong></Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle1"><strong>Email</strong></Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle1"><strong>Admin</strong></Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle1"><strong>Status</strong></Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle1"><strong>Created</strong></Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle1"><strong>Report Count</strong></Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          )?.map((row: Data, index: number): ReactElement => (
            <TableRow key={index}>
              <TableCell component="th" scope="row" style={{padding:"6px 0px"}}>
                <Typography color="textPrimary" variant="subtitle2">{row.full_name}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="subtitle2">{row.email}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="subtitle2">{row.admin}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="subtitle2">{row.status}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="subtitle2">{row.date_created}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="subtitle2">{row.report_count}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    {users?.length>rowsPerPage && <TablePagination
      component="div"
      count={rows?.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />}
    </div>
  );
}

export default DisplayUsersReport