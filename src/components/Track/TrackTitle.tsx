import { Avatar, Container, Grid, Stack, Typography } from '@mui/material'

interface TrackTitle {
  title: string
  artists: string
  coverPath: string
}
export default function TrackTitle(props: TrackTitle) {
  const { title, artists, coverPath } = props
  return (
    <Stack direction='row' alignItems='center' spacing={2}>
      <Avatar sx={{ height: '100%' }} src={coverPath} variant='square' />
      <Stack>
        <Typography sx={{ fontWeight: 'bold' }}>{title}</Typography>
        <Typography>{artists}</Typography>
      </Stack>
    </Stack>
  )
}
