/* eslint-disable @next/next/no-img-element */
'use client'
import { Dispatch, SetStateAction, useState } from 'react'
import { styled } from '@mui/material/styles'

import { Track } from '@/types/track'
import CreateTrackForm from './CreateTrackForm'
import { Container, Typography, Stack, Button, Step, StepLabel, Box, Stepper, CircularProgress } from '@mui/material'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { StepIconProps } from '@mui/material/StepIcon'
import { Check, Article, AudioFile, Photo } from '@mui/icons-material'

import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import useSnackbar from '@/context/snackbarContext'
import { useSearchParams, useRouter } from 'next/navigation'
import { Album, TrackOrder } from '@/types/album'
import { TrackInfo } from '@/types/TrackInfo'
import CustomSnackbar from '../common/Snackbar'

const BORDER_RADIUS = '16px'

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    width: '90%',
    height: '100%',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    // boxShadow: theme.shadows[18],
    borderRadius: BORDER_RADIUS
  },
  [theme.breakpoints.down('md')]: {
    height: '100vh'
  }
}))

const StyledBanner = styled('div')(({ theme }) => ({
  width: '42%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: '12px',
  borderTopLeftRadius: BORDER_RADIUS,
  borderBottomLeftRadius: BORDER_RADIUS
}))

const StyledForm = styled(Container)(({ theme }) => ({
  margin: 0,
  minWidth: '80%',
  width: '100%',
  height: '100%',
  zIndex: 10,
  borderRadius: BORDER_RADIUS,
  display: 'flex',
  justifyContent: 'center'
}))

const StyledContent = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    width: '100%',
    // maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    height: '100%',
    justifyContent: 'space-between',
    flexDirection: 'column',
    padding: theme.spacing(1, 0)
  },
  [theme.breakpoints.down('md')]: {
    width: '95%',
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    padding: theme.spacing(1, 0),
    alignItems: 'center',
    height: '100%'
  }
}))

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 95deg, #98f280 0%, #36c70e 50%, #60b04a 100%)'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 95deg, #98f280 0%, #36c70e 50%, #60b04a 100%)'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1
  }
}))

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean }
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: 'linear-gradient( 136deg, #98f280 0%, #36c70e 50%, #60b04a 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
  }),
  ...(ownerState.completed && {
    backgroundImage: 'linear-gradient( 136deg, #98f280 0%, #36c70e 50%, #60b04a 100%)'
  })
}))

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props

  const icons: { [index: string]: React.ReactElement } = {
    1: <Article />,
    2: <Photo />,
    3: <AudioFile />
  }

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {completed ? <Check className='QontoStepIcon-completedIcon' /> : icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}

const steps = ['Track Information', 'Art Cover', 'Audio File']

interface TrackFormProps {
  album?: Album
  setAlbum?: Dispatch<SetStateAction<Album | undefined>>
  handleClose?: () => void
}

const hashUrl = 'https://allowing-square-werewolf.ngrok-free.app/api/v1/tracks/create_hash'

