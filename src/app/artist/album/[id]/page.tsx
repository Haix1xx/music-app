'use client'
import AlbumHeader from '@/components/Album/AlbumHeader'
import TrackForm from '@/components/Track/TrackForm'
import UrlConfig from '@/config/urlConfig'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useResponsive from '@/hooks/useResponsive'
import { Album } from '@/types/album'
import { Box, Button, Container, Modal, Stack } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import TrackTable from './TrackTable'
import TrackBox from '@/components/Track/TrackBox'
import { TrackInfo } from '@/types/TrackInfo'
import TrackPlayer, { TrackPlayerRef } from '@/components/Track/TrackPlayer'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import PageNotFound from '@/components/404/PageNotFound'
import Loader from '@/components/common/Loader/Loader'

export default function Page({ params }: { params: { id: string } }) {
  const isMobile = useResponsive('down', 'sm')
  const [isLoading, setIsLoading] = useState(true)
  const [album, setAlbum] = useState<Album>()
  const [selectedTrack, setSelectedTrack] = useState<TrackInfo | null>(null)
  const [openTrackForm, setOpenTrackForm] = useState(false)
  const [openTrackPlayer, setOpenTrackPlayer] = useState(true)
  const trackPlayerRef = useRef<TrackPlayerRef>(null)
  const router = useRouter()
  const handlePause = () => {
    if (trackPlayerRef.current) {
      trackPlayerRef.current.pause()
    }
  }
  const { user } = useAuth()
  const axios = useAxiosPrivate()
  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await axios.get(UrlConfig.common.albumAndTracks(params.id))
        if (response.data.status === 'success') {
          const fetchedAlbum = response.data.data.data as Album

          // check if artist is owner of this album
          if (user?._id !== fetchedAlbum.artist._id) {
            router.push('/401')
          } else {
            setAlbum(response.data.data.data as Album)
          }
        }
      } catch (err) {
        return
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlbum()
  }, [params, user])

  useEffect(() => {
    setOpenTrackPlayer(selectedTrack !== null)
  }, [selectedTrack])
  return (
    <>
      <Modal open={openTrackForm} onClose={() => setOpenTrackForm(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '80%' : '40%',
            height: isMobile ? '80%' : '90%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            padding: isMobile ? 3 : '20px'
          }}
        >
          <Container sx={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <TrackForm album={album} setAlbum={setAlbum} handleClose={() => setOpenTrackForm(false)} />
          </Container>
        </Box>
      </Modal>
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
            height: isMobile ? '80%' : '90%',
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
      {isLoading ? (
        <Loader />
      ) : album ? (
        <Container maxWidth='xl' sx={{ maxHeight: '100%', overflow: 'auto', paddingBottom: '60px' }}>
          <AlbumHeader album={album} />
          <Stack direction='row' alignItems='center' justifyContent='flex-end' spacing={2}>
            <Button variant='contained' onClick={() => setOpenTrackForm(true)}>
              Create track
            </Button>
          </Stack>

          <TrackTable album={album} setAlbum={setAlbum} setSelectedTrack={setSelectedTrack} />
        </Container>
      ) : (
        <PageNotFound />
      )}
    </>
  )
}
