/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import Image from 'next/image'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import IconButton from '@mui/material/IconButton'
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { Box, Stack } from '@mui/material'
import './ImageSlider.css'
import Video from 'next-video';

interface SliderProps {
  images: string[]
}

const Slider = ({ images }: SliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + images.length) % images.length)
  }

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % images.length)
  }

  return (
    <Box className='slider' sx={{ width: '100%', height: '100%', position: 'relative' }}>
      {images[currentSlide].split('/')[4] === 'video'  ? <Video src={images[currentSlide]} autoPlay={true} loop={true} accentColor='#E078D8' /> : <img
        src={images[currentSlide]}
        alt={`Image ${currentSlide}`}
        key={currentSlide}
        style={{
          objectFit: 'contain',
          height: '100%',
          width: '100%'
          // animation: 'slideInLeft 0.2s ease-in-out'
        }}
      />}
      {images.length > 1 && (
        <IconButton
          onClick={prevSlide}
          sx={{
            position: 'abosolute',
            top: '-50%',
            left: '20px',
            transform: 'translateY(-50%)',
            zIndex: 999,
            color: '#ffffff',
            backgroundColor: '#e1e1e199!important',
            '&:hover': {
              backgroundColor: '#7f7f7f85!important'
            }
          }}
        >
          <ArrowBackIosNewRoundedIcon fontSize='small' />
        </IconButton>
      )}
      {images.length > 1 && (
        <IconButton
          onClick={nextSlide}
          sx={{
            position: 'abosolute',
            top: '-50%',
            left: '87%',
            transform: 'translateY(-50%)',
            zIndex: 999,
            color: '#ffffff',
            backgroundColor: '#e1e1e199!important',
            '&:hover': {
              backgroundColor: '#7f7f7f85!important'
            }
          }}
        >
          <ArrowForwardIosIcon fontSize='small' />
        </IconButton>
      )}
      <Stack
        className='navigation-visibility'
        direction={'row'}
        sx={{
          position: 'absolute !important',
          top: '95% !important',
          left: '42% !important',
          transform: 'translateY(-50%)',
          zIndex: 999
        }}
      >
        {images.length > 1 &&
          images.map((_, index) =>
            index === currentSlide ? (
              <FiberManualRecordIcon
                key={index}
                sx={{ fontSize: '18px', color: '#ffffff', transition: 'color 0.7s ease-in-out' }}
              />
            ) : (
              <FiberManualRecordOutlinedIcon key={index} sx={{ fontSize: '18px', color: 'action.active' }} />
            )
          )}
      </Stack>
    </Box>
  )
}

export default Slider
