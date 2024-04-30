'use client'
import WidgetSummary from '@/components/Artist/WidgetSummary'
import { Button, Container, Grid, Modal, Stack, Typography, Box } from '@mui/material'
import audio from '@/assets/audio-extension/audio.png'
import Link from 'next/link'
import { useState } from 'react'
import useResponsive from '@/hooks/useResponsive'
import CreateAlbum from '@/components/Album/CreateAlbum'
export default function Page() {
  const isMobile = useResponsive('down', 'sm')
  const [open, setOpen] = useState<boolean>(false)
  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '80%' : '40%',
            height: isMobile ? '80%' : '83%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            padding: isMobile ? 3 : '20px'
          }}
        >
          <Stack>
            <Box>
              <CreateAlbum open={open} setOpen={setOpen} />
            </Box>
          </Stack>
        </Box>
      </Modal>
      <Container maxWidth='xl'>
        <Typography variant='h4' sx={{ mb: 5 }}>
          Hi, Welcome back 👋
        </Typography>
        <Stack direction='row' justifyContent='flex-end' alignItems='center' spacing={2} paddingBottom='10px'>
          <Link href='/artist/create-track'>
            <Button variant='outlined'>New Song</Button>
          </Link>
          <Button variant='contained' onClick={() => setOpen(true)}>
            New Album
          </Button>
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
    </>
  )
}
