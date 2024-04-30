import { Avatar, Card, CardContent, CardMedia, Container, Typography } from '@mui/material'
import Image from 'next/image'

interface TrackBoxProps {
  cover: string
  title: string
  releaseDate: string
  type: string
}
export default function TrackBox({ cover, title, releaseDate, type }: TrackBoxProps) {
  return (
    <Card
      sx={{
        maxWidth: '300px',
        padding: '10px',
        margin: '30px',
        '&:hover': {
          backgroundColor: '#eeedf0'
        }
      }}
    >
      <Image src={cover} alt='cover' width={300} height={300} />
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {title}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {`${new Date(releaseDate).getFullYear()} . ${type}`}
        </Typography>
      </CardContent>
    </Card>
  )
}