export default function TrackForm({ album, setAlbum, handleClose }: TrackFormProps) {
  const axios = useAxiosPrivate()
  const [formValues, setFormValues] = useState<Track>({
    artist: '',
    coverPath: album ? album.coverPath : '',
    title: '',
    url: '',
    album: album?._id ?? '',
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
    releaseDate: album ? album.releaseDate : ''
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

  const searchParams = useSearchParams()
  const router = useRouter()
  const [success, setSuccess] = useState<boolean>(false)
  const { setSnack } = useSnackbar()
  const [activeStep, setActiveStep] = useState(0)
  const isLastStep = activeStep === steps.length - 1
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cropper, setCropper] = useState<any>(null)
  const returnUrl = decodeURIComponent(searchParams.get('returnUrl') ?? '/artist')

  const getCropData = async () => {
    if (cropper) {
      const file = await fetch(cropper.getCroppedCanvas().toDataURL())
        .then((res) => res.blob())
        .then((blob) => {
          return new File([blob], 'cover.png', { type: 'image/png' })
        })
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`)
        return await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.secure_url !== '') {
              const uploadedFileUrl = data.secure_url
              return uploadedFileUrl
            }
          })
          .catch((err) => console.error(err))
      }
    }
  }

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

  const handleSubmit = async () => {
    var artCover = ''
    if (!album) {
      artCover = await getCropData()
      if (!artCover) {
        setSnack({
          open: true,
          message: 'An error occured while uploading art cover',
          type: 'error'
        })
        return
      }
    } else {
      artCover = album.coverPath
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('track', new File([formValues.track.blob], formValues.track.name, { type: formValues.track.type }))
    formData.append('coverPath', artCover)
    formData.append('title', formValues.title.toString())
    formData.append('album', formValues?.album?.toString() ?? '')
    formData.append('releaseDate', formValues?.releaseDate?.toString() ?? '')
    formData.append('writtenBy', formValues.writtenBy?.toString() ?? '')
    formData.append('producedBy', formValues.producedBy?.toString() ?? '')
    formData.append('source', formValues.source?.toString() ?? '')
    formData.append('copyRight', formValues.copyRight?.toString() ?? '')
    formData.append('publishRight', formValues.publishRight?.toString() ?? '')
    formData.append('duration', formValues.duration?.toString() ?? '0')
    formData.append('genres', formValues.genres?.join(',') ?? '')
    try {
      const response = await axios.post(UrlConfig.artist.tracks, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response.data.status === 'success') {
        setSuccess(true)
        setSnack({
          open: true,
          message: 'Create new track successfully',
          type: 'success'
        })

        fetch(hashUrl, {
          method: 'POST',
          body: JSON.stringify(response.data.data.data.track as TrackInfo), // Convert the track object to a JSON string
          headers: {
            'Content-Type': 'application/json' // Set the content type to JSON
          }
        })
        if (album && handleClose && setAlbum) {
          let newAlbum = { ...album }
          let { tracks } = newAlbum
          const track = response.data.data.data.track as TrackInfo
          const trackOrder = {
            order: album.tracks.length,
            track: track
          } as TrackOrder
          tracks.push(trackOrder)
          newAlbum.tracks = tracks
          setAlbum(newAlbum)
          handleClose()
        } else {
          router.push(returnUrl)
        }
      } else {
        setSuccess(false)
        setSnack({
          open: true,
          message: 'an error occured while creating new track',
          type: 'error'
        })
      }
      setIsSubmitting(false)
    } catch (err) {
      setIsSubmitting(false)
      setSnack({
        open: true,
        message: 'an error occured while creating new single',
        type: 'error'
      })
    }
  }
  function _handleSubmit() {
    if (isLastStep) {
      // _submitForm(values, actions);
      // var avatar = ;
      handleSubmit()
    } else if (activeStep === 0) {
      const hasError = checkFormValues(['title', 'source', 'copyRight', 'publishRight', 'releaseDate'])
      if (!hasError) {
        if (album) {
          setActiveStep(activeStep + 2)
        } else {
          setActiveStep(activeStep + 1)
        }
      }
    } else if (activeStep === 1) {
      const hasError = checkFormValues([])
      if (!hasError) {
        setActiveStep(activeStep + 1)
      }
    } else {
      setActiveStep(activeStep + 1)
    }
  }

  function _handleBack() {
    if (album && activeStep == 2) {
      setActiveStep(activeStep - 2)
    } else {
      setActiveStep(activeStep - 1)
    }
  }
  return (
    <>
      {/* <CustomSnackbar /> */}
      <Container
        sx={{ position: 'relative', marginTop: '0px', paddingBottom: '20px', overflowY: 'auto', height: '80vh' }}
      >
        <StyledRoot>
          <StyledForm>
            <StyledContent>
              <Stack sx={{ marginBottom: '5px' }}>
                <Typography variant='h4' gutterBottom className='mt-6 mb-6'>
                  Create your brand new track
                </Typography>

                <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Stack>

              <CreateTrackForm
                step={activeStep}
                formErrors={formErrors}
                formValues={formValues}
                setFormErrors={setFormErrors}
                setFormValues={setFormValues}
                setCropper={setCropper}
                releaseDate={album?.releaseDate}
                coverPath={album?.coverPath}
              />
              <Stack direction={'row'} justifyContent={'space-between'} className='w-full' sx={{ paddingTop: '10px' }}>
                {activeStep !== 0 ? <Button onClick={_handleBack}>Back</Button> : <Box></Box>}
                <div>
                  <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    disabled={isSubmitting ? true : false}
                    onClick={_handleSubmit}
                    sx={{
                      background: isSubmitting
                        ? //@ts-ignore
                          (theme) => `${theme.palette.disabled}!important`
                        : (theme) => `${theme.palette.secondary.main}!important`
                    }}
                  >
                    {isLastStep ? (
                      isSubmitting ? (
                        <CircularProgress
                          size={15}
                          sx={{ color: (theme) => theme.palette.secondary.dark, margin: '5px 20px' }}
                        />
                      ) : (
                        'Upload track'
                      )
                    ) : (
                      'Next'
                    )}
                  </Button>
                </div>
              </Stack>
            </StyledContent>
          </StyledForm>
        </StyledRoot>
      </Container>
    </>
  )
}
