'use client'
import UrlConfig from '@/config/urlConfig'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useResponsive from '@/hooks/useResponsive'
import { Album } from '@/types/album'
import { Box, Button, Container, Modal, Stack } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
// import TrackTable from './TrackTable'
import { TrackInfo } from '@/types/TrackInfo'
import TrackPlayer, { TrackPlayerRef } from '@/components/Track/TrackPlayer'
import { useAuth } from '@/context/AuthContext'
import { FeaturedPlaylist } from '@/types/featuredPlaylist'
import PlaylistHeader from '@/components/Playlist/PlaylistHeader'
import TrackTable from './TrackTable'
import AddTrackBox from './AddTrackBox'
import PageNotFound from '@/components/404/PageNotFound'
import Loader from '@/components/common/Loader/Loader'

export default function Page({ params }: { params: { id: string } }) {
  const isMobile = useResponsive('down', 'sm')
  const [isLoading, setIsLoading] = useState(true)
  const [playlist, setPlaylist] = useState<FeaturedPlaylist>()
  const [selectedTrack, setSelectedTrack] = useState<TrackInfo | null>(null)
  const [openAddBox, setOpenAddBox] = useState(false)
  const [openTrackPlayer, setOpenTrackPlayer] = useState(false)
  const trackPlayerRef = useRef<TrackPlayerRef>(null)
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
        const response = await axios.get(UrlConfig.common.fplaylist(params.id))
        if (response.data.status === 'success') {
          const fetchedPlaylist = response.data.data.data as FeaturedPlaylist

          // check if artist is owner of this album
          setPlaylist(fetchedPlaylist)
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
      <Modal open={openAddBox}>
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
            {playlist && <AddTrackBox setOpen={setOpenAddBox} setPlaylist={setPlaylist} playlist={playlist} />}
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
      ) : playlist ? (
        <Container maxWidth='xl' sx={{ maxHeight: '100%', overflow: 'auto', paddingBottom: '60px' }}>
          <PlaylistHeader playlist={playlist} />
          <Stack direction='row' alignItems='center' justifyContent='flex-end' spacing={2}>
            <Button variant='contained' onClick={() => setOpenAddBox(true)}>
              Add Track
            </Button>
          </Stack>
          <TrackTable playlist={playlist} setPlaylist={setPlaylist} setSelectedTrack={setSelectedTrack} />
        </Container>
      ) : (
        <PageNotFound />
      )}
    </>
  )
}
