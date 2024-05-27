'use client'
import PageNotFound from '@/components/404/PageNotFound'
import TrackHeader from '@/components/Track/TrackHeader'
import TrackPlayer, { TrackPlayerRef } from '@/components/Track/TrackPlayer'
import TrackPopover from '@/components/Track/TrackPopover'
import Loader from '@/components/common/Loader/Loader'
import UrlConfig from '@/config/urlConfig'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useResponsive from '@/hooks/useResponsive'
import { TrackInfo } from '@/types/TrackInfo'
import TimeFormatter from '@/utils/timeFormatter'
import { PlayArrow } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Container,
  IconButton,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function Page({ params }: { params: { id: string } }) {
  const isMobile = useResponsive('down', 'sm')
  const [isLoading, setIsLoading] = useState(true)
  const [track, setTrack] = useState<TrackInfo>()
  const [isHover, setIsHover] = useState(false)
  const [openTrackPlayer, setOpenTrackPlayer] = useState(false)
  const trackPlayerRef = useRef<TrackPlayerRef>(null)
  const axios = useAxiosPrivate()
  const router = useRouter()
  const handlePause = () => {
    if (trackPlayerRef.current) {
      trackPlayerRef.current.pause()
    }
  }
  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const response = await axios.get(UrlConfig.common.track(params.id))

        if (response.data.status === 'success') {
          setTrack(response.data.data.data as TrackInfo)
        }
      } catch (err) {
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrack()
  }, [])

  return (
    <>
      {track && (
        <Modal
          open={openTrackPlayer}
          onClose={() => {
            setOpenTrackPlayer(false)
            handlePause()
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
              {track && <TrackPlayer track={track} ref={trackPlayerRef} />}
            </Container>
          </Box>
        </Modal>
      )}
      {isLoading ? (
        <Loader />
      ) : track ? (
        <Container maxWidth='xl' sx={{ maxHeight: '100%', overflow: 'auto', paddingBottom: '60px' }}>
          <TrackHeader track={track} />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width='50px' sx={{ textAlign: 'center', paddingX: '0px', marginX: '0px' }}>
                    #
                  </TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>Streams</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>Duration</TableCell>
                  <TableCell width='50px' sx={{ textAlign: 'center', paddingX: '0px', marginX: '0px' }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
                  <TableCell
                    width='50px'
                    sx={{ textAlign: 'center', minWidth: '50px', paddingX: '0px', marginX: '0px' }}
                  >
                    {isHover ? (
                      <IconButton size='small' onClick={() => setOpenTrackPlayer(true)}>
                        <PlayArrow />
                      </IconButton>
                    ) : (
                      1
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack direction='row' sx={{ alignItems: 'center' }} spacing={2}>
                      <Avatar src={track.coverPath} variant='square' />
                      <Typography>{track.title}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>{track.totalStreams}</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>{TimeFormatter(track.duration)}</TableCell>
                  <TableCell
                    width='50px'
                    sx={{ textAlign: 'center', minWidth: '50px', paddingX: '0px', marginX: '0px' }}
                  >
                    {/* <IconButton size='small'>
                      <MoreHoriz />
                    </IconButton> */}
                    {isHover && <TrackPopover track={track} />}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      ) : (
        <PageNotFound />
      )}
    </>
  )
}
