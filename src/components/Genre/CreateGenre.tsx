import UrlConfig from '@/config/urlConfig'
import useSnackbar from '@/context/snackbarContext'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Genre } from '@/types/genre'
import { Box, Button, FormGroup, Stack, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface CreateGenreProps {
  genre?: Genre
  open: boolean
  setOpen: (open: boolean) => void
  setReload: React.Dispatch<React.SetStateAction<boolean>>
}
export default function CreateGenre({ genre, open, setOpen, setReload }: CreateGenreProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(genre?.name ?? '')

  const { setSnack } = useSnackbar()
  const axios = useAxiosPrivate()
  const router = useRouter()
  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      let response
      if (genre) {
        response = await axios.patch(UrlConfig.common.genre(genre._id), { name })
      } else {
        response = await axios.post(UrlConfig.common.genres, { name })
      }

      if (response.data.status === 'success') {
        setSnack({
          open: true,
          type: 'success',
          message: genre ? 'Update successfully ' : 'Create new genre successfully'
        })
        setOpen(false)
        router.push('/admin/genres')
      }
    } catch (err) {
      setSnack({
        type: 'error',
        message: 'error',
        open: true
      })
    } finally {
      setIsLoading(false)
      setReload((value) => !value)
    }
  }

  return (
    <>
      <Box>
        <FormGroup sx={{ marginBottom: '40px' }}>
          <Stack spacing={3}>
            <Typography variant='h3'>{genre ? 'Update Genre' : 'Create New Genre'}</Typography>
            <TextField id='name' name='name' label='Name' value={name} onChange={(e) => setName(e.target.value)} />
          </Stack>
        </FormGroup>

        <Stack direction='row' justifyContent='space-between' sx={{ marginX: '100px' }}>
          <Button variant='outlined' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSubmit}>
            {genre ? 'Update' : 'Create'}
          </Button>
        </Stack>
      </Box>
    </>
  )
}
