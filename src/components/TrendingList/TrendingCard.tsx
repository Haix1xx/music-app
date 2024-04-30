import React from 'react'
import { Box, Stack, Grid, Typography } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { TrendingHashtag } from '@/types/trendingHashtag'
interface TrendingHashtagProps {
  trend: TrendingHashtag
}
export default function TrendingCard({ trend }: TrendingHashtagProps) {
  return (
    <Box
      sx={{
        width: '100%',
        height: 'auto',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '5px',
        opacity: 0.9,
        '&:hover': {
          backgroundColor: '#f0f4f7',
          opacity: 1,
          cursor: 'pointer'
        }
      }}
    >
      <Grid container direction='row' justifyContent='space-between' alignItems='center'>
        <Grid item>
          <Stack spacing={0.5}>
            <Typography
              color='black'
              style={{
                fontWeight: 'normal',
                verticalAlign: 'middle',
                fontSize: '16px'
              }}
            >
              {trend?.category === null ? 'Trending' : `Trending in ${trend.category.name}`}
            </Typography>
            <Typography
              color='black'
              style={{
                fontWeight: 'bold',
                verticalAlign: 'middle',
                fontSize: '20px'
              }}
            >
              {trend.hashtag.name}
            </Typography>
            <Typography
              color='black'
              style={{
                fontWeight: 'normal',
                verticalAlign: 'middle',
                fontSize: '16px'
              }}
            >
              {`${trend.count} posts`}
            </Typography>
          </Stack>
        </Grid>
        <Grid item>
          <MoreHorizIcon
            sx={{
              height: '40px',
              width: '40px',
              padding: '5px',
              borderRadius: '50%',
              ':hover': {
                backgroundColor: '#d9f3ff'
              }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
