import { Avatar, Container, Grid, Typography, Box, Stack } from '@mui/material'
import { Album } from '@/types/album'

interface ProfileHeaderProps {
  album: Album
}
export default function AlbumHeader({ album }: ProfileHeaderProps) {
  const { title, coverPath, releaseDate, tracks, duration, artist } = album
  const { profile } = artist
  console.log(artist, typeof artist)
  return (
    <Box paddingBottom='30px'>
      <Grid container spacing={0}>
        <Grid item xs={12} md={3} sm={2}>
          <Avatar sx={{ width: '95%', height: '100%' }} src={coverPath} variant='square' />
        </Grid>
        <Grid item xs={12} md={9} sm={8} sx={{ position: 'relative' }}>
          <Container sx={{ position: 'absolute', bottom: '0' }}>
            <Typography>Album</Typography>
            <Typography variant='h1'>{title}</Typography>
            <Stack direction='row' alignItems='center'>
              <Avatar src={profile.avatar} sx={{ marginRight: '10px' }} />
              <Typography variant='h5'>{`${profile.firstname} ${profile.lastname} . ${new Date(
                releaseDate
              ).getFullYear()} . ${tracks.length} tracks`}</Typography>
            </Stack>
          </Container>
        </Grid>
      </Grid>
    </Box>
  )
}
