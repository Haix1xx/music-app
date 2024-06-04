import { Artist, ArtistProfile } from '@/types/artist'
import { Avatar, Box, Card, CardActionArea, CardContent, CardMedia, Container, Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { forwardRef } from 'react'

interface TrackBoxProps {
  cover: string
  title: string
  releaseDate: string
  type: string
  id: string
  artist: ArtistProfile
}
// eslint-disable-next-line react/display-name
const TrackBox = forwardRef<HTMLDivElement, TrackBoxProps>((props, ref) => {
  const { cover, title, type, releaseDate, id, artist } = props
  const router = useRouter()
  const handleNavigation = () => {
    switch (type.toLowerCase()) {
      case 'album':
        router.push(`/artist/album/${id}`)
        break
      case 'single':
        router.push(`/artist/track/${id}`)
        break
    }
  }
  return (
    <Card
      ref={ref}
      sx={{
        maxWidth: '250px',
        padding: '10px 10px 0 10px',
        margin: '30px',
        '&:hover': {
          backgroundColor: '#eeedf0'
        }
      }}
    >
      <CardActionArea onClick={handleNavigation}>
        <Image src={cover} alt='cover' width={230} height={230} />
        <CardContent sx={{ paddingX: '10px' }}>
          <Typography
            gutterBottom
            variant='h4'
            component='div'
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}
          >
            {title}
          </Typography>
          <Typography
            gutterBottom
            variant='h5'
            component='div'
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {artist.displayname}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {`${new Date(releaseDate).getFullYear()} . ${type}`}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
})

export default TrackBox
