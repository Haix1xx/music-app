'use client'
import withAuth from '@/authorization/withAuth'
import UrlConfig from '@/config/urlConfig'
import useSnackbar from '@/context/snackbarContext'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Button, Container, Stack, Typography } from '@mui/material'

function Page() {
  const axios = useAxiosPrivate()

  const { setSnack } = useSnackbar()
  const handleUpdateChart = async () => {
    try {
      const response = await axios.post(UrlConfig.common.chart)

      console.log(response)
      console.log(response.data)
    } catch (err) {
      setSnack({
        open: true,
        type: 'warning',
        message: 'An error occurs while updating chart'
      })
    }
  }
  return (
    <>
      <Container maxWidth='xl' sx={{ height: '100%', overflowY: 'auto' }}>
        <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
          <Typography variant='h2'>Chart Management</Typography>
          <Button sx={{ margin: '10px' }} variant='contained' onClick={handleUpdateChart}>
            Update Chart
          </Button>
        </Stack>
      </Container>
    </>
  )
}

export default withAuth(Page)(['admin'])
