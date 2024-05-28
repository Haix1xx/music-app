import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chart from '@/types/chart'
import TrackCell from './TrackCell'
import StatusLabel from './StatusLabel'
import { Stack, Typography } from '@mui/material'

interface ChartTableProps {
  chart: Chart
}

export default function ChartTable({ chart }: ChartTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell align='left'>Track</TableCell>
            <TableCell align='center'>Peak</TableCell>
            <TableCell align='center'>Previous</TableCell>
            <TableCell align='center'>Stream</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chart.tracks.map((trackChart) => (
            <TableRow key={trackChart.track._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component='th' scope='row'>
                <Stack direction='row' spacing={2}>
                  <Typography>{trackChart.order + 1}</Typography>
                  <StatusLabel curr={trackChart.order} prev={trackChart.prevPosition} peak={trackChart.peak} />
                </Stack>
              </TableCell>
              <TableCell align='left'>
                <TrackCell
                  _id={trackChart.track._id}
                  coverPath={trackChart.track.coverPath}
                  artist={trackChart.track.artist.profile.displayname}
                  title={trackChart.track.title}
                />
              </TableCell>
              <TableCell align='center'>{trackChart.peak === -1 ? '-' : trackChart.peak + 1}</TableCell>
              <TableCell align='center'>{trackChart.prevPosition === -1 ? '-' : trackChart.prevPosition + 1}</TableCell>
              <TableCell align='center'>{trackChart.totalStreams}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
