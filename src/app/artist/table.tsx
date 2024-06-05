'use client'
import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { TrackInfo } from '@/types/TrackInfo'
import TrackTitle from '@/components/Track/TrackTitle'
import TimeFormatter from '@/utils/timeFormatter'
import { useRouter } from 'next/navigation'
import { alpha } from '@mui/material/styles'

interface TableProps {
  tracks: TrackInfo[]
}
export default function TopTrackTable({ tracks }: TableProps) {
  const router = useRouter()

  const handleNavigate = (trackId: string) => {
    router.push(`/tracks/${trackId}`)
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Track</TableCell>
            <TableCell align='right'>Streams</TableCell>
            <TableCell align='right'>Duration</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tracks.map((track, index) => (
            <TableRow
              key={track._id}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                ':hover': {
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
                }
              }}
              onDoubleClick={() => handleNavigate(track._id)}
            >
              <TableCell component='th' scope='row'>
                {index + 1}
              </TableCell>
              <TableCell>
                <TrackTitle
                  artists={track.artist.profile.displayname}
                  coverPath={track.coverPath}
                  title={track.title}
                />
              </TableCell>
              <TableCell align='right'>{track.totalStreams}</TableCell>
              <TableCell align='right'>{TimeFormatter(track.duration)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
