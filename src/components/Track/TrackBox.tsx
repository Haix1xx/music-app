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
}
const TrackBox = forwardRef<HTMLDivElement, TrackBoxProps>((props, ref) => {
  const { cover, title, type, releaseDate, id } = props
  const router = useRouter()
  const handleNavigation = () => {
    console.log(type)
    switch (type.toLowerCase()) {
      case 'album':
        router.push(`/artist/album/${id}`)
    }
  }
  return (
    <Card
      ref={ref}
      sx={{
        maxWidth: '300px',
        padding: '10px',
        margin: '30px',
        '&:hover': {
          backgroundColor: '#eeedf0'
        }
      }}
    >
      <CardActionArea onClick={handleNavigation}>
        <Image src={cover} alt='cover' width={230} height={230} />
        <CardContent>
          <Typography
            gutterBottom
            variant='h5'
            component='div'
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {title}
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
