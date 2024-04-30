'use client'
import ListFollow from '@/components/ListFollowing/ListFollow'
import SuggestFollow from '@/components/SuggestFollow/SuggestFollow'
import PersistentScrollView from '@/components/common/PersistentScrollView'
import useResponsive from '@/hooks/useResponsive'
import { Divider, Grid, Stack } from '@mui/material'
import { Box } from '@mui/system'
import React, { ReactNode } from 'react'

interface PostLayoutProps {
  children: ReactNode
}

const PostLayout = ({ children }: PostLayoutProps) => {
  const isMobile = useResponsive('down', 'sm')
  const isDesktop = useResponsive('up', 'md')
  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Grid
        sx={{
          width: isMobile ? '100%' : '80%',
          padding: isMobile ? '12px' : '0',
          borderRadius: '10px'
        }}
      >
        <PersistentScrollView id='scrollableDiv'>{children}</PersistentScrollView>
      </Grid>
      <Divider orientation='vertical' flexItem sx={{ color: 'rgba(204.44, 128.17, 240.32, 0.25)' }} />
      <Grid
        sx={{
          display: { xs: 'none', sm: 'none', md: 'block' },
          width: isMobile ? '0' : '32%',
          padding: '0 22px',
          borderRadius: '10px'
        }}
      >
        <Stack gap={3}>
          <SuggestFollow />
          {/* <Divider sx={{ color: 'rgba(204.44, 128.17, 240.32, 0.25)' }} />
          <ListFollow /> */}
        </Stack>
      </Grid>
    </Box>
  )
}

export default PostLayout
