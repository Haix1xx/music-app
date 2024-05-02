'use client'
import AlbumHeader from '@/components/Album/AlbumHeader'
import TrackForm from '@/components/Track/TrackForm'
import UrlConfig from '@/config/urlConfig'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useResponsive from '@/hooks/useResponsive'
import { Album } from '@/types/album'
import { Box, Button, Container, Modal, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import TrackTable from './TrackTable'

export default function Page({ params }: { params: { id: string } }) {
  const isMobile = useResponsive('down', 'sm')
  const [album, setAlbum] = useState<Album>()

  const [open, setOpen] = useState(false)

  const axios = useAxiosPrivate()
  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await axios.get(UrlConfig.common.albumAndTracks(params.id))
        if (response.data.status === 'success') {
          console.log(response.data.data.data, '------------')
          setAlbum(response.data.data.data)
        }
      } catch (err) {
        return
      }
    }

    fetchAlbum()
  }, [params])

  useEffect(() => {
    console.log('from parent', album)
  }, [album])
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
            height: isMobile ? '80%' : '90%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            padding: isMobile ? 3 : '20px'
          }}
        >
          <Container sx={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <TrackForm album={album} setAlbum={setAlbum} handleClose={() => setOpen(false)} />
          </Container>
        </Box>
      </Modal>
      <Container maxWidth='xl' sx={{ maxHeight: '100%', overflow: 'auto', paddingBottom: '60px' }}>
        {album && <AlbumHeader album={album} />}
        <Stack direction='row' alignItems='center' justifyContent='flex-end' spacing={2}>
          <Button variant='contained' onClick={() => setOpen(true)}>
            Create track
          </Button>
        </Stack>

        {album && <TrackTable album={album} setAlbum={setAlbum} />}
      </Container>
    </>
  )
}
