'use client'

import {
  FormGroup,
  Stack,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  FormControlLabel,
  Checkbox,
  ToggleButton,
  Button,
  Typography
} from '@mui/material'
import { Edit, Delete, Favorite, FavoriteBorder } from '@mui/icons-material'
import { useState, ChangeEvent, useEffect } from 'react'
import { Register } from '@/types/register'
import ImageCropper from '@/components/common/ImageCropper'
import UrlConfig from '@/config/urlConfig'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

import { DatePicker, deDE, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

interface RegisterFormsProps {
  step: number
  formValues: Register
  formErrors: Register
  setFormValues: (formValues: Register) => void
  setCropper: any
  setFormErrors: (formErrors: Register) => void
}

const RegisterForms = ({
  step,
  formValues,
  setFormValues,
  setCropper,
  formErrors,
  setFormErrors
}: RegisterFormsProps) => {
  const [editMode, setEditMode] = useState(false)
  const [newAvatar, setNewAvatar] = useState('')
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

  // const [topics, setTopics] = useState<any>([])
  // const getTopics = async () => {
  //   try {
  //     let response = await axiosPrivate.get(`${UrlConfig.categories.getCategories}`)
  //     setTopics(
  //       response.data.data.data.map((topic: any) => {
  //         return { ...topic, isChecked: false }
  //       })
  //     )
  //   } catch (err) {}
  // }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       await getTopics()
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   fetchData()
  // }, [])

  const [selected, setSelected] = useState(false)

  // const handleCheckboxTick = (topic: any, index: number) => {
  //   var changedTopics = [...topics]
  //   changedTopics[index].isChecked = !changedTopics[index].isChecked
  //   setTopics(changedTopics)

  //   if (formValues.preferences.includes(topic._id)) {
  //     setFormValues({
  //       ...formValues,
  //       ['preferences']: formValues.preferences.filter((pref: string) => pref !== topic._id)
  //     })
  //   } else {
  //     setFormValues({ ...formValues, ['preferences']: [...formValues.preferences, topic._id] })
  //   }
  //   console.log(formValues.preferences)
  // }

  return (
    <form className='w-full'>
      <FormGroup sx={{ display: step === 0 ? '' : 'none' }}>
        <Stack spacing={3} className='w-full px-5'>
          <TextField
            error={!formErrors.email}
            id='email'
            name='email'
            label='Email'
            value={formValues.email}
            helperText={!formErrors.email && 'Please fill in your email'}
            onChange={handleTextFieldChange}
          />
          <TextField
            error={!formErrors.password}
            id='password'
            name='password'
            type='password'
            label='Password'
            value={formValues.password}
            helperText={!formErrors.password && 'Please fill in your password'}
            onChange={handleTextFieldChange}
          />
          <TextField
            error={!formErrors.passwordConfirm}
            id='password'
            name='passwordConfirm'
            type='password'
            label='Confirm Password'
            value={formValues.passwordConfirm}
            helperText={!formErrors.passwordConfirm && 'Please confirm your password'}
            onChange={handleTextFieldChange}
          />
        </Stack>
      </FormGroup>
      <FormGroup sx={{ display: step === 1 ? '' : 'none' }}>
        <Stack spacing={3} className='w-full px-5'>
          <Stack direction='row' spacing={3}>
            <TextField
              error={!formErrors.firstname}
              id='firstname'
              name='firstname'
              label='First Name'
              value={formValues.firstname}
              helperText={!formErrors.firstname && 'Please fill in your first name'}
              onChange={handleTextFieldChange}
            />
            <TextField
              error={!formErrors.lastname}
              id='lastname'
              name='lastname'
              label='Last Name'
              value={formValues.lastname}
              helperText={!formErrors.lastname && 'Please fill in your last name'}
              onChange={handleTextFieldChange}
            />
          </Stack>
          {formValues.displayname !== undefined && (
            <TextField
              error={!formErrors.displayname}
              id='displayname'
              name='displayname'
              label='Display name'
              value={formValues.displayname}
              helperText={!formErrors.displayname && 'Please fill in your display name'}
              onChange={handleTextFieldChange}
            />
          )}
          <LocalizationProvider
            localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}
            dateAdapter={AdapterDayjs}
          >
            <DatePicker
              label='Birthday'
              value={formValues.birthday}
              onChange={(e) => setFormValues({ ...formValues, birthday: e })}
            />
          </LocalizationProvider>
          <Stack direction='row' spacing={3}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>Gender</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={formValues.gender === true ? 1 : 0}
                label='Gender'
                onChange={(e) => setFormValues({ ...formValues, gender: e.target.value === 1 ? true : false })}
              >
                <MenuItem value={1}>Male</MenuItem>
                <MenuItem value={0}>Female</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {formValues.bio !== undefined && (
            <TextField
              error={!formErrors.bio}
              id='bio'
              name='bio'
              type='bio'
              label='Bio'
              value={formValues.bio}
              helperText={!formErrors.bio && 'Please fill in your bio'}
              onChange={handleTextFieldChange}
            />
          )}
        </Stack>
      </FormGroup>
      <FormGroup sx={{ display: step === 2 ? '' : 'none' }}>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
          {editMode ? (
            <ImageCropper cancelEdit={() => setEditMode(false)} avatarUrl={newAvatar} setCropper={setCropper} />
          ) : (
            // <input
            //   type="file"
            //   accept="image/png, image/jpeg, image/jpg"
            //   onChange={getNewAvatarUrl}
            //   className="mt-2 border border-solid border-black py-2 px-4 rounded cursor-pointer h-[300px] w-[300px] before:content-['Upload image']"
            // />
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
                <input
                  id='dropzone-file'
                  type='file'
                  accept='image/png, image/jpeg, image/jpg'
                  onChange={getNewAvatar}
                  className='hidden'
                />
                {/* <input id="dropzone-file" type="file" class="hidden" /> */}
              </label>
            </div>
          )}
          {editMode && (
            <Stack direction={'column'} sx={{ ml: 2 }} spacing={1}>
              {/* <IconButton><Edit /></IconButton> */}
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
      {/* <FormGroup sx={{ display: step === 3 ? '' : 'none' }}>
        <Box className='w-full px-5 text-center'>
          <Typography
            variant='h4'
            sx={{ fontSize: '14px', color: (theme) => theme.palette.secondary.main, marginBottom: '10px' }}
          >
            Choose at least 3 categories you'd prefer to see
          </Typography>
          {topics.map((topic: any, index: number) => (
            <Button
              key={index}
              sx={{ margin: '15px 0 0 15px', display: 'inline-block' }}
              variant={topic.isChecked ? 'contained' : 'outlined'}
              onClick={() => handleCheckboxTick(topic, index)}
            >
              {topic.name}
            </Button>
          ))}
        </Box>
      </FormGroup> */}
    </form>
  )
}

export default RegisterForms
