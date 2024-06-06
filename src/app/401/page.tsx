// hooks

import { Container, Typography } from '@mui/material'

//----------------------------------------------------------------

export default function Custom401() {
  return (
    // <h1>
    //   401 - You are not authorized for this page{' '}
    // </h1>
    <>
      <title>401 | Soundee</title>
      <Container maxWidth='xl'>
        <Typography variant='h2' sx={{ alignItems: 'center', alignContent: 'center', textAlign: 'center' }}>
          401 - You are not authorized for this page
        </Typography>
      </Container>
    </>
  )
}
