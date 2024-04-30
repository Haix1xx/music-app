import React, { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import Image from 'next/image'
import Verified from '@/assets/Verify.png'
import useResponsive from '@/hooks/useResponsive'

const RegistrationComplete = () => {
  const isMobile = useResponsive('down', 'sm')
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    // Trigger the fade-in effect after a short delay (e.g., 100 milliseconds)
    const timer = setTimeout(() => {
      setFadeIn(true)
    }, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    opacity: fadeIn ? 1 : 0, // Apply the fade-in effect
    transition: 'opacity 1s ease-in-out' // Add a transition for opacity
  } as React.CSSProperties

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Image src={Verified} alt='success_img' width={700} height={200} />
      </div>
      <Typography
        variant='h1'
        style={{
          fontSize: isMobile ? '17px' : '30px',
          marginBottom: '15px',
          textAlign: 'center',
          padding: '0 5px'
        }}
      >
        Account Created Successfully! Please verify your email.
      </Typography>
    </div>
  )
}

export default RegistrationComplete
