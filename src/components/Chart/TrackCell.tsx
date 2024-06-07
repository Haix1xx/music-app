import { Avatar, Grid, Stack, Typography } from '@mui/material'

interface TrackCellProps {
  coverPath: string
  title: string
  artist: string
  _id: string
}
export default function TrackCell({ coverPath, title, artist, _id }: TrackCellProps) {
  return (
    <Stack direction='row' spacing={2}>
      <Grid>
        <Avatar src={coverPath} variant='square' sx={{ width: '100px', height: '100px' }} />
      </Grid>
      <Stack spacing={1} sx={{ justifyContent: 'center', alignSelf: 'center' }}>
        <Typography variant='h4'>{title}</Typography>
        <Typography variant='h5'>{artist}</Typography>
      </Stack>
    </Stack>
  )
}
