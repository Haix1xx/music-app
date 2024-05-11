import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import { visuallyHidden } from '@mui/utils'

import { Album } from '@/types/album'
import { Container, Stack } from '@mui/material'
import { TrackOrder } from '@/types/album'
import { TrackInfo } from '@/types/TrackInfo'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import TimeFormatter from '@/utils/timeFormatter'
import { ArrowDownward, ArrowUpward, ArtTrackSharp, PlayArrow } from '@mui/icons-material'
import TrackTitle from '@/components/Track/TrackTitle'
import { title } from 'process'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import CustomSnackbar from '@/components/common/Snackbar'
import useSnackbar from '@/context/snackbarContext'
import { useRouter } from 'next/navigation'
import { FeaturedPlaylist } from '@/types/featuredPlaylist'
interface HeadCell {
  disablePadding: boolean
  id: keyof TrackInfo | keyof TrackOrder
  label: string
  numeric: boolean
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const headCells: readonly HeadCell[] = [
  {
    id: 'order',
    numeric: false,
    disablePadding: true,
    label: '#'
  },
  {
    id: 'title',
    numeric: false,
    disablePadding: false,
    label: 'Title'
  },
  {
    id: 'duration',
    numeric: true,
    disablePadding: false,
    label: 'Duration'
  }
]
interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof TrackInfo | keyof TrackOrder) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
  const createSortHandler = (property: keyof TrackInfo | keyof TrackOrder) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts'
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

interface EnhancedTableToolbarProps {
  numSelected: number
  handleUpTrackOrder: () => void
  handleDownTrackOrder: () => void
  handleSaveChanges: () => void
  handleSetSelectedTrack: () => void
  handleEditTrack: () => void
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    numSelected,
    handleDownTrackOrder,
    handleUpTrackOrder,
    handleSaveChanges,
    handleSetSelectedTrack,
    handleEditTrack
  } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component='div'>
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant='h6' id='tableTitle' component='div'>
          Track List
        </Typography>
      )}
      {numSelected > 0 ? (
        <Stack direction='row'>
          <Tooltip title='Up'>
            <IconButton onClick={handleUpTrackOrder}>
              <ArrowUpward />
            </IconButton>
          </Tooltip>
          <Tooltip title='Down'>
            <IconButton onClick={handleDownTrackOrder}>
              <ArrowDownward />
            </IconButton>
          </Tooltip>

          <Tooltip title='Delete'>
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Edit'>
            <IconButton onClick={handleEditTrack} disabled={numSelected !== 1}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Preview'>
            <IconButton onClick={handleSetSelectedTrack} disabled={numSelected !== 1}>
              <PlayArrow />
            </IconButton>
          </Tooltip>
        </Stack>
      ) : (
        <Tooltip title='Save changes'>
          <IconButton onClick={handleSaveChanges}>
            <SaveIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

interface TrackTableProps {
  playlist: FeaturedPlaylist
  setPlaylist: Dispatch<SetStateAction<FeaturedPlaylist | undefined>>
  setSelectedTrack: Dispatch<SetStateAction<TrackInfo | null>>
}

export default function TrackTable(props: TrackTableProps) {
  const { playlist, setPlaylist, setSelectedTrack } = props
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof TrackInfo | keyof TrackOrder>('order')
  const [selected, setSelected] = useState<readonly number[]>([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(15)

  const axios = useAxiosPrivate()
  const router = useRouter()
  const { setSnack } = useSnackbar()
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof TrackOrder | keyof TrackInfo) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSetSelectedTrack = () => {
    if (selected.length === 1) {
      setSelectedTrack(playlist.tracks[selected[0]].track)
    }
  }

  const handleEditTrack = () => {
    if (selected.length === 1) {
      router.push(`/artist/track/${playlist.tracks[selected[0]].track._id}`)
    }
  }
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = playlist.tracks.map((n) => n.order)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly number[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }
    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }

  const isSelected = (id: number) => selected.indexOf(id) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - playlist.tracks.length) : 0

  const visibleRows = () => playlist.tracks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // changeValue = -1 -> up
  // changeValue = 1 -> down
  const changeOrder = (changeValue: number) => {
    const copyPlaylist = { ...playlist }
    let { tracks } = copyPlaylist

    let changedOrderTracks: TrackOrder[] = []

    selected.toReversed().forEach((value) => {
      changedOrderTracks.unshift(...tracks.splice(value, 1))
    })

    let newOrderTracks = [
      ...tracks.slice(0, selected[0] + changeValue),
      ...changedOrderTracks,
      ...tracks.slice(selected[0] + changeValue)
    ]

    newOrderTracks.forEach((value, index) => {
      value.order = index
    })
    copyPlaylist.tracks = newOrderTracks
    setPlaylist(copyPlaylist)
    let newSelected: number[] = []
    for (let i = 0; i < selected.length; i++) {
      newSelected.push(selected[0] + changeValue + i)
    }
    setSelected(newSelected)
  }
  const handleUpTrackOrder = () => {
    if (selected[0] === 0) {
      setSelected([])
      return
    }
    changeOrder(-1)
  }

  const handleDownTrackOrder = () => {
    if (selected[selected.length - 1] === playlist.tracks.length - 1) {
      setSelected([])
      return
    }
    changeOrder(1)
  }

  const handleSaveChanges = async () => {
    console.log('saving...')
    try {
      const response = await axios.patch(UrlConfig.common.playlistAndTracks(playlist._id), {
        tracks: playlist.tracks.map((item) => ({
          order: item.order,
          track: item.track._id
        }))
      })

      if (response.data.status === 'success') {
        setSnack({
          open: true,
          message: 'Save track order successfully',
          type: 'success'
        })
        setSelected([])
      }
    } catch (err) {
      return
    }
  }
  return (
    <>
      <CustomSnackbar />
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            handleDownTrackOrder={handleDownTrackOrder}
            handleUpTrackOrder={handleUpTrackOrder}
            handleSaveChanges={handleSaveChanges}
            handleSetSelectedTrack={handleSetSelectedTrack}
            handleEditTrack={handleEditTrack}
          />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={dense ? 'small' : 'medium'}>
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={playlist.tracks.length}
              />
              <TableBody>
                {visibleRows().map((row, index) => {
                  const isItemSelected = isSelected(row.order)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.order)}
                      role='checkbox'
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.order}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding='checkbox'>
                        <Checkbox
                          color='primary'
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId
                          }}
                        />
                      </TableCell>
                      <TableCell component='th' id={labelId} scope='row' padding='none'>
                        {row.order + 1}
                      </TableCell>
                      <TableCell align='left'>
                        <Stack>
                          <TrackTitle
                            key={row.track._id}
                            title={row.track.title}
                            coverPath={row.track.coverPath}
                            artists={row.track.artist.profile.displayname}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell align='right'>{TimeFormatter(row.track.duration ?? 0)}</TableCell>
                    </TableRow>
                  )
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 20]}
            component='div'
            count={playlist.tracks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label='Dense padding' />
      </Box>
    </>
  )
}
