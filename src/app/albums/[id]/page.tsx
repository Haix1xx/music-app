'use client'
import AlbumHeader from '@/components/Album/AlbumHeader'
import TrackForm from '@/components/Track/TrackForm'
import UrlConfig from '@/config/urlConfig'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useResponsive from '@/hooks/useResponsive'
import { Album } from '@/types/album'
import { Box, Button, Container, Modal, Stack } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import TrackBox from '@/components/Track/TrackBox'
import { TrackInfo } from '@/types/TrackInfo'
import TrackPlayer, { TrackPlayerRef } from '@/components/Track/TrackPlayer'
import TrackTable from './TrackTable'

export default function Page({ params }: { params: { id: string } }) {
  const isMobile = useResponsive('down', 'sm')
  const [album, setAlbum] = useState<Album>()
  const [selectedTrack, setSelectedTrack] = useState<TrackInfo | null>(null)
  const [openTrackPlayer, setOpenTrackPlayer] = useState(false)
  const trackPlayerRef = useRef<TrackPlayerRef>(null)
  const handlePause = () => {
    if (trackPlayerRef.current) {
      trackPlayerRef.current.pause()
    }
  }
  const axios = useAxiosPrivate()
  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await axios.get(UrlConfig.common.albumAndTracks(params.id))
        if (response.data.status === 'success') {
          setAlbum(response.data.data.data)
        }
      } catch (err) {
        return
      }
    }

    fetchAlbum()
  }, [params])

  useEffect(() => {
    setOpenTrackPlayer(selectedTrack !== null)
  }, [selectedTrack])
  return (
    <>
      <Modal
        open={openTrackPlayer}
        onClose={() => {
          setOpenTrackPlayer(false)
          handlePause()
          setSelectedTrack(null)
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '80%' : '40%',
            height: isMobile ? '70%' : '90%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            padding: isMobile ? 3 : '20px'
          }}
        >
          <Container sx={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            {selectedTrack && <TrackPlayer track={selectedTrack} ref={trackPlayerRef} />}
          </Container>
        </Box>
      </Modal>
      <Container maxWidth='xl' sx={{ maxHeight: '100%', overflow: 'auto', paddingBottom: '60px' }}>
        {album && <AlbumHeader album={album} />}
        <Stack direction='row' alignItems='center' justifyContent='flex-end' spacing={2}></Stack>
        {album && <TrackTable album={album} setSelectedTrack={setSelectedTrack} />}
      </Container>
    </>
  )
}
