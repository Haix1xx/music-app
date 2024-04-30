/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
// @mui
import { styled } from '@mui/material/styles'
import {
    Link,
    Container,
    Typography,
    Stack,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Box,
    CircularProgress
} from '@mui/material'
import { LogoDev } from '@mui/icons-material'

// hooks
import useResponsive from '@/hooks/useResponsive'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import { useRouter } from 'next/navigation'

// auth
import Cookies from 'js-cookie' // Import js-cookie

// components
import Image from 'next/image'

// assets
import Banner from '@/assets/forgot_password_banner.jpg'
import { useAuth } from '@/context/AuthContext'
import urlConfig from '@/config/urlConfig'
import Snackbar from '@/components/common/Snackbar'
import useSnackbar from '@/context/snackbarContext'
import Loader from '@/components/common/Loader/Loader'
import { User } from '@/types/user'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import logoMobile from '@/assets/logoMobile.png'

//----------------------------------------------------------------

const BORDER_RADIUS = '16px'

const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
        width: '70%',
        height: '80%',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: theme.shadows[18],
        borderRadius: BORDER_RADIUS,
        background: theme.palette.background.paper,
    },
    [theme.breakpoints.down('md')]: {
        height: '100vh'
    }
}))

const StyledBanner = styled('div')(({ theme }) => ({
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '12px',
    borderTopRightRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS
}))

const StyledForm = styled(Container)(({ theme }) => ({
    margin: 0,
    minWidth: '50%',
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

export default function LoginPage() {
    const { setIsAuthenticated, setAccessToken, setUser } = useAuth()
    const pathname = usePathname()
    const isMobile = useResponsive('down', 'md')
    const router = useRouter()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)
    const [isResetting, setIsResetting] = useState(false)
    const { setSnack } = useSnackbar()
    const axiosPrivate = useAxiosPrivate();
    const mdUp = useResponsive('up', 'md')

    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 700)
    }, [])

    if (isLoading) {
        return <Loader />
    }

    const handleResetPw = async () => {
        setIsResetting(true)

        const result = await axiosPrivate.post(urlConfig.user.forgotPassword, {
            email: email,
        });

        if (result) {
            // redirect to '/'
            router.push('/login')
        } else {
            setIsResetting(false)
            setSnack({ open: true, type: 'error', message: 'Reset password successfully! Check your email to retrieve your new password.' })
        }
    }

    return (
        <>
            <Snackbar />
            <title> Forgot Password | Beegin </title>
            <StyledRoot>
                {mdUp && (
                    <StyledBanner>
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                position: 'relative'
                            }}
                        >
                            <Image
                                style={{ objectFit: 'cover', borderRadius: 12 }}
                                fill
                                src={Banner}
                                alt='login'
                            />
                        </Box>
                    </StyledBanner>
                )}

                <Container
                    maxWidth='sm'
                    sx={{
                        backgroundColor: '#fff',
                        margin: 0,
                        minWidth: '50%',
                        width: 'auto',
                        height: '100%',
                        zIndex: 10,
                        borderRadius: '12px',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <StyledContent>
                        <Image src={logoMobile} alt='logo' width={38} style={{ margin: '0' }} />
                        <Typography variant='h4' gutterBottom className='mt-8 mb-6'>
                            Reset your password
                        </Typography>
                        <Stack spacing={3} className='w-full'>
                            <TextField
                                name='email'
                                label='Email'
                                className='mt-6'
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                            />
                        </Stack>

                        <Button
                            size='large'
                            color='inherit'
                            variant='outlined'
                            disabled={isResetting ? true : false}
                            sx={{
                                background: isResetting
                                    ? //@ts-ignore
                                    (theme) => `${theme.palette.disabled}!important`
                                    : `linear-gradient(110deg, #f59df1 30%, #c474ed 60%, #c89df2 95%) !important`,
                                color: 'white !important',
                                width: '100%',
                                marginTop: '30px'
                            }}
                            onClick={() => {
                                handleResetPw()
                            }}
                        >
                            {isResetting ? (
                                <CircularProgress size={20} sx={{ color: (theme) => theme.palette.secondary.dark }} />
                            ) : (
                                'Reset Password'
                            )}
                        </Button>
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    )
}
//}
