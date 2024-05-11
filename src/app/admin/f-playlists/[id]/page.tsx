'use client'
import AlbumHeader from '@/components/Album/AlbumHeader'
import TrackForm from '@/components/Track/TrackForm'
import UrlConfig from '@/config/urlConfig'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useResponsive from '@/hooks/useResponsive'
import { Album } from '@/types/album'
import { Box, Button, Container, Modal, Stack } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
// import TrackTable from './TrackTable'
import TrackBox from '@/components/Track/TrackBox'
import { TrackInfo } from '@/types/TrackInfo'
import TrackPlayer, { TrackPlayerRef } from '@/components/Track/TrackPlayer'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { FeaturedPlaylist } from '@/types/featuredPlaylist'
import PlaylistHeader from '@/components/Playlist/PlaylistHeader'
import TrackTable from './TrackTable'
import AddTrackBox from './AddTrackBox'

export default function Page({ params }: { params: { id: string } }) {
  const isMobile = useResponsive('down', 'sm')
  const [playlist, setPlaylist] = useState<FeaturedPlaylist>()
  const [selectedTrack, setSelectedTrack] = useState<TrackInfo | null>(null)
  const [openAddBox, setOpenAddBox] = useState(false)
  const [openTrackPlayer, setOpenTrackPlayer] = useState(false)
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
        const response = await axios.get(UrlConfig.common.fplaylist(params.id))
        if (response.data.status === 'success') {
          const fetchedPlaylist = response.data.data.data as FeaturedPlaylist

          // check if artist is owner of this album
          setPlaylist(fetchedPlaylist)
        }
      } catch (err) {
        return
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
            <AddTrackBox setOpen={setOpenAddBox} setPlaylist={setPlaylist} />
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
      <Container maxWidth='xl' sx={{ maxHeight: '100%', overflow: 'auto', paddingBottom: '60px' }}>
        {playlist && <PlaylistHeader playlist={playlist} />}
        <Stack direction='row' alignItems='center' justifyContent='flex-end' spacing={2}>
          <Button variant='contained' onClick={() => setOpenAddBox(true)}>
            Add Track
          </Button>
        </Stack>

        {/* {album && <TrackTable album={album} setAlbum={setAlbum} setSelectedTrack={setSelectedTrack} />} */}
        {playlist && <TrackTable playlist={playlist} setPlaylist={setPlaylist} setSelectedTrack={setSelectedTrack} />}
      </Container>
    </>
  )
}
