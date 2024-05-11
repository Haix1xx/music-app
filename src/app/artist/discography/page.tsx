'use client'
import { Box, Container, Stack, Typography } from '@mui/material'

import ProfileHeader from '@/components/Artist/ProfileHeader'
import { useEffect, useRef, useState } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import { useAuth } from '@/context/AuthContext'
import TrackBox from '@/components/Track/TrackBox'
import { User } from '@/types/user'
import { Single } from '@/types/single'
import { Album } from '@/types/album'
import { ArtistProfile } from '@/types/artist'

export default function Page() {
  // responsive
  const [visibleTracks, setVisibleTracks] = useState(5)
  const albumStackRef = useRef<HTMLDivElement>(null)
  const trackStackRef = useRef<HTMLDivElement>(null)
  const trackBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      if (trackStackRef.current && trackBoxRef.current) {
        const stackWidth = trackStackRef.current.offsetWidth
        // const trackBoxWidth = trackBoxRef.current.offsetWidth
        const element = trackBoxRef.current
        const computedStyle = window.getComputedStyle(element)
        const totalWidth =
          element.offsetWidth +
          parseFloat(computedStyle.paddingLeft) +
          parseFloat(computedStyle.paddingRight) +
          parseFloat(computedStyle.marginLeft) +
          parseFloat(computedStyle.marginRight)
        const maxVisibleTracks = Math.floor(stackWidth / totalWidth)
        setVisibleTracks(maxVisibleTracks > 0 ? maxVisibleTracks : 1)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const axios = useAxiosPrivate()

  const [latestSingles, setLastestSingles] = useState<Single[]>([])
  const [latestAlbums, setLatestAlbums] = useState<Album[]>([])
  const [user, setUser] = useState<User | null>()
  const auth = useAuth()
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const singlePromise = axios.get(UrlConfig.common.getSinglesByArtist(auth.user?._id))
        const albumPromise = axios.get(UrlConfig.common.getAlbumsByArtist(auth.user?._id))
        const [singleResponse, albumResponse] = await Promise.all([singlePromise, albumPromise])
        if (singleResponse.status === 200) {
          setLastestSingles(singleResponse.data.data.data)
        }

        if (albumResponse.status === 200) {
          setLatestAlbums(albumResponse.data.data.data)
        }
      } catch (err) {
        return
      }
    }
    if (auth.user) {
      fetchTracks()
    }
    setUser(auth.user)
  }, [auth])
  return (
    <>
      <title> Discography </title>
      <Container maxWidth='xl' sx={{ maxHeight: '100%', overflow: 'auto', paddingBottom: '60px' }}>
        <ProfileHeader avatar={user?.profile.avatar} artistName={`${user?.profile.displayname}`} />
        <Box sx={{ paddingBottom: '30px' }}>
          <Typography variant='h3'>Singles</Typography>
          <Stack spacing={3} direction='row' sx={{ flexWrap: 'wrap' }} ref={trackStackRef}>
            {latestSingles.slice(0, visibleTracks).map((single, index) => (
              <TrackBox
                cover={single.track.coverPath ?? ''}
                releaseDate={single.track.releaseDate ?? ''}
                title={single.track.title}
                key={single.track._id}
                type='Single'
                id={single.track._id}
                artist={single.artist.profile as ArtistProfile}
                ref={index === 0 ? trackBoxRef : null}
              />
            ))}
          </Stack>
        </Box>

        <Box sx={{ paddingBottom: '30px' }}>
          <Typography variant='h3'>Albums</Typography>
          <Stack spacing={3} direction='row'>
            {latestAlbums.slice(0, visibleTracks).map((album) => (
              <TrackBox
                cover={album.coverPath ?? ''}
                releaseDate={album.releaseDate ?? ''}
                title={album.title}
                key={album._id}
                id={album._id}
                artist={album.artist.profile as ArtistProfile}
                type='Album'
              />
            ))}
          </Stack>
        </Box>
      </Container>
    </>
  )
}
