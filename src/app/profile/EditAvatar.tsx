/* eslint-disable prettier/prettier */
'use client'
import { useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import Image from 'next/image'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import CircularProgress from '@mui/material/CircularProgress'

interface FileInputProps {
  editAvatar: (imageUrl: string) => void
}

const EditAvatar = ({ editAvatar }: FileInputProps) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedImage) {
      uploadImageToCloudinary(selectedImage)
    }
  }, [selectedImage])

  const handleFileChange = (e: any) => {
    const file = e.target.files[0]
    setSelectedImage(file)
  }

  const uploadImageToCloudinary = async (imageFile: File) => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('upload_preset', `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      )
      if (response.ok) {
        const data = await response.json()
        setImageUrl(data.secure_url)
        setLoading(false)
        editAvatar(data.secure_url)
      } else {
        console.error('Failed to upload image to Cloudinary')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setLoading(false)
    }
  }
  return (
    <>
      <input accept='image/*' type='file' id='select-image-1' style={{ display: 'none' }} onChange={handleFileChange} />
      <label htmlFor='select-image-1'>
        <Button
          variant='outlined'
          // color={loading ? 'disabled' : 'primary'}
          color='primary'
          component='span'
          style={{
            justifyContent: 'center',
            borderRadius: '50%',
            width: '40px',
            height: '55px',
            alignItems: 'center',
            margin: '45px',
            objectFit: 'cover',
            // //@ts-ignore
            // backgroundColor: loading ? (theme) => `${theme.palette.disabled}!important` : '#E078D8 !important',
          }}
          disabled={loading}
        >
            {loading ? (
              <CircularProgress
                size={30}
                sx={{
                  color:'white'
                }}
              />
            ):(<AddAPhotoIcon fontSize='medium' />)}
        </Button>
      </label>
      {imageUrl && (
        <Box mt={2} textAlign='center'>
          <Image
            src={imageUrl}
            alt='Avatar'
            width={150}
            height={150}
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              margin: '-160px 0px',
              objectFit: 'cover'
            }}
          />
        </Box>
      )}
    </>
  )
}

export default EditAvatar
