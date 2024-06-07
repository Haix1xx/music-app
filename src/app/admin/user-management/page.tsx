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
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [selectedRole, setSelectedRole] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [numberAllUsers, setNumberAllUsers] = useState(0)
  const filteredData = data.filter((user: any) => {
    const firstname = user.profile?.firstname || ''
    const lastname = user.profile?.lastname || ''
    const email = user.email || ''

    const lowerCaseSearchTerm = searchTerm.toLowerCase()

    return (
      firstname.toLowerCase().includes(lowerCaseSearchTerm) ||
      lastname.toLowerCase().includes(lowerCaseSearchTerm) ||
      email.toLowerCase().includes(lowerCaseSearchTerm)
    )
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: {
          fields: string
          sort: string
          limit: number
          page: number
          role?: string
        } = {
          fields: 'email,role,isActive,profile',
          sort: '-createdAt',
          limit: rowsPerPage,
          page: page + 1
        }
        if (selectedRole !== '') {
          params.role = selectedRole
        }

        const response = await axiosPrivate.get(UrlConfig.admin.getAllUsers, { params })
        setData(response.data.data.data)
        setNumberAllUsers(response.data.total)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [page, selectedRole, rowsPerPage])
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  // const handleNextPage = () => {
  //   setPage((prevPage) => prevPage + 1)
  // }

  // const handlePrevPage = () => {
  //   setPage((prevPage) => Math.max(prevPage - 1, 1))
  // }
  const handleRoleChange = (event: any) => {
    setSelectedRole(event.target.value as string)
  }
  const lockOrUnlockAccount = async (userId: String) => {
    try {
      await axiosPrivate.patch(UrlConfig.admin.lockOrUnlockAccount(userId))
      setData((prevData) =>
        prevData.map((user) => (user._id === userId ? { ...user, isActive: !user.isActive } : user))
      )
    } catch (error) {
      console.log(error)
    }
  }
  console.log(numberAllUsers)
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Grid container spacing={2} xs={12} sx={{ marginLeft: '20px' }}>
        <Grid item xs={4}>
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl style={{ marginBottom: '15px', marginTop: '20px', minWidth: 120, background: 'white' }}>
            <InputLabel id='role-label'>Filter</InputLabel>
            <Select labelId='role-label' id='role-select' value={selectedRole} onChange={(e) => handleRoleChange(e)}>
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='user'>User</MenuItem>
              <MenuItem value='admin'>Admin</MenuItem>
              <MenuItem value='artist'>Artist</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
      <TableContainer component={Paper} style={{ paddingBottom: '20px' }}>
        <Table sx={{ minWidth: 500, height: '100%' }} aria-label='custom pagination table'>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: 'center' }}>First Name</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Last Name</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Email</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Role</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(filteredData) &&
              filteredData.map((user) => (
                <TableRow key={user._id}>
                  <TableCell style={{ textAlign: 'center' }}>{user.profile?.firstname || '-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{user.profile?.lastname || '-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{user.email}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{user.role}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Button
                      variant={user.isActive ? 'outlined' : 'contained'}
                      onClick={() => lockOrUnlockAccount(user._id)}
                    >
                      {user.isActive ? 'Lock' : 'Unlock'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            {filteredData.length < rowsPerPage &&
              Array.from({ length: rowsPerPage - filteredData.length }).map((_, index) => (
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
