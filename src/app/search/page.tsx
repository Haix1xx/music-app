'use client'
import * as React from 'react'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { useRouter, useSearchParams } from 'next/navigation'
import { Divider, Stack, Typography } from '@mui/material'

import PostList from '@/components/SearchResult/PostList'
import UserList from '@/components/SearchResult/UserList'
import PostLayout from '@/layouts/PostLayout'

export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [value, setValue] = useState(searchParams.get('f') ?? 'top')
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  useEffect(() => {
    const q = encodeURIComponent(searchParams.get('q') ?? '')
    const url = `/search?q=${q}&f=${value}`
    router.push(url)
  }, [value, searchParams])
  return (
    <PostLayout>
      <title>Search | Beegin</title>
      <Box sx={{ width: '95%', typography: 'body1', margin: '0 20px', alignItems: 'center', alignContent: 'center' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              onChange={handleChange}
              aria-label='lab API tabs example'
              variant='fullWidth'
              textColor='primary'
              indicatorColor='primary'
              sx={{}}
            >
              <Tab label='Top' value='top' sx={{ fontSize: '20px' }} />
              <Tab label='Latest' value='latest' sx={{ fontSize: '20px' }} />
              <Tab label='User' value='user' sx={{ fontSize: '20px' }} />
              <Tab label='Media' value='media' sx={{ fontSize: '20px' }} />
            </TabList>
          </Box>
          <TabPanel value='top'>
            <Typography variant='h3' sx={{ margin: '10px 0' }}>
              User
            </Typography>
            <UserList f={value} limit={3} />
            <Divider sx={{ padding: '20px 0 20px 0' }} />
            <Typography variant='h3' sx={{ margin: '10px 0' }}>
              Post
            </Typography>
            <PostList f={value} />
          </TabPanel>
          <TabPanel value='latest'>
            <PostList f={value} />
          </TabPanel>
          <TabPanel value='user'>
            <Stack>
              <UserList f={value} limit={undefined} />
            </Stack>
          </TabPanel>
          <TabPanel value='media'>
            <PostList f={value} />
          </TabPanel>
        </TabContext>
      </Box>
    </PostLayout>
  )
}
