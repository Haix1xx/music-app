'use client'
import React from 'react'

import TrendingList from '@/components/TrendingList/TrendingList'
import PostLayout from '@/layouts/PostLayout'
import { Box } from '@mui/material'

export default function Page() {
  return (
    <PostLayout>
      <title>Explore | Beegin</title>
      <Box sx={{ margin: '0 20px' }}>
        <TrendingList count={30} isFull={true} />
      </Box>
    </PostLayout>
  )
}
