'use client'
import ProfileHeader from '@/components/Artist/ProfileHeader'
import MediaBox from '@/components/Track/MediaBox'
import TrackBox from '@/components/Track/TrackBox'
import UrlConfig from '@/config/urlConfig'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Album } from '@/types/album'
import { Artist, ArtistProfile } from '@/types/artist'
import { Single } from '@/types/single'
import { Box, Container, Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

export default function Page({ params }: { params: { id: string } }) {
  const [artist, setArtist] = useState<Artist>()
  const [latestSingles, setLastestSingles] = useState<Single[]>([])
  const [latestAlbums, setLatestAlbums] = useState<Album[]>([])
  const axios = useAxiosPrivate()
  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get(UrlConfig.common.artist(params.id))

        if (response.data.status === 'success') {
          setArtist(response.data.data.data as Artist)
        }
      } catch (err) {}
    }
    fetchArtist()
  }, [params])

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        if (artist) {
          const singlePromise = axios.get(UrlConfig.common.getSinglesByArtist(artist.user._id))
          const albumPromise = axios.get(UrlConfig.common.getAlbumsByArtist(artist.user._id))
          const [singleResponse, albumResponse] = await Promise.all([singlePromise, albumPromise])
          if (singleResponse.status === 200) {
            setLastestSingles(singleResponse.data.data.data)
          }

          if (albumResponse.status === 200) {
            setLatestAlbums(albumResponse.data.data.data)
          }
        }
      } catch (err) {
        return
      }
    }
    fetchTracks()
  }, [artist])

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

  return (
    <>
      <title> Artist </title>
      {artist && (
        <Container maxWidth='xl' sx={{ maxHeight: '100%', overflow: 'auto', paddingBottom: '60px' }}>
          <ProfileHeader avatar={artist?.avatar} artistName={artist.displayname} />
          <Box sx={{ paddingBottom: '30px' }}>
            <Typography variant='h3'>Singles</Typography>
            <Stack spacing={3} direction='row' sx={{ flexWrap: 'wrap' }} ref={trackStackRef}>
              {latestSingles.slice(0, visibleTracks).map((single, index) => (
                <MediaBox
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
                <MediaBox
                  cover={album.coverPath ?? ''}
                  releaseDate={album.releaseDate ?? ''}
                  title={album.title}
                  key={album._id}
                  id={album._id}
                  type='Album'
                  artist={album.artist.profile as ArtistProfile}
                />
              ))}
            </Stack>
          </Box>
        </Container>
      )}
    </>
  )
}
