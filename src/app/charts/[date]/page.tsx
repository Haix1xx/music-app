'use client'
import UrlConfig from '@/config/urlConfig'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import Chart from '@/types/chart'
import { Button, Container, Grid, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import ChartTable from './ChartTable'
import Loader from '@/components/common/Loader/Loader'
import PageNotFound from '@/components/404/PageNotFound'
import dayjs, { Dayjs } from 'dayjs'
import { DatePicker, deDE, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useRouter, useSearchParams } from 'next/navigation'

const getChartDate = (date: Dayjs) => date.toISOString().substring(0, 10)

export default function Page({ params }: { params: { date: string } }) {
  const [chart, setChart] = useState<Chart>()
  const [isLoading, setIsLoading] = useState(true)

  const [date, setDate] = useState<Dayjs>(dayjs(params.date).add(7, 'hour'))
  const axios = useAxiosPrivate()

  const router = useRouter()

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

  const handleNagivate = (date: Dayjs | null) => {
    router.push(`/charts/${getChartDate(date ?? dayjs())}`)
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Container maxWidth='xl' sx={{ height: '100%', overflowY: 'auto', paddingY: '60px' }}>
          <Stack>
            <Grid container sx={{ justifyContent: 'space-between' }}>
              <Grid item xs={6} sm={6} lg={6}>
                <Typography variant='h2'>Top Song</Typography>
              </Grid>
              <Grid item xs={2} sm={4} lg={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label='Chart Date' value={date} format='YYYY-MM-DD' onChange={(e) => handleNagivate(e)} />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Typography variant='h4'>Your daily update of the most played tracks right now.</Typography>
          </Stack>

          {chart ? <ChartTable chart={chart} /> : <PageNotFound />}
        </Container>
      )}
    </>
  )
}
