/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  useTheme,
  TableFooter,
  TablePagination
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import React, { useEffect, useState } from 'react'
import withAuth from '@/authorization/withAuth'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useRouter } from 'next/navigation'
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
function page() {
  const axiosPrivate = useAxiosPrivate()
  const [page, setPage] = useState(0)
  const [data, setData] = useState<any[]>([])
  const router = useRouter()
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [numberAllUsers, setNumberAllUsers] = useState(0)
  // const filteredData = data.filter((user: any) => {
  //   const firstname = user.profile?.firstname || ''
  //   const lastname = user.profile?.lastname || ''
  //   const email = user.email || ''

  //   const lowerCaseSearchTerm = searchTerm.toLowerCase()

  //   return (
  //     firstname.toLowerCase().includes(lowerCaseSearchTerm) ||
  //     lastname.toLowerCase().includes(lowerCaseSearchTerm) ||
  //     email.toLowerCase().includes(lowerCaseSearchTerm)
  //   )
  // })
  const handleProcessing = async (status: string, reportId: string) => {
    try {
      const currentDate = new Date()
      const updatedData = data.map((report) =>
        report._id === reportId
          ? {
              ...report,
              status,
              processingDate: currentDate.toISOString()
            }
          : report
      )
      setData(updatedData)
      await axiosPrivate.post(UrlConfig.admin.reportProcessing, { status, reportId })
    } catch (error) {
      console.log(error)
    }
  }
  const redirectToPosts = async (id: String) => {
    try {
      router.push(`/posts/${id}`)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
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
        if (selectedStatus !== '') {
          params.status = selectedStatus
        }

        const response = await axiosPrivate.get(UrlConfig.admin.getAllReports, { params })
        setData(response.data.data.data)
        setNumberAllUsers(response.data.total)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [page, selectedStatus, rowsPerPage])
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleStatusChange = (event: any) => {
    setSelectedStatus(event.target.value as string)
  }
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <FormControl
        style={{ marginBottom: '15px', marginTop: '20px', marginLeft: '20px', minWidth: 150, background: 'white' }}
      >
        <InputLabel id='status-label'>Filter</InputLabel>
        <Select
          labelId='status-label'
          id='status-select'
          value={selectedStatus}
          onChange={(e) => handleStatusChange(e)}
        >
          <MenuItem value=''>All</MenuItem>
          <MenuItem value='Processing'>Processing</MenuItem>
          <MenuItem value='Accepted'>Accepted</MenuItem>
          <MenuItem value='Rejected'>Rejected</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper} style={{ paddingBottom: '30px' }}>
        <Table sx={{ minWidth: 500, height: '100%' }} aria-label='custom pagination table'>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: 'center' }}>Reporter</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Post</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Reason</TableCell>
              <TableCell style={{ textAlign: 'center' }}>CreatedAt</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Status</TableCell>
              <TableCell style={{ textAlign: 'center' }}>ProcessingDate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((report) => (
              <TableRow key={report._id}>
                <TableCell style={{ textAlign: 'center' }}>
                  {report.reporter.profile.firstname} {report.reporter.profile.lastname}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Button onClick={() => redirectToPosts(report.post)}>View detail</Button>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>{report.reason}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  {report.status === 'Processing' ? (
                    <>
                      <IconButton style={{ color: '#17c817' }} onClick={() => handleProcessing('Accepted', report._id)}>
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton style={{ color: 'red' }} onClick={() => handleProcessing('Rejected', report._id)}>
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>{report.status}</>
                  )}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  {report.processingDate != null ? new Date(report.processingDate).toLocaleDateString() : ''}
                </TableCell>
              </TableRow>
            ))}
            {data.length < rowsPerPage &&
              Array.from({ length: rowsPerPage - data.length }).map((_, index) => (
                <TableRow key={index}>
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
              count={numberAllUsers}
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
    </div>
  )
}

export default withAuth(page)(['admin'])
