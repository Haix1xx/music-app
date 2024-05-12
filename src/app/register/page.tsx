/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
// @mui
import { styled } from '@mui/material/styles'
import {
  Container,
  Typography,
  Stack,
  Button,
  Step,
  StepLabel,
  StepIcon,
  Box,
  Stepper,
  CircularProgress,
  IconButton
} from '@mui/material'
import { ArrowBack, LogoDev } from '@mui/icons-material'
import { LockPerson, PersonSearch, AddAPhoto, Check, Favorite } from '@mui/icons-material'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { StepIconProps } from '@mui/material/StepIcon'
import axios from 'axios'
import UrlConfig from '@/config/urlConfig'
import RegistrationComplete from './RegistrationSuccess'
import { GiTreeBeehive } from 'react-icons/gi'
import { GiBeehive } from 'react-icons/gi'

// hooks
import useResponsive from '@/hooks/useResponsive'
import { useEffect, useState } from 'react'

// auth
import { signIn, useSession } from 'next-auth/react'

// components
import Image from 'next/image'
import RegisterForms from './RegisterForms'

// assets
import Banner from '@/assets/login_banner.png'
import CustomSnackbar from '@/components/common/Snackbar'
import useSnackbar from '@/context/snackbarContext'
import { sassFalse } from 'sass'
import Link from 'next/link'
import logoMobile from '@/assets/logoMobile.png'
import { useRouter } from 'next/navigation'

//----------------------------------------------------------------

const BORDER_RADIUS = '16px'

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    width: '60%',
    height: '80%',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: theme.shadows[18],
    borderRadius: BORDER_RADIUS,
    background: theme.palette.background.paper
  },
  [theme.breakpoints.down('md')]: {
    height: '100vh'
  }
}))

const StyledBanner = styled('div')(({ theme }) => ({
  width: '0%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: '12px',
  borderTopLeftRadius: BORDER_RADIUS,
  borderBottomLeftRadius: BORDER_RADIUS
}))

const StyledForm = styled(Container)(({ theme }) => ({
  margin: 0,
  minWidth: '100%',
  width: 'auto',
  height: '100%',
  zIndex: 10,
  borderRadius: BORDER_RADIUS,
  display: 'flex',
  justifyContent: 'center'
}))

const StyledContent = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    width: '65%',
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(14, 0)
  },
  [theme.breakpoints.down('md')]: {
    width: '95%',
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    padding: theme.spacing(10, 0),
    alignItems: 'center',
    height: '100%'
  }
}))

//----------------------------------------------------------------

