'use client'
import React from 'react'
import { Stack } from '@mui/material'

import TrendingList from '@/components/TrendingList/TrendingList'
import PostLayout from '@/layouts/PostLayout'
import TrendingPostList from '@/components/TrendingList/TrendingPostList'
import withAuth from '@/authorization/withAuth'

function Page() {
  return (
    <PostLayout>
      <title>Explore | Beegin</title>
      <Stack sx={{ margin: '0 20px' }}>
        <TrendingList count={5} isFull={false} />
        <TrendingPostList />
      </Stack>
    </PostLayout>
  )
}

export default withAuth(Page)(['business', 'user'])
