'use client'
import UrlConfig from '@/config/urlConfig'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import Chart from '@/types/chart'
import { Button, Container, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import ChartTable from './ChartTable'
import Loader from '@/components/common/Loader/Loader'
import PageNotFound from '@/components/404/PageNotFound'

export default function Page({ params }: { params: { date: string } }) {
  const [chart, setChart] = useState<Chart>()
  const [isLoading, setIsLoading] = useState(true)

  const axios = useAxiosPrivate()
  useEffect(() => {
    const fetchChart = async () => {
      try {
        const response = await axios.get(UrlConfig.common.getChart(params.date))

        if (response.status === 200) {
          setChart(response.data.data as Chart)
        }
      } catch (err) {
      } finally {
        setIsLoading(false)
      }
    }

    fetchChart()
  }, [axios, params])
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : chart ? (
        <Container maxWidth='xl' sx={{ height: '100%', overflowY: 'auto', paddingBottom: '60px' }}>
          <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
            <Stack>
              <Typography variant='h2'>Top Song</Typography>
              <Typography variant='h4'>Your daily update of the most played tracks right now.</Typography>
            </Stack>
          </Stack>

          <ChartTable chart={chart} />
        </Container>
      ) : (
        <PageNotFound />
      )}
    </>
  )
}
