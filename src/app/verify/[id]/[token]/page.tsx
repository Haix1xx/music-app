'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Confirmed from '@/assets/Confirmed.png'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import useResponsive from '@/hooks/useResponsive'
export default function Page({ params }: { params: { id: string; token: string } }) {
  const isMobile = useResponsive('down', 'sm')
  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `${process.env.NEXT_APP_BEEGIN_DOMAIN}/api/v1/users/${params.id}/verify/${params.token}`
        const { data } = await axios.get(url)
      } catch (error) {}
    }
    verifyEmailUrl()
  }, [params])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Image src={Confirmed} alt='success_img' width={700} height={200}></Image>
      </div>
      <Typography variant='h1' style={{ fontSize: isMobile ? '20px' : '30px', marginBottom: '15px' }}>
        Email Verified Successfully!
      </Typography>

      <Link href='/login'>
        <Button variant='contained'>Login here</Button>
      </Link>
    </div>
  )
}
