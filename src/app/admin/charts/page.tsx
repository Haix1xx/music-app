'use client'
import withAuth from '@/authorization/withAuth'
import PageNotFound from '@/components/404/PageNotFound'
import ChartTable from '@/components/Chart/ChartTable'
import Loader from '@/components/common/Loader/Loader'
import UrlConfig from '@/config/urlConfig'
import useSnackbar from '@/context/snackbarContext'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import Chart from '@/types/chart'
import { Button, Container, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function Page() {
  const axios = useAxiosPrivate()
  const [chart, setChart] = useState<Chart>()
  const [isLoading, setIsLoading] = useState(true)
  const [flag, setFlag] = useState(false)
  const router = useRouter()
  const { setSnack } = useSnackbar()

  const handleNavigation = () => {
    router.push('/charts')
  }
  const handleUpdateChart = async () => {
    try {
      const response = await axios.post(UrlConfig.common.chart)
      if (response.data.status === 'success') {
        setFlag((flag) => !flag)
      }
    } catch (err) {
      setSnack({
        open: true,
        type: 'warning',
        message: 'An error occurs while updating chart'
      })
    }
  }

  useEffect(() => {
    const fetchChart = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(UrlConfig.common.getChart('latest'))

        if (response.status === 200) {
          setChart(response.data.data as Chart)
        }
      } catch (err) {
      } finally {
        setIsLoading(false)
      }
    }

    fetchChart()
  }, [axios, flag])
  return (
    <>
      <Container maxWidth='xl' sx={{ height: '100%', overflowY: 'auto' }}>
        <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
          <Typography variant='h2'>Chart Management</Typography>
          <Stack
            spacing={1}
            direction='row'
            height='100%'
            sx={{ verticalAlign: 'center', alignItems: 'center', alignSelf: 'center' }}
          >
            <Button variant='outlined' onClick={handleNavigation}>
              View Charts
            </Button>
            <Button sx={{ margin: '10px' }} variant='contained' onClick={handleUpdateChart}>
              Update Chart
            </Button>
          </Stack>
        </Stack>
        {isLoading ? <Loader /> : chart ? <ChartTable chart={chart} /> : <PageNotFound />}
      </Container>
    </>
  )
}

export default withAuth(Page)(['admin'])
