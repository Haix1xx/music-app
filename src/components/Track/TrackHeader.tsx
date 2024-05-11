import { TrackInfo } from '@/types/TrackInfo'
import TimeFormatter from '@/utils/timeFormatter'
import { Avatar, Box, Grid, Container, Stack, Typography } from '@mui/material'

interface TrackHeaderProps {
  track: TrackInfo
}

export default function TrackHeader({ track }: TrackHeaderProps) {
  const { artist, coverPath, duration, title, releaseDate } = track
  const { profile } = artist
  return (
    <Box paddingBottom='30px'>
      <Grid container spacing={0}>
        <Grid item xs={12} md={3} sm={2}>
          <Avatar sx={{ width: '95%', height: '100%' }} variant='square' src={coverPath} />
        </Grid>
        <Grid item xs={12} md={9} sm={8} sx={{ position: 'relative' }}>
          <Container sx={{ position: 'absolute', bottom: '0' }}>
            <Typography>Track</Typography>
            <Typography variant='h1'>{title}</Typography>
            <Stack direction='row' alignItems='center'>
              <Avatar src={profile.avatar} sx={{ marginRight: '10px' }} />
              <Typography variant='h5'>{`${profile.firstname} ${profile.lastname} . ${new Date(
                releaseDate
              ).getFullYear()} . ${TimeFormatter(duration)}`}</Typography>
            </Stack>
          </Container>
        </Grid>
      </Grid>
    </Box>
  )
}
