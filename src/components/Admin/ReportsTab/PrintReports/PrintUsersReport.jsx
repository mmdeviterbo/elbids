import React, { Component } from 'react'
import {Table, TableBody, TableHead, TableRow, TableCell, TableContainer, Paper } from '@material-ui/core';
import { Box, Typography, Grid, Button, Divider, Tooltip } from '@material-ui/core';
import _ from 'lodash'
import { DATE_FORMAT } from '../../../../types';
import formatDate from '../../../../utils/formatDate';
import { titleCase } from 'title-case';

class PrintUsersReport extends Component{
  state = {
    rows: [],
  }

  componentDidMount(){
    const { users } = this.props
    let tempRows = []
    if(!this.state?.rows?.length){
      users?.forEach((user)=>tempRows.push(this.createData(
        user?._id,
        titleCase(user?.last_name.toLowerCase()),
        titleCase(user?.first_name.toLowerCase()),
        user?.email,
        user?.admin? 'Yes': 'No',
        titleCase(user?.status.toLowerCase()),
        formatDate(user?.date_created, DATE_FORMAT.DATE_WORD),
        user?.report_count,
      )))
      this.setState({rows: [...tempRows]})
    }
  }
  
  columns = [
    { id: 'id', label: 'ID'},
    { id: 'lastName', label: 'Last Name', align: 'right' },
    { id: 'firstName', label: 'First Name', align: 'right'},
    { id: 'email', label: 'Email', align: 'right'},
    { id: 'admin', label: 'Admin', align: 'right'},
    { id: 'status', label: 'Status', align: 'right'},
    { id: 'dateJoined', label: 'Date Joined', align: 'right'},
    { id: 'reportCount', label: 'Report Count', align: 'right'},
  ];

  createData=(id, lastName, firstName, email, admin, status, dateJoined, reportCount)=>{
    return {id, lastName, firstName, email, admin,status, dateJoined, reportCount}
  }

  render() {    
    const { rows } = this.state
    const { classes } = this.props;

    return (
      <Table stickyHeader aria-label="sticky table" size="small">
        <TableHead>
          <TableRow>
            {this.columns?.map((column, index) => (
              <TableCell key={column.id || index} align={column.align} style={{ minWidth: column.minWidth }}>
                <strong>{column.label}</strong>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row, index) => {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.code || index}>
                {this.columns?.map((column, index) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id || index} align={column.align}>
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

export default PrintUsersReport
