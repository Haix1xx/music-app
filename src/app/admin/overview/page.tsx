/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { Grid, Paper, Typography, Box, Stack, styled, Button, Avatar, Card, Container } from '@mui/material'
import Image from 'next/image'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import track from '@/assets/icons/music-track.png'
import singer from '@/assets/icons/singer.png'
import stream from '@/assets/icons/streaming.png'
import user from '@/assets/icons/user.png'
// hooks

import React, { useEffect, useState } from 'react'
import withAuth from '@/authorization/withAuth'
import { TrackInfo } from '@/types/TrackInfo'
import WidgetSummary from '@/components/Artist/WidgetSummary'
import TopTrackTable from './table'

function page() {
  const [tracks, setTracks] = useState<TrackInfo[]>([])

  const axiosPrivate = useAxiosPrivate()
  const [data, setData] = useState<{
    userCount: number
    artistCount: number
    streamCount: number
    trackCount: number
  }>({
    userCount: 0, // 'account' property in the state
    artistCount: 0,
    streamCount: 0, // 'post' property in the state
    trackCount: 0
  })
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(UrlConfig.admin.overview)
        setData(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(UrlConfig.admin.topTracks)
        setTracks(response.data.data.data.map((item: { track: any }) => item.track) as TrackInfo[])
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <Container maxWidth='xl' sx={{ height: '100vh', overflowY: 'auto' }}>
        <Grid container spacing={2} xs={12} sx={{ paddingBottom: '150px' }}>
          <Stack sx={{ margin: '20px', width: '100%' }}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3}>
                <WidgetSummary title='Total Users' total={data.userCount} color='success' icon={user} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <WidgetSummary title='Total Artists' total={data.artistCount} color='success' icon={singer} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <WidgetSummary title='Total Streams' total={data.streamCount} color='success' icon={stream} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <WidgetSummary title='Total Tracks' total={data.trackCount} color='success' icon={track} />
              </Grid>
            </Grid>

            <Typography sx={{ paddingTop: '30px' }} variant='h2'>
              Recent Top Tracks{' '}
            </Typography>
            <TopTrackTable tracks={tracks} />
          </Stack>
        </Grid>
      </Container>
    </div>
  )
}

export default withAuth(page)(['admin'])
