'use client'
import { Container, Stack, Divider } from '@mui/material'

import ProfileHeader from '@/components/Artist/ProfileHeader'
import { useEffect, useState } from 'react'
import { Track } from '@/types/track'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import { useAuth } from '@/context/AuthContext'
import TrackBox from '@/components/Track/TrackBox'
import { TrackInfo } from '@/types/TrackInfo'
import { User } from '@/types/user'

export default function Page() {
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
    <Container>
      <ProfileHeader
        avatar={user?.profile.avatar}
        artistName={`${user?.profile.firstname} ${user?.profile.lastname}`}
      />

      <Stack spacing={3} direction='row'>
        {latestTracks.map((track) => (
          <TrackBox
            cover={track.coverPath ?? ''}
            releaseDate={track.releaseDate ?? ''}
            title={track.title}
            key={track._id}
            type='Single'
          />
        ))}
      </Stack>
    </Container>
  )
}
