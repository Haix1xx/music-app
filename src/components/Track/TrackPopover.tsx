import { MoreHoriz } from '@mui/icons-material'
import { Box, Container, Divider, IconButton, Modal, Popover, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { TrackInfo } from '@/types/TrackInfo'
import useResponsive from '@/hooks/useResponsive'
import { format } from '@/utils/formatDate'
import './TrackPopover.css'

interface TrackPopoverProps {
  track: TrackInfo
}
export default function TrackPopover({ track }: TrackPopoverProps) {
  const isMobile = useResponsive('down', 'sm')
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [openCredits, setOpenCredits] = useState(false)
  const router = useRouter()
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleNavigateToArtist = () => {
    let artistId = track.artist
    if (typeof artistId !== 'string') {
      artistId = track.artist._id
    }
    router.push(`/artist/${artistId}`)
  }
  return (
    <>
      <Modal
        open={openCredits}
        closeAfterTransition
        onClose={() => {
          setOpenCredits(false)
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '80%' : '35%',
            height: isMobile ? '60%' : '55%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            padding: isMobile ? 3 : '20px'
          }}
        >
          <Container sx={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <Stack spacing={2}>
              <Typography variant='h2'>Credits</Typography>
              <Divider />
              <Typography variant='h3'>{track.title}</Typography>

              <Stack>
                <Typography variant='h4' fontWeight='bold'>
                  Performed By
                </Typography>
                <Typography variant='h5'>{track.artist?.profile?.displayname}</Typography>
              </Stack>
              <Stack>
                <Typography variant='h4' fontWeight='bold'>
                  Written By
                </Typography>
                <Typography variant='h5'>{track.writtenBy ?? '-'}</Typography>
              </Stack>
              <Stack>
                <Typography variant='h4' fontWeight='bold'>
                  Produced By
                </Typography>
                <Typography variant='h5'>{track.producedBy ?? '-'}</Typography>
              </Stack>

              <Typography>{`Source: ${track.source ?? '-'}`}</Typography>
              <Stack>
                <Typography variant='h5'>{format(track.releaseDate)}</Typography>
                <Typography>{`℗ ${track.publishRight}`}</Typography>
                <Typography>{`© ${track.copyRight}`}</Typography>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Modal>
      <IconButton onClick={handleClick}>
        <MoreHoriz />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        className='popOverItem'
      >
        <Typography
          sx={{
            p: 2,
            '&:hover': {
              backgroundColor: '#e5dff2'
            }
          }}
          onClick={handleNavigateToArtist}
          className='popOverItem'
        >
          Go to artist
        </Typography>
        <Typography
          sx={{
            p: 2,
            '&:hover': {
              backgroundColor: '#e5dff2'
            }
          }}
          onClick={() => setOpenCredits(true)}
          className='popOverItem'
        >
          View credits
        </Typography>
      </Popover>
    </>
  )
}
