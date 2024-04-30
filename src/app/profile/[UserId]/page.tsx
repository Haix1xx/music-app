/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Stack,
  styled,
  Button,
  Avatar,
  Card,
  ToggleButtonGroup,
  ToggleButton,
  Skeleton
} from '@mui/material'
import Image from 'next/image'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import Friends from '../Friends'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import ButtonFollow from '../../../components/ButtonFollow/ButtonFollow'
import DefaultBackground from '@/assets/default_background.jpg'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import React from 'react'
import { usePosts } from '@/context/PostContext'

//icons
import { IoMdImages } from 'react-icons/io'
import { TbCell } from 'react-icons/tb'
import PostsProfile from '../PostsProfile'

const StyledProfile = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  color: '#FFFFFF',
  overflow: 'auto',
  position: 'relative'
}))

const Information = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '15px',
  backgroundColor: 'white',
  minWidth: '300px'
}))
const SkeletonBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: '15px',
  marginBottom: '30px',
  padding: '24px 48px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '300px',
  height: '410px'
}))

const Posts = styled(Card)(({ theme }) => ({
  height: '100%',
  minHeight: '730px',
  borderRadius: '15px',
  backgroundColor: 'white'
}))

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: '0 6px 12px -4px rgba(145, 158, 171, 0.1)',
  padding: '2px',
  // border: '1px solid #D9D9D9A5',
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius
    }
  }
}))

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  fontSize: '25px',
  padding: '10px 35px',
  color: theme.palette.grey[600],
  display: 'flex',
  flexDirection: 'column',
  '&:disabled': {
    color: theme.palette.secondary.dark,
    //@ts-ignore
    backgroundColor: theme.palette.secondary.lighter + 'aa'
  }
}))

