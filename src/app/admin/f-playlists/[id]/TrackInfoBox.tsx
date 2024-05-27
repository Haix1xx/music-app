import { TrackInfo } from '@/types/TrackInfo'
import TimeFormatter from '@/utils/timeFormatter'
import { PlaylistAdd, PlaylistRemove } from '@mui/icons-material'
import { Avatar, Stack, Typography, TableRow, TableCell, IconButton, Tooltip } from '@mui/material'

export interface SelectedTrack {
  track: TrackInfo
  type: boolean
  handleSelectionChange: (track: TrackInfo) => void
}
export default function TrackInfoBox({ track, type, handleSelectionChange }: SelectedTrack) {
  return (
    <TableRow>
      <TableCell>
        <Stack direction='row' spacing={2}>
          <Avatar src={track.coverPath} variant='square' />
          <Stack sx={{ justifyContent: 'center' }}>
            <Typography>{track.title}</Typography>
            <Typography>{track.artist.profile.displayname}</Typography>
          </Stack>
        </Stack>
      </TableCell>
      <TableCell>{TimeFormatter(track.duration)}</TableCell>
      <TableCell sx={{ minWidth: '40px', maxWidth: '40px' }}>
        <Tooltip title={type ? 'Add' : 'Remove'}>
          <IconButton onClick={() => handleSelectionChange(track)}>
            {type ? <PlaylistAdd /> : <PlaylistRemove />}
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}
