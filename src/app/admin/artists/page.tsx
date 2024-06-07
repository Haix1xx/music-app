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
  IconButton,
  Typography,
  Box,
  useTheme,
  TableFooter,
  TablePagination,
  Stack,
  Container,
  Tooltip,
  Avatar,
  FormControl,
  InputAdornment,
  OutlinedInput
} from '@mui/material'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import React, { useEffect, useState } from 'react'
import withAuth from '@/authorization/withAuth'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import useResponsive from '@/hooks/useResponsive'
import EditIcon from '@mui/icons-material/Edit'
import { Artist } from '@/types/artist'
import { format } from '@/utils/formatDate'
import { RemoveRedEye } from '@mui/icons-material'
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

function Page() {
  const isMobile = useResponsive('down', 'sm')
  const axiosPrivate = useAxiosPrivate()
  const [page, setPage] = useState(0)
  const [data, setData] = useState<Artist[]>([])
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [open, setOpen] = useState(false)
  const [total, setTotal] = useState(0)
  const [selectedArtist, setSelectedArtist] = useState<Artist>()
  const [reload, setReload] = useState(false)
  const [searchText, setSearchText] = useState('')
  const router = useRouter()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: {
          sort: string
          limit: number
          page: number
          type: string | undefined
          q: string | undefined
        } = {
          sort: '-createdAt',
          limit: rowsPerPage,
          page: page + 1,
          type: undefined,
          q: undefined
        }

        let url = UrlConfig.common.artists
        if (searchText) {
          url = UrlConfig.common.searchPaging
          params.type = 'artist'
          params.q = searchText
        }
        const response = await axiosPrivate.get(encodeURI(url), { params })
        setData(response.data.data.data as Artist[])
        setTotal(response.data?.total ?? response.data.data.total)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [page, rowsPerPage, reload, searchText])
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleOpenEditModal = (index: number) => {
    setSelectedArtist(data[index])
    setOpen(true)
  }

  const handleOpenCreateModal = () => {
    setSelectedArtist(undefined)
    setOpen(true)
  }

  const onModalClose = () => {
    setSelectedArtist(undefined)
    setOpen(false)
  }

  const viewArtistDetails = (id: string) => {
    router.push(`/artist/${id}`)
  }
  return (
    <>
      <title>Artist Management</title>
      {/* <CustomSnackbar />
      <Modal open={open} onClose={onModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '60%' : '35%',
            height: '250px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            padding: isMobile ? 3 : '20px'
          }}
        >
          <CreateGenre open={open} setOpen={setOpen} genre={selectedGenre} setReload={setReload} />
        </Box>
      </Modal> */}
      <Container maxWidth='xl' sx={{ height: '100%', overflowY: 'auto' }}>
        <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
          <Typography variant='h2'>Artist Management</Typography>
          <FormControl sx={{ m: 1, width: '40%' }} variant='outlined'>
            <OutlinedInput
              id='outlined-adornment-amount'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              startAdornment={<InputAdornment position='start'>Search: </InputAdornment>}
            />
          </FormControl>
        </Stack>
        <TableContainer component={Paper} style={{ paddingBottom: '20px' }}>
          <Table sx={{ minWidth: 500, height: '100%' }} aria-label='custom pagination table'>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: 'left' }}>#</TableCell>
                <TableCell style={{ textAlign: 'left' }}>Display name</TableCell>
                <TableCell style={{ textAlign: 'left' }}>Fullname</TableCell>
                <TableCell style={{ textAlign: 'left' }}>Email</TableCell>
                <TableCell style={{ textAlign: 'right' }}>Joined At</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((artist, index) => (
                <TableRow key={artist._id}>
                  <TableCell style={{ textAlign: 'left' }}>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell style={{ textAlign: 'left' }}>
                    <Stack direction='row' spacing={1} sx={{ justifyItems: 'center', alignItems: 'center' }}>
                      <Avatar src={artist.avatar} />
                      <Typography>{artist.displayname}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell style={{ textAlign: 'left' }}>{`${artist.firstname} ${artist.lastname}`}</TableCell>
                  <TableCell style={{ textAlign: 'left' }}>{artist.user.email}</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>{format(artist.createdAt)}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Stack direction='row' sx={{ justifyContent: 'center' }}>
                      <IconButton onClick={() => handleOpenEditModal(index)}>
                        <EditIcon />
                      </IconButton>
                      <Tooltip title='View Detail'>
                        <IconButton onClick={() => viewArtistDetails(artist.user._id)}>
                          <RemoveRedEye />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {data.length < rowsPerPage &&
                Array.from({ length: rowsPerPage - data.length }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ textAlign: 'left' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'left' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'left' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'left' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'right' }}>-</TableCell>
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
