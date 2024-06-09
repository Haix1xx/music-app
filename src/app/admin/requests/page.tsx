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
  Box,
  useTheme,
  TableFooter,
  TablePagination,
  Stack,
  Container,
  Modal,
  Tooltip,
  Avatar,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Select,
  MenuItem
} from '@mui/material'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import React, { useEffect, useState } from 'react'
import withAuth from '@/authorization/withAuth'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import { Genre } from '@/types/genre'
import CustomSnackbar from '@/components/common/Snackbar'
import CreateGenre from '@/components/Genre/CreateGenre'
import useResponsive from '@/hooks/useResponsive'
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear'
import DoneIcon from '@mui/icons-material/Done'
import { format } from '@/utils/formatDate'
import { ArtistRequest } from '@/types/artistRequest'
import useSnackbar from '@/context/snackbarContext'
import { REQUEST_STATUS } from '@/common/requestStatus'
import { REQUEST_TYPE } from '@/common/requestType'
import RequestStatusLabel from './RequestStatusLabel'

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

function Page() {
  const isMobile = useResponsive('down', 'sm')
  const axiosPrivate = useAxiosPrivate()
  const [page, setPage] = useState(0)
  const [data, setData] = useState<ArtistRequest[]>([])
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [total, setTotal] = useState(0)
  const [reload, setReload] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('0')
  const { setSnack } = useSnackbar()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: {
          sort: string
          limit: number
          page: number
          status: string | undefined
          q: string | undefined
        } = {
          sort: '-createdAt',
          limit: rowsPerPage,
          page: page + 1,
          status: undefined,
          q: undefined
        }

        if (searchText || selectedStatus !== '0') {
          params.status = selectedStatus !== '0' ? selectedStatus : undefined
          params.q = searchText
          const response = await axiosPrivate.post(UrlConfig.admin.artistRequest, params)
          setData(response.data.data.data)
          setTotal(response.data.data.total)
        } else {
          const response = await axiosPrivate.get(UrlConfig.admin.artistRequest, { params })
          setData(response.data.data.data)
          setTotal(response.data.total)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [page, rowsPerPage, reload, searchText, selectedStatus])
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleUpdateRequestStatus = (id: string, status: string) => {
    const fetchData = async () => {
      try {
        const params = {
          type: status,
          id
        }
        console.log(params)
        const response = await axiosPrivate.put(UrlConfig.admin.artistRequest, params)

        if (response.data.status === 'success') {
          setSnack({
            open: true,
            type: 'success',
            message: 'Update status successfully'
          })

          setReload((prev) => !prev)
        }
      } catch (error) {
        setSnack({
          open: true,
          type: 'error',
          message: `An error occurs while updating status`
        })
      }
    }
    fetchData()
  }

  return (
    <>
      <CustomSnackbar />
      <Container maxWidth='xl' sx={{ height: '100%', overflowY: 'auto' }}>
        <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
          <Typography variant='h2'>Request Management</Typography>
          <Stack direction='row' spacing={1} sx={{ height: '90%' }}>
            <FormControl sx={{ m: 1, width: '80%' }} variant='outlined'>
              <OutlinedInput
                id='outlined-adornment-amount'
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                startAdornment={<InputAdornment position='start'>Search: </InputAdornment>}
              />
            </FormControl>
            <Select
              startAdornment={<InputAdornment position='start'>Status: </InputAdornment>}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              sx={{ minWidth: '200px' }}
            >
              <MenuItem value='0'>All</MenuItem>
              <MenuItem value={REQUEST_STATUS.PENDING}>Pending</MenuItem>
              <MenuItem value={REQUEST_STATUS.APPROVED}>Aprroved</MenuItem>
              <MenuItem value={REQUEST_STATUS.REJECTED}>Rejected</MenuItem>
            </Select>
          </Stack>
        </Stack>
        <TableContainer component={Paper} style={{ paddingBottom: '20px' }}>
          <Table sx={{ minWidth: 500, height: '100%' }} aria-label='custom pagination table'>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: 'left' }}>#</TableCell>
                <TableCell style={{ textAlign: 'left' }}>Artist</TableCell>
                <TableCell style={{ textAlign: 'left' }}>Email</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Status</TableCell>
                <TableCell style={{ textAlign: 'right' }}>Created At</TableCell>
                <TableCell style={{ textAlign: 'right' }}>Updated At</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((request, index) => (
                <TableRow key={request._id}>
                  <TableCell style={{ textAlign: 'left' }}>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell style={{ textAlign: 'left' }}>
                    <Stack direction='row' spacing={1} sx={{ justifyItems: 'center', alignItems: 'center' }}>
                      <Avatar src={request.artist.profile.avatar} />
                      <Typography>{request.artist.profile.displayname}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell style={{ textAlign: 'left' }}>{request.artist?.email}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <RequestStatusLabel status={request.status} />
                  </TableCell>
                  <TableCell style={{ textAlign: 'right' }}>{`${format(request.createdAt)} ${new Date(
                    request.createdAt
                  ).toLocaleTimeString()}`}</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>{`${format(request.updatedAt)} ${new Date(
                    request.updatedAt
                  ).toLocaleTimeString()}`}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Stack
                      direction='row'
                      sx={{
                        justifyContent: 'center'
                      }}
                    >
                      {request.status !== REQUEST_STATUS.REJECTED && (
                        <Tooltip title='Reject'>
                          <IconButton onClick={() => handleUpdateRequestStatus(request._id, REQUEST_TYPE.REJECT)}>
                            <ClearIcon sx={{ color: 'error.dark' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                      {request.status !== REQUEST_STATUS.APPROVED && (
                        <Tooltip title='Approve'>
                          <IconButton onClick={() => handleUpdateRequestStatus(request._id, REQUEST_TYPE.APPROVE)}>
                            <DoneIcon sx={{ color: 'success.main' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {data.length < rowsPerPage &&
                Array.from({ length: rowsPerPage - data.length }).map((_, index) => (
                  <TableRow key={index}>
                    {/* <TableCell style={{ textAlign: 'center' }}>-</TableCell> */}
                    <TableCell style={{ textAlign: 'left' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'left' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'left' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'right' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'right' }}>-</TableCell>
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
      </Container>
    </>
  )
}

export default withAuth(Page)(['admin'])
