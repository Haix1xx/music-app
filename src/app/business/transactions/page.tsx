'use client'
import React from 'react'
import {
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  TableHead,
  TextField,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import withAuth from '@/authorization/withAuth'
import { BusinessRequest } from '@/types/businessRequest'
import { axiosPrivate } from '@/axios'
import UrlConfig from '@/config/urlConfig'
import { PostTransaction } from '@/types/postTransaction'

interface TablePaginationActionsProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme()
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label='first page'>
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label='previous page'>
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  )
}
const status = ['all', 'pending', 'verified', 'approved', 'canceled', 'rejected']

export default function Transaction() {
  const [requestStatus, setRequestStatus] = React.useState('')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  // const [requests, setRequests] = React.useState<BusinessRequest[]>([])
  const [transactions, setTransactions] = React.useState<PostTransaction[]>([])
  const [total, setTotal] = React.useState(0)
  const handleChange = (event: SelectChangeEvent) => {
    setRequestStatus(event.target.value)
  }
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const params: {
          sort: string
          limit: number
          page: number
          status?: string
        } = {
          sort: '-createdAt',
          limit: rowsPerPage,
          page: page + 1
        }

        if (requestStatus && requestStatus !== 'all') {
          params.status = requestStatus
        }
        const response = await axiosPrivate.get(UrlConfig.admin.getTransactions, { params })
        // setRequests(response.data.data)
        console.log('------------------', response.data)
        console.log(response.data.data.data)
        setTransactions(response.data.data.data)
        setTotal(response.data.total)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [page, requestStatus, rowsPerPage])

  // const handleRequestChange = (requestId: string, status: string) => {
  //   const requestsCopy = [...requests]
  //   const index = requestsCopy.findIndex((request) => request._id === requestId)
  //   if (index !== -1) {
  //     requestsCopy[index].status = status

  //     setRequests(requestsCopy)
  //   }
  // }
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  return (
    <Grid container spacing={2} xs={12} sx={{ height: '100%' }}>
      <Grid item xs={6}>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            )
          }}
          id='outlined-basic'
          label='Search'
          variant='outlined'
          sx={{ width: '80%', margin: '20px 30px', background: 'white' }}
          // onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <FormControl sx={{ m: 1, minWidth: 120, width: '200px', margin: '20px 30px' }}>
          <InputLabel id='demo-simple-select-helper-label'>Status</InputLabel>
          <Select
            labelId='demo-simple-select-helper-label'
            id='demo-simple-select-helper'
            value={requestStatus}
            label='State'
            onChange={handleChange}
          >
            <MenuItem value=''></MenuItem>
            {status.map((state) => (
              <MenuItem value={state}>
                <em>{state}</em>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ height: '80%', overflow: 'auto', margin: '20px 30px' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500, height: '100%' }} aria-label='custom pagination table'>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: 'center', width: '20%' }}>
                  <Typography variant='h5'>No.</Typography>
                </TableCell>
                <TableCell style={{ textAlign: 'center', width: '20%' }}>
                  <Typography variant='h5'>Transaction Id</Typography>
                </TableCell>
                <TableCell style={{ textAlign: 'center', width: '20%' }}>
                  <Typography variant='h5'>Created At</Typography>
                </TableCell>
                <TableCell style={{ textAlign: 'center', width: '10%' }}>
                  <Typography variant='h5'>Amount</Typography>
                </TableCell>
                <TableCell style={{ textAlign: 'center', width: '10%' }}>
                  <Typography variant='h5'>Status</Typography>
                </TableCell>
                <TableCell style={{ textAlign: 'center', width: '10%' }}>
                  <Typography variant='h5'>Post detail</Typography>
                </TableCell>
                {/* <TableCell style={{ textAlign: 'center', width: '10%' }}>
                  <Typography variant='h5'>Status</Typography>
                </TableCell>
                <TableCell style={{ textAlign: 'center', width: '20%' }}>
                  <Typography variant='h5'>Updated At</Typography>
                </TableCell>
                <TableCell style={{ textAlign: 'center', width: '10%' }}>
                  <Typography variant='h5'>Action</Typography>
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Typography>{transaction._id}</Typography>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Typography>{transaction._id}</Typography>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Typography>{transaction.createdAt}</Typography>
                  </TableCell>

                  <TableCell style={{ textAlign: 'center' }}>
                    <Typography>{transaction.amount}</Typography>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Typography>{transaction.status === 'approved' ? <CheckCircleIcon /> : '-'}</Typography>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Typography>{transaction.status}</Typography>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Typography>
                      <Typography>AAA</Typography>
                      {/* <ActionPopOver
                        request={request._id}
                        user={request.user?.id}
                        setRequests={handleRequestChange}
                      ></ActionPopOver> */}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
              {transactions.length < rowsPerPage &&
                Array.from({ length: rowsPerPage - transactions.length }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ textAlign: 'center' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>-</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                colSpan={7}
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page'
                  },
                  native: true
                }}
                align='right'
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </TableContainer>
      </Grid>
    </Grid>
  )
}
