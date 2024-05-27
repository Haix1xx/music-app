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
  Avatar
} from '@mui/material'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import React, { useEffect, useState } from 'react'
import withAuth from '@/authorization/withAuth'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import CustomSnackbar from '@/components/common/Snackbar'
import useResponsive from '@/hooks/useResponsive'
import EditIcon from '@mui/icons-material/Edit'
import { format } from '@/utils/formatDate'
import { FeaturedPlaylist } from '@/types/featuredPlaylist'
import CreateFeaturedPlayplist from '@/components/Playlist/CreateFeaturedPlaylist'
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
  const [data, setData] = useState<FeaturedPlaylist[]>([])
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [open, setOpen] = useState(false)
  const [total, setTotal] = useState(0)
  const [selectedPlaylist, setSelectedPlaylist] = useState<FeaturedPlaylist>()
  const [reload, setReload] = useState(false)
  const router = useRouter()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: {
          sort: string
          limit: number
          page: number
        } = {
          sort: 'createAt',
          limit: rowsPerPage,
          page: page + 1
        }

        const response = await axiosPrivate.get(UrlConfig.common.fplaylists, { params })
        setData(response.data.data.data as FeaturedPlaylist[])
        setTotal(response.data.total)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [page, rowsPerPage, reload])
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleOpenEditModal = (index: number) => {
    setSelectedPlaylist(data[index])
    setOpen(true)
  }

  const handleOpenCreateModal = () => {
    setSelectedPlaylist(undefined)
    setOpen(true)
  }

  const onModalClose = () => {
    setSelectedPlaylist(undefined)
    setOpen(false)
  }

  const handleViewDetails = (id: string) => {
    router.push(`/admin/f-playlists/${id}`)
  }
  return (
    <>
      <CustomSnackbar />
      <Modal open={open} onClose={onModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '60%' : '50%',
            height: isMobile ? '70%' : '80%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            padding: isMobile ? 3 : '20px'
          }}
        >
          {/* <CreateGenre open={open} setOpen={setOpen} genre={selectedGenre} setReload={setReload} /> */}
          <CreateFeaturedPlayplist playlist={selectedPlaylist} open={open} setOpen={setOpen} setReload={setReload} />
        </Box>
      </Modal>
      <Container maxWidth='xl' sx={{ height: '100%', overflowY: 'auto' }}>
        <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
          <Typography variant='h2'>Featured Playlist Management</Typography>
          <Button sx={{ margin: '10px' }} variant='contained' onClick={handleOpenCreateModal}>
            Create New Playlist
          </Button>
        </Stack>
        <TableContainer component={Paper} style={{ paddingBottom: '20px' }}>
          <Table sx={{ minWidth: 500, height: '100%' }} aria-label='custom pagination table'>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: 'left' }}>#</TableCell>
                <TableCell style={{ textAlign: 'left' }}>Title</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Total Tracks</TableCell>
                <TableCell style={{ textAlign: 'right' }}>Created At</TableCell>
                <TableCell style={{ textAlign: 'right' }}>Updated At</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((playlist, index) => (
                <TableRow key={playlist._id}>
                  <TableCell style={{ textAlign: 'left' }}>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell style={{ textAlign: 'left' }}>
                    <Stack direction='row' spacing={1} sx={{ justifyItems: 'center', alignItems: 'center' }}>
                      <Avatar src={playlist.coverPath} variant='square' />
                      <Typography>{playlist.title}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{playlist.tracks.length}</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>{`${format(playlist.createdAt)} ${new Date(
                    playlist.createdAt
                  ).toLocaleTimeString()}`}</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>{`${format(playlist.updatedAt)} ${new Date(
                    playlist.updatedAt
                  ).toLocaleTimeString()}`}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Tooltip title='Edit'>
                      <IconButton onClick={() => handleOpenEditModal(index)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='View Details'>
                      <IconButton onClick={() => handleViewDetails(playlist._id)}>
                        <RemoveRedEye />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {data.length < rowsPerPage &&
                Array.from({ length: rowsPerPage - data.length }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ textAlign: 'left' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'left' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'right' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'right' }}>-</TableCell>
                    <TableCell style={{ textAlign: 'center' }}></TableCell>
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
