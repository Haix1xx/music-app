/* eslint-disable no-console */
'use client'
import React, { useState, useEffect } from 'react'
import { Grid, Paper, Typography, Box, Stack, Card, TextField, InputAdornment, Skeleton } from '@mui/material'
import Image from 'next/image'
import CardUser from './UserCard'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import SearchIcon from '@mui/icons-material/Search'
// import FollowBanner from '@/assets/follower_banner.jpeg'
import NoFriendImg from '@/assets/no_friends.jpg'

function Friends({ userId }: { userId: string }) {
  const axiosPrivate = useAxiosPrivate()
  const [listFollowing, setFollowing] = useState([])
  const [listFollower, setFollower] = useState([])
  const [onFollowTab, setOnFollowTab] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(true)

  const getListFollowing = async (userId: any) => {
    try {
      let response
      if (userId === 'me') {
        response = await axiosPrivate.get(`${UrlConfig.me.getMyFollowingList}`)
      } else {
        const url = UrlConfig.otherUsers.getMyFollowingList.replace(':id', userId)
        response = await axiosPrivate.get(url)
      }
      setFollowing(response.data.data)
    } catch (err) {}
  }
  const getListFollower = async (userId: any) => {
    try {
      let response
      if (userId === 'me') {
        response = await axiosPrivate.get(`${UrlConfig.me.getMyFollowerList}`)
      } else {
        const url = UrlConfig.otherUsers.getMyFollowerList.replace(':id', userId)
        response = await axiosPrivate.get(url)
      }
      setFollower(response.data.data)
    } catch (err) {}
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getListFollower(userId)
        await getListFollowing(userId)
        setLoading(true)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [onFollowTab])
  const filteredData = onFollowTab
    ? listFollowing.filter(
        (user: any) =>
          user.following &&
          user.following.profile &&
          `${user.following.profile.firstname} ${user.following.profile.lastname}`
            .toLowerCase()
            .includes(searchValue.toLowerCase())
      )
    : listFollower.filter(
        (user: any) =>
          user.follower &&
          user.follower.profile &&
          `${user.follower.profile.firstname} ${user.follower.profile.lastname}`
            .toLowerCase()
            .includes(searchValue.toLowerCase())
      )
  return (
    <Stack>
      <Grid container spacing={2} margin={'0'}>
        <Grid
          item
          xs={6}
          style={{
            borderBottom: onFollowTab === true ? '2px solid #9747FF' : 'none',
            paddingBottom: '15px',
            borderTopLeftRadius: '10px'
          }}
        >
          <Typography
            variant='h4'
            sx={{
              textAlign: 'center',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: onFollowTab === true ? '#9747FF' : 'black',
              '&:hover': {
                color: '#9747FF',
                fontWeight: 'bold'
              }
            }}
            onClick={() => setOnFollowTab(true)}
          >
            Following
          </Typography>
        </Grid>
        <Grid
          item
          xs={6}
          style={{
            borderBottom: onFollowTab === false ? '2px solid #9747FF' : 'none',
            paddingBottom: '15px'
          }}
        >
          <Typography
            variant='h4'
            sx={{
              textAlign: 'center',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: onFollowTab === false ? '#9747FF' : 'black',
              '&:hover': {
                color: '#9747FF',
                fontWeight: 'bold'
              }
            }}
            onClick={() => setOnFollowTab(false)}
          >
            Follower
          </Typography>
        </Grid>
      </Grid>
      <Box>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            )
          }}
          id='outlined-basic'
          label='Search'
          variant='outlined'
          sx={{ width: '95%', margin: '20px 30px 5px 30px ' }}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {loading === false ? (
          filteredData.length > 0 ? (
            onFollowTab === true ? (
              filteredData.map((user: any, index) => (
                <CardUser
                  key={index}
                  userId={user.following._id}
                  profile={user.following.profile}
                  status={userId === 'me' ? true : user.status}
                  isVisible={true}
                />
              ))
            ) : (
              filteredData.map((user: any, index) => (
                <CardUser
                  key={index}
                  userId={user.follower._id}
                  profile={user.follower.profile}
                  status={user.status}
                  isVisible={true}
                />
              ))
            )
          ) : searchValue === '' ? (
            <Card className='flex flex-col justify-center items-center' sx={{ height: '95%', background: '#fdfdfd' }}>
              <Image src={NoFriendImg} alt='' height={430} />
              <Typography variant='h1'>Boohoo.</Typography>
              <Typography variant='h3'>
                {userId === 'me'
                  ? onFollowTab === true
                    ? `You don't follow any other users yet`
                    : `No one is following you yet `
                  : onFollowTab === false
                  ? `No one is following this account yet`
                  : `This account doesn't follow any other users yet`}
              </Typography>
              <Typography variant='h5' sx={{ marginBottom: '10px' }}>
                Beefriend others now by following people you know!
              </Typography>
            </Card>
          ) : (
            <Card className='flex flex-col justify-center items-center' sx={{ height: '95%', background: '#fdfdfd' }}>
              <Image src={NoFriendImg} alt='' height={400} />
              <Typography variant='h3'>No users were found matching the search information</Typography>
            </Card>
          )
        ) : (
          (() => {
            console.log('Rendering Skeletons...')
            return [...Array(5)].map((elementInArray, index) => (
              <Stack key={index} direction={'row'} alignItems={'center'} sx={{ margin: '15px 40px', padding: '10px' }}>
                <Skeleton variant='circular' width={60} height={60} />
                <Stack spacing={1} justifyContent={'center'} sx={{ marginLeft: '26px' }}>
                  <Skeleton variant='rounded' height={20} width={130} />
                  <Skeleton variant='rounded' height={15} width={50} />
                </Stack>
                <Skeleton
                  variant='rounded'
                  sx={{ marginLeft: '700px', borderRadius: '18px' }}
                  width={105}
                  height={40}
                />
              </Stack>
            ))
          })()
        )}
      </Box>
    </Stack>
  )
}
export default Friends
