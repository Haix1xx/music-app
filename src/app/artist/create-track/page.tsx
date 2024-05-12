/* eslint-disable @next/next/no-img-element */
'use client'
import TrackForm from '@/components/Track/TrackForm'
import { Container } from '@mui/material'

export default function Page() {
  return (
    <Container sx={{ height: '100%' }}>
      <TrackForm />
    </Container>
  )
}
