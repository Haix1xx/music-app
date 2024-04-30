import React from 'react'
import { Box, Card, CardContent, Typography, TextField, Stack, styled, IconButton } from '@mui/material'
import Autocomplete from '@/components/common/AutoComplete/index'
import CollectionsIcon from '@mui/icons-material/Collections'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import urlConfig from '@/config/urlConfig'
import { AdvertisementFormProps } from './page'

const ImageContainerStyled = styled('div')<{ number: number }>((props) => ({
  display: props.number === 0 ? 'none' : 'grid',
  position: 'relative',
  gridGap: '5px',
  width: '100%',
  height: 'auto',
  padding: '10px',
  gridTemplateColumns: props.number === 1 ? 'minmax(100%,1fr)' : 'repeat(2, 1fr)',
  gridTemplateRows: props.number === 1 ? 'repeat(1,1fr)' : props.number === 2 ? 'repeat(1, 380px)' : 'repeat(2, 400px)',
  '& img': {
    borderRadius: '12px',
    objectFit: 'cover',
    width: '100%',
    height: '100%'
  },
  '& .image-1': {
    gridArea: '1 / 1 / 2 / 2',
    maxHeight: '600px'
  },
  '& .image-2': {
    gridArea: props.number === 3 ? '2 / 1 / 3 / 2' : '1 / 2 / 2 / 3'
  },
  '& .image-3': {
    gridArea: props.number === 4 ? '2 / 1 / 3 / 2' : '1 / 2 / 3 / 3'
  },
  '& .image-4': {
    gridArea: '2 / 2 / 3 / 3'
  },
  '@media only screen and (max-width: 600px)': {
    gridGap: '2px',
    gridTemplateRows:
      props.number === 1 ? 'repeat(1,1fr)' : props.number === 2 ? 'repeat(1,170px)' : 'repeat(2, 120px)',
    '& img': {
      borderRadius: '8px',
      objectFit: 'cover'
    }
  }
}))

interface AdvertisementPostProps {
  advertisementForm: AdvertisementFormProps
  setAdvertisementForm: React.Dispatch<React.SetStateAction<AdvertisementFormProps>>
}

const AdvertisementPost = ({ advertisementForm, setAdvertisementForm }: AdvertisementPostProps) => {
  const [categories, setCategories] = React.useState<any>([])
  const [selectedCategories, setSelectedCategories] = React.useState<any>([])
  const axiosPrivate = useAxiosPrivate()

  const handleImageChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0 && advertisementForm.images.length <= 4) {
      const newImages = [...advertisementForm.images]
      for (let i = 0; i < e.target.files.length; i++) {
        if (newImages.length === 4) break
        newImages.push(e.target.files[i])
      }
      setAdvertisementForm({ ...advertisementForm, images: newImages })
    }
  }
  const handleDeleteImages = () => {
    setAdvertisementForm({ ...advertisementForm, images: [] })
  }
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosPrivate.get(urlConfig.categories.getCategories)
        setCategories(response.data.data.data)
      } catch (error) {
        // Handle any errors that occur during the fetchComments() function
      }
    }
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    setAdvertisementForm({ ...advertisementForm, categories: selectedCategories })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories])

  return (
    <Card>
      <CardContent>
        <Typography variant='h6' sx={{ fontSize: '22px', marginBottom: '35px' }}>
          Create an advertisement
        </Typography>
        <Stack direction={'column'} gap={4}>
          <Autocomplete data={categories} selectedData={selectedCategories} setSelectedData={setSelectedCategories} />
          <Box>
            <Typography variant='h6' sx={{ marginBottom: '10px' }}>
              Add text (required)
            </Typography>
            <TextField
              fullWidth
              id='outlined-multiline-static'
              multiline
              rows={10}
              value={advertisementForm.content}
              placeholder="What's happening?"
              helperText='Your Ad needs to have text.'
              onChange={(e) => setAdvertisementForm({ ...advertisementForm, content: e.target.value })}
            />
          </Box>
          <Box>
            <Typography variant='h6' sx={{ marginBottom: '10px' }}>
              Media
            </Typography>
            <Box>
              <input
                accept='image/*'
                type='file'
                id='icon-file-bussiness'
                multiple
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor='icon-file-bussiness'>
                <IconButton component='span'>
                  <CollectionsIcon color='secondary' fontSize='large' />
                </IconButton>
              </label>
            </Box>
            <ImageContainerStyled number={advertisementForm.images ? advertisementForm.images.length : 0}>
              {advertisementForm.images?.map((item: any, index: number) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={`image-${index + 1}`}
                  src={URL.createObjectURL(item)}
                  key={index}
                  alt='image'
                  loading='lazy'
                />
              ))}
              <IconButton
                sx={{ position: 'absolute', top: '6%', right: '5%', backgroundColor: 'white !important' }}
                onClick={() => handleDeleteImages()}
              >
                <CloseRoundedIcon sx={{ color: 'black', fontSize: '25px' }} />
              </IconButton>
            </ImageContainerStyled>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default AdvertisementPost
