'use client'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function PageNotFound() {
  const router = useRouter()

  const handleNagivateBack = () => {
    router.back()
  }

  return (
    <>
      <Container maxWidth='xl' sx={{ position: 'relative', height: '100%' }}>
        <Box
          sx={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Stack spacing={2}>
            <Typography variant='h2'>Page Not Found</Typography>
            <Button variant='text' onClick={handleNagivateBack}>
              Go back!
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  )
}
