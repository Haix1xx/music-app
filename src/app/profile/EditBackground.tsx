'use client'
import { useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import Image from 'next/image'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import CircularProgress from '@mui/material/CircularProgress'

interface FileInputProps {
  editBackground: (imageUrl: string) => void
}

const EditBackground = ({ editBackground }: FileInputProps) => {
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
        setLoading(false)
        setImageUrl(data.secure_url)
        // Pass the image URL to the parent component
        editBackground(data.secure_url)
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
      <input accept='image/*' type='file' id='select-image' style={{ display: 'none' }} onChange={handleFileChange} />
      <label htmlFor='select-image'>
        <Button
          variant='outlined'
          color='primary'
          component='span'
          style={{
            position: 'absolute',
            borderRadius: '50%',
            width: '40px',
            height: '55px',
            alignItems: 'center',
            margin: '20px 25px'
          }}
        >
          {loading ? (
            <CircularProgress
              size={30}
              sx={{
                color: 'white'
              }}
            />
          ) : (
            <AddAPhotoIcon fontSize='medium' />
          )}
        </Button>
      </label>
      {imageUrl && (
        <Box mt={2} textAlign='center'>
          <Image
            src={imageUrl}
            alt='Background'
            width={720}
            height={200}
            style={{ width: '100%', height: '200px', borderRadius: '10px', marginTop: '-16px', objectFit: 'cover' }}
          />
        </Box>
      )}
    </>
  )
}

export default EditBackground
