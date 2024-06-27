import { Card, Container, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import Image from 'next/image'
import shazam from '@/assets/icons/shazam.png'
import { keyframes } from '@emotion/react'
import { styled } from '@mui/system'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import useSnackbar from '@/context/snackbarContext'
import { useRouter } from 'next/navigation'

// Define keyframes for the animation
const pulse = keyframes`
  0% { transform: translate(-50%, 25%) scale(1); }
  50% { transform: translate(-50%, 25%) scale(1.1); }
  100% { transform: translate(-50%, 25%) scale(1); }
`

// Create a styled component for the image
const AnimatedImage = styled(Image)`
  position: absolute;
  border-radius: 50%;
  max-width: '50%';
  left: 50%;
  top: 50%;
  transform: translate(-50%, 25%);
  object-fit: cover;
  animation: ${pulse} 2s infinite;
  cursor: pointer; /* Add cursor pointer to indicate it's clickable */
`

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const detectApi = 'https://allowing-square-werewolf.ngrok-free.app/api/v1/tracks/predict'

export default function TrackDetectBox() {
  const [audioFile, setAudioFile] = useState<File>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const { setSnack } = useSnackbar()
  const handleAudioFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      setAudioFile(file)
    }
  }

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleNavigate = (trackId: string) => {
    router.push(`/tracks/${trackId}?play=true`)
  }

  useEffect(() => {
    const detectTrack = async () => {
      try {
        if (audioFile) {
          const formData = new FormData()
          formData.append('audio', audioFile)
          setSnack({
            message: 'Detecting',
            open: true,
            type: 'info'
          })
          const response = await fetch(detectApi, {
            method: 'POST',
            body: formData
          })

          if (response.ok) {
            const data = await response.json()
            if (data.data) {
              const { trackId } = data.data
              if (trackId) {
                handleNavigate(trackId)
              } else {
                setSnack({
                  message: 'Track not found',
                  open: true,
                  type: 'warning'
                })
              }
            } else {
              setSnack({
                message: 'Track not found',
                open: true,
                type: 'warning'
              })
            }
          }
        }
      } catch (err) {
        console.log(err)
        setSnack({
          message: 'an error occurs while detecting',
          open: true,
          type: 'error'
        })
      }
    }

    detectTrack()
  }, [audioFile])

  return (
    <Container>
      <Stack spacing={3} sx={{ position: 'relative' }}>
        <Typography
          variant='h2'
          sx={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          Discovering the sound
        </Typography>
        <Typography variant='h4' sx={{ textAlign: 'center' }}>
          Uploading your sound and find the music here
        </Typography>
        <Container>
          <Box sx={{ width: '50%', alignSelf: 'center' }}>
            <AnimatedImage src={shazam} alt='S' onClick={handleImageClick} />
            <VisuallyHiddenInput type='file' onChange={handleAudioFileChange} ref={fileInputRef} />
          </Box>
        </Container>
      </Stack>
    </Container>
  )
}
