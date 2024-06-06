'use client'
import { Box, Button, FormGroup, IconButton, Stack, TextField, Typography } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { Delete } from '@mui/icons-material'
import ImageCropper from '../common/ImageCropper'
import useSnackbar from '@/context/snackbarContext'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import PostLoader from '@/components/common/Loader/PostLoader'
import Snackbar from '@/components/common/Snackbar'
import CustomSnackbar from '@/components/common/Snackbar'
interface CreateAlbumProps {
  open: boolean
  setOpen: (open: boolean) => void
}
export default function CreateAlbum({ open, setOpen }: CreateAlbumProps) {
  const [editMode, setEditMode] = useState(false)
  const [isLoad, setIsLoad] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [newAvatar, setNewAvatar] = useState('')

  const [title, setTitle] = useState('')
  const [coverPath, setCoverPath] = useState('')
  const [releaseDate, setReleaseDate] = useState<Dayjs | null>(dayjs())

  const { setSnack } = useSnackbar()

  const [cropper, setCropper] = useState<any>(null)

  const axios = useAxiosPrivate()
  const getNewAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEditMode(true)
      setNewAvatar(URL.createObjectURL(e.target.files[0]))
    }
  }
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

  const handleSubmit = async () => {
    try {
      setIsLoad(true)
      var artCover = ''
      if (!coverPath) {
        artCover = await getCropData()
        setCoverPath(artCover)
      }

      if (artCover || coverPath) {
        const response = await axios.post(UrlConfig.common.albums, {
          title: title,
          releaseDate: releaseDate?.toString(),
          coverPath: artCover ?? coverPath
        })

        if (response.data.status === 'success') {
          setSnack({
            open: true,
            message: 'Album created successfully!',
            type: 'success'
          })
          setIsSuccess(true)
          setOpen(false)
        }

        setIsLoad(false)
      } else {
        setSnack({
          open: true,
          message: 'An error occured while uploading art cover',
          type: 'error'
        })
      }
    } catch (err) {
      setSnack({
        open: true,
        message: 'an error occured while creating new album',
        type: 'error'
      })
    } finally {
      setIsLoad(false)
    }
  }
  return (
    <>
      {isLoad && <PostLoader />}
      <Box>
        <FormGroup sx={{ marginBottom: '40px' }}>
          <Stack spacing={3}>
            <Typography variant='h3'>Create your brand new album</Typography>
            <TextField
              id='title'
              name='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label="Album's Title"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Release date'
                value={releaseDate}
                format='MM/DD/YYYY'
                onChange={(e) => {
                  console.log(e?.format('MM/DD/YYYY'))
                  setReleaseDate(e)
                }}
              />
            </LocalizationProvider>

            <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
              {editMode ? (
                <ImageCropper cancelEdit={() => setEditMode(false)} avatarUrl={newAvatar} setCropper={setCropper} />
              ) : (
                <div className='flex items-center justify-center w-full'>
                  <label
                    htmlFor='dropzone-file'
                    className='flex flex-col items-center justify-center w-[400px] h-[400px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-white hover:bg-white dark:border-gray-200 dark:hover:border-gray-100 dark:hover:bg-gray-100'
                  >
                    <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                      <svg
                        className='w-8 h-8 mb-4 text-green-800 dark:text-green-600'
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
                      <p className='mb-2 text-sm text-black-800 dark:text-black-600'>
                        <span className='font-semibold'>Click to upload your albums art cover</span> or just skip for
                        now
                      </p>
                      <p className='text-xs text-black-800 dark:text-black-600'>SVG, PNG, JPG or GIF</p>
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
          </Stack>
        </FormGroup>
        <Stack direction='row' justifyContent='space-between' sx={{ marginX: '100px' }}>
          <Button variant='outlined' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSubmit}>
            Create
          </Button>
        </Stack>
      </Box>
    </>
  )
}
