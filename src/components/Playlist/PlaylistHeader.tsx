import { Avatar, Container, Grid, Typography, Box, Stack } from '@mui/material'
import { FeaturedPlaylist } from '@/types/featuredPlaylist'

interface PlaylistHeaderProps {
  playlist: FeaturedPlaylist
}
export default function PlaylistHeader({ playlist }: PlaylistHeaderProps) {
  const { title, coverPath, tracks, updatedAt } = playlist
  return (
    <Box paddingBottom='30px'>
      <Grid container spacing={0}>
        <Grid item xs={12} md={3} sm={2}>
          <Avatar sx={{ width: '95%', height: '100%' }} src={coverPath} variant='square' />
        </Grid>
        <Grid item xs={12} md={9} sm={8} sx={{ position: 'relative' }}>
          <Container sx={{ position: 'absolute', bottom: '0' }}>
            <Typography>Featured Playlist</Typography>
            <Typography variant='h1'>{title}</Typography>
            <Stack direction='row' alignItems='center'>
              {/* <Avatar src={profile.avatar} sx={{ marginRight: '10px' }} /> */}
              <Typography variant='h5'>{`${tracks.length} tracks . Updated at ${new Date(
                updatedAt
              ).getFullYear()}`}</Typography>
            </Stack>
          </Container>
        </Grid>
      </Grid>
    </Box>
  )
}
