import useResponsive from '@/hooks/useResponsive'
import { Box, Card, CardHeader, Skeleton, Stack, Grid } from '@mui/material'
import React from 'react'

const PostSkeleton = () => {
  const isMobile = useResponsive('down', 'sm')

  return (
    <Grid
      container
      direction={'row'}
      spacing={isMobile ? 1 : 3}
      sx={{ width: '100%', marginBottom: '15px', justifyContent: 'center' }}
    >
      <Grid item md={2} sx={{ paddingLeft: '0px !important', display: 'flex', justifyContent: 'center' }}>
        <Skeleton animation='wave' variant='circular' width={60} height={60} />
      </Grid>
      <Grid item md={10} sx={{ paddingLeft: '0px !important' }}>
        <Skeleton animation='wave' variant='text' height={25} sx={{ width: '60%' }} />
        <Skeleton animation='wave' variant='text' height={35} />
        <Skeleton
          variant='rounded'
          height={250}
          sx={{
            mt: 2
          }}
        />
      </Grid>
    </Grid>
  )
}

export default PostSkeleton
