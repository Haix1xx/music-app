'use client'
import UrlConfig from '@/config/urlConfig'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { TrackInfo } from '@/types/TrackInfo'
import {
  Box,
  FormGroup,
  Stack,
  TextField,
  Button,
  Typography,
  IconButton,
  Grid,
  Table,
  TableBody,
  CircularProgress,
  Divider
} from '@mui/material'
import { Dispatch, SetStateAction, useState } from 'react'
import TrackInfoBox from './TrackInfoBox'
import { Close } from '@mui/icons-material'
import useSnackbar from '@/context/snackbarContext'
import { FeaturedPlaylist, TrackOrder } from '@/types/featuredPlaylist'

interface AddTrackBoxProps {
  playlist: FeaturedPlaylist
  setOpen: Dispatch<SetStateAction<boolean>>
  setPlaylist: Dispatch<SetStateAction<FeaturedPlaylist | undefined>>
}
export default function AddTrackBox({ setOpen, setPlaylist, playlist }: AddTrackBoxProps) {
  const [searchText, setSearchText] = useState('')
  const { setSnack } = useSnackbar()
  const axios = useAxiosPrivate()
  const [searchTracks, setSearchTracks] = useState<TrackInfo[]>([])
  const [selectedTracks, setSelectedTracks] = useState<TrackInfo[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const handleSearch = async () => {
    if (searchText) {
      setIsSearching(true)
      try {
        const response = await axios.get(UrlConfig.common.search(searchText, 'track'))

        if (response.data.status === 'success') {
          setSearchTracks(response.data.data.tracks as TrackInfo[])
        }
      } catch (err) {
      } finally {
        setIsSearching(false)
      }
    } else {
      setSearchTracks([])
    }
  }

  const handleAddTrack = (track: TrackInfo) => {
    if (playlist.tracks.findIndex((item) => item.track._id === track._id) === -1) {
      const copyTracks = [...selectedTracks]
      if (copyTracks.findIndex((item) => item._id === track._id) === -1) {
        copyTracks.push(track)
        setSelectedTracks(copyTracks)
      } else {
        setSnack({
          open: true,
          type: 'warning',
          message: 'Track is already selected'
        })
      }
    } else {
      setSnack({
        open: true,
        type: 'warning',
        message: 'Track is already in this playplist'
      })
    }
  }

  const handleRemoveTrack = (track: TrackInfo) => {
    const copyTracks = [...selectedTracks]
    const index = copyTracks.findIndex((item) => item._id === track._id)
    if (index !== -1) {
      copyTracks.splice(index, 1)
      setSelectedTracks(copyTracks)
    } else {
      setSnack({
        open: true,
        type: 'warning',
        message: 'Track is already removed'
      })
    }
  }

  const handleAddTrackToPlaylist = () => {
    if (selectedTracks.length > 0) {
      setPlaylist((playlist) => {
        const copyPlaylist = { ...playlist } as FeaturedPlaylist
        if (playlist) {
          let { tracks } = playlist

          const trackOrderSelected = selectedTracks.map(
            (item, index) =>
              ({
                order: tracks.length + index,
                track: item
              }) as TrackOrder
          )

          copyPlaylist.tracks = [...tracks, ...trackOrderSelected]
        }
        return copyPlaylist
      })
    }
    setSnack({
      open: true,
      type: 'success',
      message: 'Add tracks to playlist successfully'
    })
    setOpen(false)
  }
  return (
    <>
      <Box sx={{ maxHeight: '80vh', overflowY: 'auto', p: 2, scrollbarWidth: 'none' }}>
        <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
          <Typography variant='h3'>Search Tracks To Add</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </Stack>
        <Divider sx={{ margin: '10px 0 40px 0' }} />
        <FormGroup>
          <Grid>
            <Stack direction='row' sx={{ justifyContent: 'space-between' }} spacing={2}>
              <TextField
                sx={{ width: '70%' }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder='Enter song title'
              />
              <Button variant='contained' onClick={handleSearch}>
                Search
              </Button>
            </Stack>
          </Grid>
        </FormGroup>

        <Stack spacing={4} paddingTop={5}>
          {isSearching ? (
            <CircularProgress sx={{ alignSelf: 'center' }} />
          ) : searchTracks.length > 0 ? (
            <Stack>
              <Typography variant='h4'>Search Result</Typography>
              <Table>
                <TableBody>
                  {searchTracks.map((track, index) => (
                    <TrackInfoBox key={track._id} track={track} handleSelectionChange={handleAddTrack} type={true} />
                  ))}
                </TableBody>
              </Table>
            </Stack>
          ) : (
            <Typography>No song matched</Typography>
          )}

          {selectedTracks.length > 0 && (
            <Stack>
              <Typography variant='h4'>Selected Tracks</Typography>
              <Table>
                <TableBody>
                  {selectedTracks.map((track, index) => (
                    <TrackInfoBox
                      key={track._id}
                      track={track}
                      handleSelectionChange={handleRemoveTrack}
                      type={false}
                    />
                  ))}
                </TableBody>
              </Table>
            </Stack>
          )}
        </Stack>

        {selectedTracks.length > 0 && (
          <Stack direction='row' sx={{ justifyContent: 'flex-end' }}>
            <Button disabled={selectedTracks.length === 0} variant='contained' onClick={handleAddTrackToPlaylist}>
              Apply
            </Button>
          </Stack>
        )}
      </Box>
    </>
  )
}
