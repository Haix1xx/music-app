'use client'
import WidgetSummary from '@/components/Artist/WidgetSummary'
import { Button, Container, Grid, Modal, Stack, Typography, Box } from '@mui/material'
import audio from '@/assets/audio-extension/audio.png'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useResponsive from '@/hooks/useResponsive'
import CreateAlbum from '@/components/Album/CreateAlbum'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import trackIcon from '@/assets/icons/music-track.png'
import albumIcon from '@/assets/icons/album.png'
import streamIcon from '@/assets/icons/streaming.png'
import singleIcon from '@/assets/icons/single.png'
import { TrackInfo } from '@/types/TrackInfo'
import TopTrackTable from './table'

export default function Page() {
  const isMobile = useResponsive('down', 'sm')
  const [tracks, setTracks] = useState<TrackInfo[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [data, setData] = useState({
    trackCount: 0,
    albumCount: 0,
    streamCount: 0,
    singleCount: 0
  })

  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(UrlConfig.artist.topTracks())
        if (response.data.status === 'success') {
          setTracks(response.data.data.data as TrackInfo[])
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(UrlConfig.artist.overview)
        setData(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])
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
      <Container maxWidth='xl' sx={{ height: '100vh', overflowY: 'auto' }}>
        <Grid spacing={2} sx={{ paddingBottom: '150px' }}>
          <Typography variant='h4' sx={{ mb: 5 }}>
            Hi, Welcome back 👋
          </Typography>
          <Stack direction='row' justifyContent='flex-end' alignItems='center' spacing={2} paddingBottom='10px'>
            <Link href='/artist/create-track'>
              <Button variant='outlined'>New Single</Button>
            </Link>
            <Button variant='contained' onClick={() => setOpen(true)}>
              New Album
            </Button>
          </Stack>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <WidgetSummary title='Total Streams' total={data.streamCount} color='success' icon={streamIcon} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <WidgetSummary title='Total Singles' total={data.singleCount} color='success' icon={singleIcon} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <WidgetSummary title='Total Tracks' total={data.trackCount} color='success' icon={trackIcon} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <WidgetSummary title='Total Albums' total={data.albumCount} color='success' icon={albumIcon} />
            </Grid>
          </Grid>

          <Typography sx={{ paddingTop: '30px' }} variant='h2'>
            Recent Top Tracks{' '}
          </Typography>
          <TopTrackTable tracks={tracks} />
        </Grid>
      </Container>
    </>
  )
}
