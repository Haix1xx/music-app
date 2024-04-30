/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { Grid, Paper, Typography, Box, Stack, styled, Button, Avatar, Card } from '@mui/material'
import Image from 'next/image'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import ChartComponent from './chart'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
// hooks

import React, { useEffect, useState } from 'react'
import withAuth from '@/authorization/withAuth'

//component-style
const StyledProfile = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  color: '#FFFFFF',
  overflow: 'auto',
  position: 'relative'
}))

const BoxStyle = styled(Card)(({ theme }) => ({
  width: '240px',
  height: '200px',
  borderRadius: '15px',
  backgroundColor: 'white'
}))
function page() {
  const [selectedYear, setSelectedYear] = useState(2023)
  const [revenue, setRevenue] = useState(0)
  const startYear = 2022
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, index) => startYear + index).reverse()

  const handleYearChange = (event: any) => {
    setSelectedYear(event.target.value)
    // You can perform additional actions when the year changes
  }
  const axiosPrivate = useAxiosPrivate()
  const [data, setData] = useState<{
    account: any
    numOfAccount: number
    post: any
    numOfPost: number
  }>({
    account: [], // 'account' property in the state
    numOfAccount: 0,
    post: [], // 'post' property in the state
    numOfPost: 0
  })
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(UrlConfig.admin.getOverview(selectedYear))
        setData(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [selectedYear])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(UrlConfig.admin.getRevenue)
        console.log(response.data)
        setRevenue(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])
  function createData(ID: number, Fullname: string, Total: number) {
    return { ID, Fullname, Total }
  }

  const rows = [
    createData(1, 'Alert Crima', 1159),
    createData(2, 'John Smith', 937),
    createData(3, 'Backman', 862),
    createData(4, 'Park Jung', 805),
    createData(5, 'Gingerbread', 756),
    createData(6, 'Joan Cancelo', 659),
    createData(7, 'Yoshida', 637),
    createData(8, 'Ali Hamel', 562),
    createData(9, 'Hoang Nam', 505),
    createData(10, 'Ginger', 356)
  ]
  return (
    <div>
      <Grid container spacing={2} xs={12}>
        <Grid container spacing={2} xs={7} sx={{ marginLeft: '20px', marginTop: '15px' }}>
          <Grid item xs={4}>
            <BoxStyle>
              <Stack spacing={2}>
                <Typography
                  variant='h3'
                  sx={{ fontWeight: '600', textAlign: 'center', fontSize: '20px', marginTop: '20px !important' }}
                >
                  Posts
                </Typography>
                <Typography
                  variant='h3'
                  sx={{
                    fontWeight: 'medium',
                    textAlign: 'center',
                    fontSize: '18px',
                    marginTop: '20px !important'
                  }}
                >
                  {data.numOfPost}
                </Typography>
              </Stack>
            </BoxStyle>
          </Grid>
          <Grid item xs={4}>
            <BoxStyle>
              <Stack spacing={2}>
                <Typography
                  variant='h3'
                  sx={{ fontWeight: '600', textAlign: 'center', fontSize: '20px', marginTop: '20px !important' }}
                >
                  Accounts
                </Typography>
                <Typography
                  variant='h3'
                  sx={{
                    fontWeight: 'medium',
                    textAlign: 'center',
                    fontSize: '18px',
                    marginTop: '20px !important'
                  }}
                >
                  {data.numOfAccount}
                </Typography>
              </Stack>
            </BoxStyle>
          </Grid>
          <Grid item xs={4}>
            <BoxStyle>
              <Stack spacing={2}>
                <Typography
                  variant='h3'
                  sx={{ fontWeight: '600', textAlign: 'center', fontSize: '20px', marginTop: '20px !important' }}
                >
                  Revenue
                </Typography>
                <Typography
                  variant='h3'
                  sx={{
                    fontWeight: 'medium',
                    textAlign: 'center',
                    fontSize: '18px',
                    marginTop: '20px !important'
                  }}
                >
                  {revenue.toLocaleString()}
                </Typography>
              </Stack>
            </BoxStyle>
          </Grid>
          <Grid item xs={12} sx={{ background: 'white', marginTop: '20px', borderRadius: '15px' }}>
            <div>
              <label htmlFor='year'>Select a year: </label>
              <select id='year' value={selectedYear} onChange={handleYearChange}>
                <option value=''>-- Select a year --</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <ChartComponent accountData={data.account} postData={data.post} />
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Typography
            variant='h3'
            sx={{
              fontWeight: '600',
              textAlign: 'center',
              fontSize: '20px',
              marginTop: '20px !important',
              marginBottom: '20px'
            }}
          >
            Top 10 Accounts
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label='simple table'>
              <TableHead style={{ background: '#9747FF !important' }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align='right'>Fullname</TableCell>
                  <TableCell align='right'>Total($)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.ID} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component='th' scope='row'>
                      {row.ID}
                    </TableCell>
                    <TableCell align='right'>{row.Fullname}</TableCell>
                    <TableCell align='right'>{row.Total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  )
}

export default withAuth(page)(['admin'])