export default function Register() {
  const [isPersonal, setIsPersonal] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const mdUp = useResponsive('up', 'md')
  const router = useRouter()

  function _handleNext() {
    if (isPersonal) {
      router.push('/register/personal')
    } else {
      router.push('/register/artist')
    }
  }

  return (
    <>
      <title> Signup | Beegin </title>
      <StyledRoot>
        <StyledForm>
          <Link href='/login'>
            <IconButton sx={{ position: 'absolute', left: '35px', top: '25px' }}>
              <ArrowBack></ArrowBack>
            </IconButton>
          </Link>
          <Link href='/login'>
            <IconButton sx={{ position: 'absolute', left: '35px', top: '25px' }}>
              <ArrowBack></ArrowBack>
            </IconButton>
          </Link>
          <StyledContent>
            <Box>
              <Image src={logoMobile} alt='logo' width={38} style={{ margin: '0' }} />
              {/* <LogoDev fontSize='large' sx={{ color: (theme) => theme.palette.primary.main }}></LogoDev> */}
              <Typography variant='h4' gutterBottom className='mt-6 mb-3 text-2xl'>
                Choose your account type
              </Typography>
              <Typography variant='subtitle2' sx={{ fontSize: '13px' }}>
                Pick an account type based on your need. We offer a wealth experience regardless of the option you
                choose
              </Typography>
            </Box>

            <Box sx={{ marginY: '35px' }}>
              <Button
                variant={isPersonal ? 'contained' : 'outlined'}
                disabled={isPersonal}
                onClick={() => setIsPersonal(!isPersonal)}
                sx={{
                  width: '100%',
                  margin: '10px 0',
                  borderRadius: '12px',
                  '&:disabled': {
                    // border: '2px solid rgb(155 99 191 / 63%)', background: '#e7afe01f',
                    '& .MuiTypography-h5': {
                      color: (theme) => theme.palette.primary.contrastText
                    },
                    '& .MuiTypography-subtitle2': {
                      color: (theme) => theme.palette.primary.contrastText
                    }
                  }
                }}
              >
                <Stack direction={'row'} alignItems='center' justifyContent='start' sx={{ width: '100%' }}>
                  <Box
                    sx={{
                      fontSize: '28px',
                      background: (theme) => (isPersonal ? theme.palette.common.white : theme.palette.secondary.main),
                      color: (theme) => (isPersonal ? theme.palette.secondary.main : theme.palette.common.white),
                      padding: '10px 10px',
                      margin: '10px 5px',
                      borderRadius: '12px'
                    }}
                  >
                    <GiTreeBeehive />
                  </Box>
                  <Box sx={{ marginLeft: '15px', color: (theme) => theme.palette.primary.contrastText }}>
                    <Typography
                      variant='h5'
                      sx={{
                        textAlign: 'left',
                        lineHeight: 1.25,
                        marginBottom: '5px'
                      }}
                    >
                      Usual Profile
                    </Typography>
                    <Typography variant='subtitle2' sx={{ textTransform: 'initial' }}>
                      Start streaming all of the songs in the world!
                    </Typography>
                  </Box>
                </Stack>
              </Button>
              <Button
                variant={!isPersonal ? 'contained' : 'outlined'}
                disabled={!isPersonal}
                onClick={() => setIsPersonal(!isPersonal)}
                sx={{
                  width: '100%',
                  margin: '10px 0',
                  borderRadius: '12px',
                  '&:disabled': {
                    // border: '2px solid rgb(155 99 191 / 63%)', background: '#e7afe01f',
                    '& .MuiTypography-h5': {
                      color: (theme) => theme.palette.primary.contrastText
                    },
                    '& .MuiTypography-subtitle2': {
                      color: (theme) => theme.palette.primary.contrastText
                    }
                  }
                }}
              >
                <Stack direction={'row'} alignItems='center' justifyContent='start' sx={{ width: '100%' }}>
                  <Box
                    sx={{
                      fontSize: '28px',
                      background: (theme) => (!isPersonal ? theme.palette.common.white : theme.palette.secondary.main),
                      color: (theme) => (!isPersonal ? theme.palette.secondary.main : theme.palette.common.white),
                      padding: '10px 10px',
                      margin: '10px 5px',
                      borderRadius: '12px'
                    }}
                  >
                    <GiBeehive />
                  </Box>
                  <Box sx={{ marginLeft: '15px', color: (theme) => theme.palette.primary.contrastText }}>
                    <Typography variant='h5' sx={{ textAlign: 'left', lineHeight: 1.25, marginBottom: '5px' }}>
                      Artist Profile
                    </Typography>
                    <Typography variant='subtitle2' sx={{ textTransform: 'initial' }}>
                      Start promoting your own discography here!
                    </Typography>
                  </Box>
                </Stack>
              </Button>
            </Box>

            <Stack direction={'row'} justifyContent={'start'} className='w-full'>
              <Button variant='contained' sx={{ padding: '8px 25px' }} onClick={_handleNext}>
                Next Step
              </Button>
            </Stack>
          </StyledContent>
        </StyledForm>

        {/* {mdUp && (
          <StyledBanner>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                position: 'relative'
              }}
            >
              <Image style={{ objectFit: 'cover', borderRadius: BORDER_RADIUS }} fill src={Banner} alt='signup' />
            </Box>
          </StyledBanner>
        )} */}
      </StyledRoot>
    </>
  )
}
