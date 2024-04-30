'use client'
import { Container, Stack } from '@mui/material'

import ProfileHeader from '@/components/Artist/ProfileHeader'
import { useEffect, useRef, useState } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import { useAuth } from '@/context/AuthContext'
import TrackBox from '@/components/Track/TrackBox'
import { TrackInfo } from '@/types/TrackInfo'
import { User } from '@/types/user'

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

  const [latestTracks, setLastestTracks] = useState<TrackInfo[]>([])
  const [latestAlbums, setLatestAlbums] = useState<any[]>([])
  const [user, setUser] = useState<User | null>()
  const auth = useAuth()
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const trackPromise = axios.get(UrlConfig.common.getTracksByArtist(auth.user?._id))
        const albumPromise = axios.get(UrlConfig.common.getAlbumsByArtist(auth.user?._id))
        const [trackResponse, albumResponse] = await Promise.all([trackPromise, albumPromise])
        if (trackResponse.status === 200) {
          setLastestTracks(trackResponse.data.data.data)
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
    <Container maxWidth='xl' sx={{ maxHeight: '100%', overflow: 'auto', paddingBottom: '60px' }}>
      <ProfileHeader
        avatar={user?.profile.avatar}
        artistName={`${user?.profile.firstname} ${user?.profile.lastname}`}
      />

      <Stack spacing={3} direction='row' sx={{ flexWrap: 'wrap' }} ref={trackStackRef}>
        {latestTracks.slice(0, visibleTracks).map((track, index) => (
          <TrackBox
            cover={track.coverPath ?? ''}
            releaseDate={track.releaseDate ?? ''}
            title={track.title}
            key={track._id}
            type='Single'
            id={track._id}
            ref={index === 0 ? trackBoxRef : null}
          />
        ))}
      </Stack>

      <Stack spacing={3} direction='row'>
        {latestAlbums.slice(0, visibleTracks).map((album) => (
          <TrackBox
            cover={album.coverPath ?? ''}
            releaseDate={album.releaseDate ?? ''}
            title={album.title}
            key={album._id}
            id={album._id}
            type='Album'
          />
        ))}
      </Stack>
    </Container>
  )
}