function page() {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const userId = segments[2]
  const axiosPrivate = useAxiosPrivate()
  const [showPosts, setShowPosts] = useState(true)
  const { postsState, postsDispatch } = usePosts()
  const [data, setData] = useState<{
    firstname: string
    lastname: string
    avatar: string
    birthday: any
    background: string
    address: string
    bio: string
    gender: boolean
    slug: string
  }>({
    firstname: '',
    lastname: '',
    avatar: '',
    birthday: new Date(),
    background: '',
    address: '',
    bio: '',
    gender: true,
    slug: ''
  })
  const [number, setNumber] = useState<{ NumberOfFollowing: number; NumberOfFollower: number }>({
    NumberOfFollowing: 0,
    NumberOfFollower: 0
  })
  const handleDataFromChild = (data: string) => {
    if (data === 'follow') {
      setNumber({
        ...number,
        NumberOfFollower: number.NumberOfFollower + 1
      })
    } else {
      setNumber({
        ...number,
        NumberOfFollower: number.NumberOfFollower - 1
      })
    }
  }
  const getUsers = async (id: any) => {
    try {
      const url = UrlConfig.otherUsers.getProfileByID.replace(':id', id)
      const response = await axiosPrivate.get(url)
      setData(response.data.data)
    } catch (err) {}
  }
  const getNumberOfFollow = async (id: any) => {
    try {
      const url = UrlConfig.otherUsers.getMyNumberOfFollows.replace(':id', id)
      const response = await axiosPrivate.get(url)
      setNumber(response.data.data)
    } catch (err) {}
  }

  const fetchPosts = async (currentPage = 1) => {
    try {
      const response = await axiosPrivate.get(`${UrlConfig.posts.getPostByUserId(userId)}?limit=10&page=${currentPage}`)
      let rslt = response.data
      return rslt
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUsers(userId)
        await getNumberOfFollow(userId)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    postsDispatch({
      type: 'SET_PROFILE_POSTS',
      payload: {
        posts: [],
        totalPosts: undefined
      }
    })
  }, [])

  return (
    <StyledProfile id='postsProfile'>
      <title>Profile | Beegin</title>
      <Grid container spacing={2} sx={{ paddingX: '20px' }}>
        <Grid item xs={12} md={12} sx={{ paddingRight: '16px' }}>
          <Box>
            {data.background !== '' ? (
              <Image
                src={data.background ?? DefaultBackground}
                alt='Background'
                width={720}
                height={280}
                style={{ width: '100%', height: '280px', borderRadius: '10px', objectFit: 'cover' }}
                loading='lazy'
              />
            ) : (
              <Skeleton variant='rectangular' width='100%' height='280px' />
            )}
            <Box sx={{ position: 'absolute', right: '130px !important', top: '19% !important' }}>
              <ButtonFollow userId={userId} sendDataToParent={handleDataFromChild}></ButtonFollow>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} sx={{ transform: 'translateY(-80px)' }}>
          <Stack spacing={2} alignItems='center' sx={{ position: 'sticky', top: '80px' }}>
            <Box>
              {data.firstname != '' ? (
                <Information>
                  <Stack spacing={2} alignItems='center'>
                    <Paper style={{ backgroundColor: 'white' }}>
                      <Avatar src={data.avatar} sx={{ width: '150px', height: '150px', marginTop: '25px' }}></Avatar>
                    </Paper>
                    <Paper style={{ backgroundColor: 'white' }}>
                      <Typography variant='h4'>{data.firstname + ' ' + data.lastname}</Typography>
                    </Paper>
                    <Paper style={{ backgroundColor: 'white' }}>
                      <Typography variant='h6' sx={{ fontWeight: 'light', marginTop: '-13px', fontSize: '16px' }}>
                        {`@${data.slug}`}
                      </Typography>
                    </Paper>
                    <Paper style={{ backgroundColor: 'white' }}>
                      <Typography variant='h6' sx={{ fontWeight: 'light', marginTop: '0px', fontSize: '13px' }}>
                        <LocationOnIcon fontSize='medium' /> {data.address}
                      </Typography>
                    </Paper>
                    <Paper style={{ backgroundColor: 'white' }}>
                      <Typography
                        variant='h6'
                        sx={{
                          fontWeight: 'light',
                          textAlign: 'center',
                          fontSize: '15px',
                          fontFamily: 'Inter',
                          margin: '0 15px'
                        }}
                      >
                        {data.bio}
                      </Typography>
                    </Paper>
                    <Box style={{ backgroundColor: 'white', marginTop: '15px' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={4} paddingRight='16px'>
                          <Stack spacing={2}>
                            <Typography
                              variant='h4'
                              sx={{
                                fontWeight: 'light',
                                textAlign: 'center',
                                fontSize: '15px',
                                fontFamily: 'Inter'
                              }}
                            >
                              Posts
                            </Typography>
                            <Typography
                              variant='h4'
                              sx={{
                                fontWeight: 'medium',
                                textAlign: 'center',
                                fontSize: '15px',
                                fontFamily: 'Inter',
                                marginTop: '6px !important'
                              }}
                            >
                              {postsState.profile.totalPosts}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={4} paddingRight='16px'>
                          <Stack spacing={2} paddingBottom={2}>
                            <Typography
                              variant='h4'
                              sx={{
                                fontWeight: 'light',
                                textAlign: 'center',
                                fontSize: '15px',
                                fontFamily: 'Inter'
                              }}
                            >
                              Followers
                            </Typography>
                            <Typography
                              variant='h4'
                              sx={{
                                fontWeight: 'medium',
                                textAlign: 'center',
                                fontSize: '15px',
                                fontFamily: 'Inter',
                                marginTop: '6px !important'
                              }}
                            >
                              {number.NumberOfFollower}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={4} paddingRight='16px'>
                          <Stack spacing={2}>
                            <Typography
                              variant='h4'
                              sx={{
                                fontWeight: 'light',
                                textAlign: 'center',
                                fontSize: '15px',
                                fontFamily: 'Inter'
                              }}
                            >
                              Following
                            </Typography>
                            <Typography
                              variant='h4'
                              sx={{
                                fontWeight: 'medium',
                                textAlign: 'center',
                                fontSize: '15px',
                                fontFamily: 'Inter',
                                marginTop: '6px !important'
                              }}
                            >
                              {number.NumberOfFollowing}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                  </Stack>
                </Information>
              ) : (
                <SkeletonBox>
                  <Skeleton variant='circular' width={150} height={150} />
                  <Skeleton variant='text' width={120} height={20} />
                  <Skeleton variant='text' width={80} height={16} />
                  <Skeleton variant='text' width={150} height={16} />
                  <Skeleton variant='text' width={200} height={60} />
                  <Skeleton variant='rectangular' width={250} height={40} />
                </SkeletonBox>
              )}
            </Box>
            <Box>
              <StyledToggleButtonGroup
                size='large'
                value={showPosts}
                exclusive
                onChange={() => setShowPosts(!showPosts)}
                aria-label='text alignment'
              >
                <StyledToggleButton size='large' value={true} aria-label='left aligned' disabled={showPosts === true}>
                  <IoMdImages />
                  <Typography sx={{ fontSize: '13px', lineHeight: 1, mt: '4px' }}>Posts</Typography>
                </StyledToggleButton>
                <Paper sx={{ margin: '0 1.5px !important' }}></Paper>
                <StyledToggleButton size='large' value={false} aria-label='centered' disabled={showPosts === false}>
                  <TbCell />
                  <Typography sx={{ fontSize: '13px', lineHeight: 1, mt: '4px' }}>Socials</Typography>
                </StyledToggleButton>
              </StyledToggleButtonGroup>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} md={9} sx={{ paddingRight: '50px', transform: 'translateY(-80px)' }}>
          <Posts>
            {showPosts === true ? (
              <Box sx={{ marginLeft: '55px', marginTop: '25px', width: '74%' }}>
                {' '}
                <Typography
                  variant='h3'
                  sx={{
                    fontWeight: 'medium',
                    fontSize: '25px',
                    marginBottom: '25px !important'
                  }}
                >
                  Posts
                </Typography>
                <PostsProfile propFetchMoreData={fetchPosts}></PostsProfile>
              </Box>
            ) : (
              <Friends userId={userId}></Friends>
            )}
          </Posts>
        </Grid>
      </Grid>
    </StyledProfile>
  )
}

export default page
