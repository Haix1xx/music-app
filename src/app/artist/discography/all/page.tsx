'use client'

import TrackBox from '@/components/Track/TrackBox'
import UrlConfig from '@/config/urlConfig'
import { useAuth } from '@/context/AuthContext'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Album } from '@/types/album'
import { ArtistProfile } from '@/types/artist'
import { Single } from '@/types/single'
import { User } from '@/types/user'
import { Box, Container, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

export default function Page() {
  const axios = useAxiosPrivate()
  const [latestSingles, setLastestSingles] = useState<Single[]>([])
  const [latestAlbums, setLatestAlbums] = useState<Album[]>([])
  const [user, setUser] = useState<User | null>()
  const auth = useAuth()
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const singlePromise = axios.get(UrlConfig.common.getSinglesByArtist(auth.user?._id, 0))
        const albumPromise = axios.get(UrlConfig.common.getAlbumsByArtist(auth.user?._id, 0))
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
      <title>Discography</title>
      <Container maxWidth='xl' sx={{ maxHeight: '100%', overflow: 'auto', paddingBottom: '60px' }}>
        <Typography variant='h2'>{user?.profile.displayname ?? ''}</Typography>
        <Box sx={{ paddingBottom: '30px' }}>
          <Typography variant='h3'>Singles</Typography>
          <Stack direction='row' sx={{ flexWrap: 'wrap' }}>
            {latestSingles.map((single) => (
              <TrackBox
                cover={single.track.coverPath ?? ''}
                releaseDate={single.track.releaseDate ?? ''}
                title={single.track.title}
                key={single.track._id}
                type='Single'
                id={single.track._id}
                artist={single.artist.profile as ArtistProfile}
              />
            ))}
          </Stack>
        </Box>

        <Box sx={{ paddingBottom: '30px' }}>
          <Typography variant='h3'>Albums</Typography>
          <Stack direction='row' sx={{ flexWrap: 'wrap' }}>
            {latestAlbums.map((album) => (
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
