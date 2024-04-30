import {
  FormGroup,
  Stack,
  TextField,
  Box,
  IconButton,
  Button,
  Typography,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent
} from '@mui/material'
import { DatePicker, deDE, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { Track } from '@/types/track'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import ImageCropper from '@/components/common/ImageCropper'
import { Delete, Mouse } from '@mui/icons-material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ClearIcon from '@mui/icons-material/Clear'
import { styled } from '@mui/material/styles'
import dayjs, { Dayjs } from 'dayjs'

import Image, { StaticImageData } from 'next/image'
import audio from '@/assets/audio-extension/audio.png'
import flac from '@/assets/audio-extension/flac.png'
import m4a from '@/assets/audio-extension/m4a.png'
import mp3 from '@/assets/audio-extension/mp3.png'
import mp4 from '@/assets/audio-extension/mp4.png'
import wav from '@/assets/audio-extension/wav.png'
import wma from '@/assets/audio-extension/wma.png'

import FormatByte from '@/utils/fileSizeConverter'
import TimeFormatter from '@/utils/timeFormatter'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'

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

const getFileExtension = (filename: string) => {
  const extensionIndex = filename.lastIndexOf('.')
  if (extensionIndex !== -1) {
    return filename.substring(extensionIndex + 1).toLocaleLowerCase()
  }

  return ''
}

const getLogo = (fileExtension: string) => {
  switch (fileExtension) {
    case 'flac':
      return flac
    case 'm4a':
      return m4a
    case 'mp3':
      return mp3
    case 'mp4':
      return mp4
    case 'wav':
      return wav
    case 'wma':
      return wma
    default:
      return audio
  }
}
interface CreateTrackFormProps {
  step: number
  formValues: Track
  formErrors: Track
  setFormValues: (formValues: Track) => void
  setFormErrors: (formErrors: Track) => void
  setCropper: any
  releaseDate?: string
  coverPath?: string
}

const CreateTrackForm = ({
  step,
  formValues,
  formErrors,
  setFormValues,
  setFormErrors,
  setCropper,
  releaseDate,
  coverPath
}: CreateTrackFormProps) => {
  const [editMode, setEditMode] = useState(false)
  const [newAvatar, setNewAvatar] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioLogo, setAudioLogo] = useState<StaticImageData>(audio)
  const [audioDuration, setAudioDuration] = useState<number>(0)
  const [genres, setGenres] = useState<any[]>([])
  const uploadRef = useRef<HTMLInputElement>()

  const axios = useAxiosPrivate()
  const [date, setDate] = useState<Dayjs | null>(() => {
    return dayjs(releaseDate)
  })

  useEffect(() => {
    const fetchGenres = async () => {
      const response = await axios.get(UrlConfig.common.genres)

      if (response.status === 200) {
        setGenres(response.data.data.data)
      }
    }

    fetchGenres()
  }, [])

  useEffect(() => {
    setFormValues({ ...formValues, releaseDate: date?.format('YYYY-MM-DD') })
  }, [date])

  const getNewAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEditMode(true)
      setNewAvatar(URL.createObjectURL(e.target.files[0]))
    }
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

  const handleAudioFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      var audio = new Audio(URL.createObjectURL(file))
      audio.onloadeddata = () => {
        setAudioDuration(audio.duration)
        setFormValues({
          ...formValues,
          track: {
            blob: file,
            name: file.name,
            type: file.type
          },
          duration: audio.duration
        })
      }
      setAudioFile(file)
      setAudioLogo(getLogo(getFileExtension(file.name ?? '')))
    }
  }
  const handleGenreChange = (e: SelectChangeEvent<typeof genres>) => {
    const {
      target: { value }
    } = e

    setFormValues({ ...formValues, genres: typeof value === 'string' ? value.split(',') : value })
  }

  return (
    <form className='w-full'>
      <FormGroup sx={{ display: step === 0 ? '' : 'none' }}>
        <Stack spacing={2}>
          <TextField
            error={!formErrors.title}
            id='title'
            name='title'
            label='Title'
            value={formValues.title}
            helperText={!formErrors.title && 'Please fill in your email'}
            variant='outlined'
            onChange={handleTextFieldChange}
          />
          <InputLabel id='demo-multiple-checkbox-label'>Genres</InputLabel>
          <Select
            labelId='demo-multiple-checkbox-label'
            id='genres'
            name='genres'
            label='Genres'
            multiple
            value={formValues.genres}
            onChange={handleGenreChange}
          >
            {genres.map((genre) => (
              <MenuItem key={genre._id} value={genre._id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Release date'
              value={date}
              format='MM/DD/YYYY'
              onChange={(e) => {
                console.log(e?.format('MM/DD/YYYY'))
                setDate(e)
              }}
            />
          </LocalizationProvider>

          <TextField
            error={!formErrors.writtenBy}
            id='writtenBy'
            name='writtenBy'
            label='Written By'
            value={formValues.writtenBy}
            helperText={!formErrors.writtenBy && `Please fill in track's composers`}
            variant='outlined'
            onChange={handleTextFieldChange}
          />

          <TextField
            error={!formErrors.producedBy}
            id='producedBy'
            name='producedBy'
            label='Produced By'
            value={formValues.producedBy}
            helperText={!formErrors.producedBy && `Please fill in track's producers`}
            variant='outlined'
            onChange={handleTextFieldChange}
          />

          <TextField
            error={!formErrors.source}
            id='source'
            name='source'
            label='Source'
            value={formValues.source}
            helperText={!formErrors.source && `Please fill in track's source`}
            variant='outlined'
            onChange={handleTextFieldChange}
          />

          <TextField
            error={!formErrors.copyRight}
            id='copyRight'
            name='copyRight'
            label='Copy Right'
            value={formValues.copyRight}
            helperText={!formErrors.copyRight && `Please fill in track's copy right`}
            variant='outlined'
            onChange={handleTextFieldChange}
          />

          <TextField
            error={!formErrors.publishRight}
            id='publishRight'
            name='publishRight'
            label='Publish Right'
            value={formValues.publishRight}
            helperText={!formErrors.publishRight && `Please fill in track's publish right`}
            variant='outlined'
            onChange={handleTextFieldChange}
          />
        </Stack>
      </FormGroup>

      <FormGroup sx={{ display: step === 1 ? '' : 'none' }}>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
          {editMode ? (
            <ImageCropper cancelEdit={() => setEditMode(false)} avatarUrl={newAvatar} setCropper={setCropper} />
          ) : (
            <div className='flex items-center justify-center w-full'>
              <label
                htmlFor='dropzone-file'
                className='flex flex-col items-center justify-center w-[300px] h-[300px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-white hover:bg-white dark:border-gray-200 dark:hover:border-gray-100 dark:hover:bg-gray-100'
              >
                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                  <svg
                    className='w-8 h-8 mb-4 text-violet-800 dark:text-violet-600'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 20 16'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                    />
                  </svg>
                  <p className='mb-2 text-sm text-violet-800 dark:text-violet-600'>
                    <span className='font-semibold'>Click to upload</span> or just skip for now
                  </p>
                  <p className='text-xs text-violet-800 dark:text-violet-600'>SVG, PNG, JPG or GIF</p>
                </div>
                <input id='dropzone-file' type='file' accept='image/*' onChange={getNewAvatar} className='hidden' />
              </label>
            </div>
          )}
          {editMode && (
            <Stack direction={'column'} sx={{ ml: 2 }} spacing={1}>
              <IconButton
                onClick={() => {
                  setEditMode(false)
                  setCropper(null)
                }}
              >
                <Delete />
              </IconButton>
            </Stack>
          )}
        </Stack>
      </FormGroup>

      <FormGroup sx={{ display: step === 2 ? '' : 'none' }}>
        <Button
          sx={{ width: '50%', alignSelf: 'center', marginBottom: '20px' }}
          component='label'
          role={undefined}
          variant='contained'
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput
            ref={uploadRef as React.RefObject<HTMLInputElement>}
            type='file'
            onChange={handleAudioFileChange}
            accept='audio/*'
          />
        </Button>

        {audioFile && (
          <Box
            sx={{
              width: '100%',
              height: 'auto',
              border: '1px solid grey',
              borderRadius: '5px'
            }}
          >
            <Grid sx={{ padding: '10px' }} justifyContent='space-between' container direction='row' alignItems='center'>
              <Grid item>
                <Image src={audioLogo} alt='logo' width={40} height={40} />
              </Grid>
              <Grid item>
                <Stack>
                  <Typography
                    color='black'
                    style={{
                      fontWeight: 'bold',
                      verticalAlign: 'middle',
                      fontSize: '19px'
                    }}
                  >
                    {audioFile?.name}
                  </Typography>

                  <Typography
                    color='black'
                    style={{
                      fontWeight: 'normal',
                      verticalAlign: 'middle',
                      fontSize: '15px'
                    }}
                  >
                    Size: {FormatByte(audioFile?.size ?? 0)}
                  </Typography>
                  <Typography
                    color='black'
                    style={{
                      fontWeight: 'normal',
                      verticalAlign: 'middle',
                      fontSize: '15px'
                    }}
                  >
                    Length: {TimeFormatter(audioDuration)}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item alignSelf='flex-end'>
                <IconButton
                  onClick={() => {
                    uploadRef.current?.form?.reset()
                    setAudioFile(null)
                  }}
                >
                  <ClearIcon
                    sx={{
                      height: '40px',
                      width: '40px',
                      padding: '5px',
                      borderRadius: '50%',
                      ':hover': {
                        backgroundColor: '#f76157'
                      }
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        )}
      </FormGroup>
    </form>
  )
}

export default CreateTrackForm
