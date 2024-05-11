import TrackPopover from '@/components/Track/TrackPopover'
import { TrackInfo } from '@/types/TrackInfo'
import { Album } from '@/types/album'
import TimeFormatter from '@/utils/timeFormatter'
import { PlayArrow } from '@mui/icons-material'
import {
  Avatar,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { Dispatch, SetStateAction, useState } from 'react'

interface TrackTableProps {
  album: Album
  setSelectedTrack: Dispatch<SetStateAction<TrackInfo | null>>
}
export default function TrackTable({ album, setSelectedTrack }: TrackTableProps) {
  const { tracks } = album
  const [selectedRow, setSelectedRow] = useState<number | null>(null)
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width='50px' sx={{ textAlign: 'center', paddingX: '0px', marginX: '0px' }}>
              #
            </TableCell>
            <TableCell>Title</TableCell>
            <TableCell sx={{ textAlign: 'right' }}>Streams</TableCell>
            <TableCell sx={{ textAlign: 'right' }}>Duration</TableCell>
            <TableCell width='50px' sx={{ textAlign: 'center', paddingX: '0px', marginX: '0px' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tracks
            .sort((item) => item.order)
            .map((item, index) => (
              <TableRow
                key={item.order}
                onMouseEnter={() => setSelectedRow(index + 1)}
                onMouseLeave={() => setSelectedRow(null)}
                sx={{
                  '&:hover': {
                    backgroundColor: '#e5dff2'
                  }
                }}
              >
                <TableCell width='50px' sx={{ textAlign: 'center', minWidth: '50px', paddingX: '0px', marginX: '0px' }}>
                  {selectedRow && selectedRow === index + 1 ? (
                    <IconButton size='small' onClick={() => setSelectedTrack(item.track)}>
                      <PlayArrow />
                    </IconButton>
                  ) : (
                    index + 1
                  )}
                </TableCell>
                <TableCell>
                  <Stack direction='row' sx={{ alignItems: 'center' }} spacing={2}>
                    <Avatar src={item.track.coverPath} variant='square' />
                    <Typography>{item.track.title}</Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>{item.track.totalStreams}</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>{TimeFormatter(item.track.duration)}</TableCell>
                <TableCell width='50px' sx={{ textAlign: 'center', minWidth: '50px', paddingX: '0px', marginX: '0px' }}>
                  {/* <IconButton size='small'>
                      <MoreHoriz />
                    </IconButton> */}
                  {selectedRow && selectedRow === index + 1 && <TrackPopover track={item.track} />}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
