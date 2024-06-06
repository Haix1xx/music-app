'use client'
import TrackHeader from '@/components/Track/TrackHeader'
import TrackPlayer, { TrackPlayerRef } from '@/components/Track/TrackPlayer'
import Loader from '@/components/common/Loader/Loader'
import CustomSnackbar from '@/components/common/Snackbar'
import UrlConfig from '@/config/urlConfig'
import { useAuth } from '@/context/AuthContext'
import useSnackbar from '@/context/snackbarContext'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useResponsive from '@/hooks/useResponsive'
import { TrackInfo } from '@/types/TrackInfo'
import { Track } from '@/types/track'
import { Container, FormGroup, Grid, Stack, TextField, Typography, Button, Modal, Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

export default function Page({ params }: { params: { id: string } }) {
  const { setSnack } = useSnackbar()
  const isMobile = useResponsive('down', 'sm')
  const [isLoading, setIsLoading] = useState(true)
  const [track, setTrack] = useState<TrackInfo | null>(null)
  const [openTrackPlayer, setOpenTrackPlayer] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const trackPlayerRef = useRef<TrackPlayerRef>(null)
  const [formValues, setFormValues] = useState<Track>({
    artist: '',
    coverPath: '',
    title: '',
    url: '',
    album: '',
    collaborators: [],
    duration: 0,
    isPublic: false,
    totalStreams: 0,
    writtenBy: '',
    producedBy: '',
    source: '',
    copyRight: '',
    publishRight: '',
    genres: [],
    _id: '',
    releaseDate: ''
  })
  const [formErrors, setFormErrors] = useState<Track>({
    artist: true,
    coverPath: true,
    title: true,
    url: true,
    producedBy: true,
    writtenBy: true,
    source: true,
    copyRight: true,
    publishRight: true,
    _id: ''
  })
  const axios = useAxiosPrivate()

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const response = await axios.get(UrlConfig.common.getTrack(params.id))
        if (response.data.status === 'success') {
          const fecthedTrack = response.data.data.data as TrackInfo
          if (user?._id !== fecthedTrack.artist._id && !isLoading) {
            router.push('/401')
          } else {
            setTrack(fecthedTrack)
          }
        }
      } catch (err) {
        setSnack({
          type: 'error',
          message: 'An error occurs while fetching track',
          open: true
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchTrack()
  }, [params])

  useEffect(() => {
    setFormValues({
      artist: track?.artist,
      coverPath: track?.coverPath ?? '',
      title: track?.title ?? '',
      url: track?.url ?? '',
      album: track?.album ?? '',
      collaborators: track?.collaborators,
      duration: track?.duration ?? 0,
      isPublic: track?.isPublic ?? false,
      totalStreams: track?.totalStreams,
      writtenBy: track?.writtenBy ?? '',
      producedBy: track?.producedBy ?? '',
      source: track?.source ?? '',
      copyRight: track?.copyRight ?? '',
      publishRight: track?.publishRight ?? '',
      genres: track?.genres,
      _id: track?._id ?? '',
      releaseDate: track?.releaseDate ?? ''
    })
  }, [track])

  const checkFormValues = (fields: (keyof Track)[]) => {
    let values = { ...formValues }
    let errors = { ...formErrors }
    let hasError = false
    fields.forEach((field) => {
      if (values[field] === '') {
        errors[field] = false
        hasError = true
      } else {
        errors[field] = true
      }
    })
    setFormErrors(errors)
    return hasError
  }

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormValues({
      ...formValues,
      [name]: value
    })
    setFormErrors({
      ...formErrors,
      [name]: value.length > 0 ? true : false
    })
  }

  const handleSaveChanges = async () => {
    if (!checkFormValues(['title', 'writtenBy', 'producedBy', 'source', 'copyRight', 'publishRight'])) {
      try {
        const response = await axios.patch(UrlConfig.common.getTrack(params.id), formValues)

        if (response.data.status === 'success') {
          setTrack(response.data.data.data as TrackInfo)
          setSnack({
            type: 'success',
            message: 'Update track successfully',
            open: true
          })
        }
      } catch (err) {
        console.log(err)
        setSnack({
          type: 'error',
          message: 'An error occurs',
          open: true
        })
      }
    }
  }
  const handlePause = () => {
    if (trackPlayerRef.current) {
      trackPlayerRef.current.pause()
    }
  }
  return (
    <>
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
            height: isMobile ? '80%' : '90%',
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
      {isLoading ? (
        <Loader />
      ) : (
        <Container maxWidth='xl' sx={{ maxHeight: '100%', overflow: 'auto', paddingBottom: '60px' }}>
          {track && <TrackHeader track={track} />}

          <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
            <Typography variant='h3'>Track Information</Typography>
            <Stack direction='row' spacing={2}>
              <Button variant='outlined' onClick={() => setOpenTrackPlayer(true)}>
                Preview
              </Button>
              <Button onClick={() => handleSaveChanges()} variant='contained'>
                Save changes
              </Button>
            </Stack>
          </Stack>
          <FormGroup sx={{ marginY: '20px' }}>
            <Grid container spacing={6}>
              <Grid item xs={6} md={6} sm={12}>
                <Stack spacing={2}>
                  <TextField
                    id='title'
                    name='title'
                    label='Title'
                    value={formValues.title}
                    variant='outlined'
                    helperText={!formErrors.title && 'Please fill in your track title'}
                    onChange={handleTextFieldChange}
                  />
                  <TextField id='duration' name='duration' label='Duration' value={formValues.duration} disabled />
                  <TextField id='url' name='url' label='url' value={formValues.url} disabled />
                </Stack>
              </Grid>
              <Grid item xs={6} md={6} sm={12}>
                <Stack spacing={2}>
                  <TextField
                    id='writtenBy'
                    name='writtenBy'
                    label='Written By'
                    value={formValues.writtenBy}
                    variant='outlined'
                    helperText={!formErrors.writtenBy && 'Please fill in your track title'}
                    onChange={handleTextFieldChange}
                  />
                  <TextField
                    id='producedBy'
                    name='producedBy'
                    label='Produced By'
                    value={formValues.producedBy}
                    variant='outlined'
                    helperText={!formErrors.producedBy && 'Please fill in your track title'}
                    onChange={handleTextFieldChange}
                  />
                  <TextField
                    id='source'
                    name='source'
                    label='Source'
                    value={formValues.source}
                    variant='outlined'
                    helperText={!formErrors.source && 'Please fill in your track title'}
                    onChange={handleTextFieldChange}
                  />

                  <TextField
                    id='copyRight'
                    name='copyRight'
                    label='Copy Right'
                    value={formValues.copyRight}
                    variant='outlined'
                    helperText={!formErrors.copyRight && 'Please fill in your track title'}
                    onChange={handleTextFieldChange}
                  />
                  <TextField
                    id='publishRight'
                    name='publishRight'
                    label='Publish Right'
                    value={formValues.publishRight}
                    variant='outlined'
                    helperText={!formErrors.publishRight && 'Please fill in your track title'}
                    onChange={handleTextFieldChange}
                  />
                </Stack>
              </Grid>
            </Grid>
          </FormGroup>
        </Container>
      )}
    </>
  )
}
