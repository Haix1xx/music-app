import { Replay10, Pause, Forward10, PlayArrow } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Container,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
  duration
} from '@mui/material'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { TrackInfo } from '@/types/TrackInfo'
import TimeFormatter from '@/utils/timeFormatter'
import './TrackPlayer.css'

interface TrackPlayerProps {
  track: TrackInfo
}

export interface TrackPlayerRef {
  rewind: () => void
  pause: () => void
  play: () => void
  forward: () => void
}

const TrackPlayer = forwardRef<TrackPlayerRef, TrackPlayerProps>(({ track }: TrackPlayerProps, ref) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef(new Audio(track.url))

  useEffect(() => {
    const audio = audioRef.current

    audio.addEventListener('timeupdate', updateTime)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
    }
  }, [])

  const updateTime = () => {
    if (audioRef.current.currentTime >= track.duration) {
      setIsPlaying(false)
    }
    setCurrentTime(audioRef.current.currentTime)
  }
  const handlePlayAndPauseAudio = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying((state) => !state)
  }

  const handleRewind = () => {
    audioRef.current.currentTime -= 10
  }

  const handleForward = () => {
    audioRef.current.currentTime += 10
  }

  useImperativeHandle(ref, () => ({
    forward: handleForward,
    rewind: handleRewind,
    pause: () => {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    },
    play: () => {
      if (!isPlaying) {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }))
  return (
    <Container>
      <Stack spacing={3}>
        <Typography variant='h2' sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {track.title}
        </Typography>
        <Typography variant='h6'>{`Release date: ${new Date(track.releaseDate)
          .toISOString()
          .substring(0, 10)}`}</Typography>

        <Avatar src={track.coverPath} sx={{ width: '100%', height: '100%' }} className={isPlaying ? 'spin' : ''} />

        <Grid container direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Grid item xs={1}>
            <Typography>{TimeFormatter(currentTime)}</Typography>
          </Grid>

          <Grid item xs={10}>
            <LinearProgress variant='determinate' value={(currentTime / track.duration) * 100} />
          </Grid>
          <Grid item xs={1}>
            <Typography>{TimeFormatter(track.duration)}</Typography>
          </Grid>
        </Grid>
        <Stack direction='row' alignSelf='center' spacing={3}>
          <Tooltip title='Rewind'>
            <IconButton onClick={handleRewind}>
              <Replay10 fontSize='large' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Pause'>
            <IconButton onClick={handlePlayAndPauseAudio}>
              {isPlaying ? <Pause fontSize='large' /> : <PlayArrow fontSize='large' />}
            </IconButton>
          </Tooltip>

          <Tooltip title='Forward'>
            <IconButton onClick={handleForward}>
              <Forward10 fontSize='large' />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Container>
  )
})

export default TrackPlayer
