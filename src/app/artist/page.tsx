import WidgetSummary from '@/components/Artist/WidgetSummary'
import { Button, Container, Grid, Stack, Typography } from '@mui/material'
import audio from '@/assets/audio-extension/audio.png'
import Link from 'next/link'
export default function Page() {
  return (
    <Container maxWidth='xl'>
      <Typography variant='h4' sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>
      <Stack direction='row' justifyContent='flex-end' alignItems='center' spacing={2} paddingBottom='10px'>
        <Link href='/artist/create-track'>
          <Button variant='outlined'>New Song</Button>
        </Link>
        <Link href='#'>
          <Button variant='contained'>New Album</Button>
        </Link>
      </Stack>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <WidgetSummary title='Monthy Listeners' total={2000000} color='success' icon={audio} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <WidgetSummary title='Monthy Streams' total={2000000} color='success' icon={audio} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <WidgetSummary title='Song' total={67} color='success' icon={audio} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <WidgetSummary title='Album' total={2} color='success' icon={audio} />
        </Grid>
      </Grid>
    </Container>
  )
}
