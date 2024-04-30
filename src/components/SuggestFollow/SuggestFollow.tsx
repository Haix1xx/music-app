import { Box, Typography, Stack, Skeleton } from '@mui/material'
import SuggestFollowCard from './SuggestFollowCard'

import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import { useEffect, useState } from 'react'

function SuggestFollow() {
  const axiosPrivate = useAxiosPrivate()
  const [data, setData] = useState<any>(null)

  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosPrivate.get(UrlConfig.me.suggestFollow)
        const responseData = response.data.data
        setData(responseData)
      } catch (error) {
        console.log(error)
      }
    }

    fetchPosts()
  }, [])
  const handleFollow = (userId: string) => {
    setData((prevData: any) => prevData.filter((item: any) => item.user._id !== userId))
  }
  const handleShowMore = () => {
    setShowAll(!showAll)
  }
  const displayedData = showAll === true ? data : data?.slice(0, 3)
  return (
    <Box>
      <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
        <Typography variant='h4' sx={{ color: 'black' }}>
          Suggestions for you
        </Typography>
        <Typography
          color='secondary'
          sx={{
            fontWeight: 'bold',
            verticalAlign: 'middle',
            cursor: 'pointer'
          }}
          variant='h4'
          onClick={handleShowMore}
        >
          {showAll ? 'Show less' : 'Show more'}
        </Typography>
      </Stack>
      <Box sx={{ marginLeft: '-10px' }}>
        {data != null && displayedData.length >= 0
          ? displayedData.map((item: any, index: number) => (
              <SuggestFollowCard key={index} user={item} onFollow={handleFollow} />
            ))
          : [...Array(3)].map((elementInArray, index) => (
              <Stack key={index} direction={'row'} alignItems={'center'} sx={{ padding: '20px' }}>
                <Skeleton variant='circular' width={60} height={60} />
                <Stack spacing={1} justifyContent={'center'} sx={{ marginLeft: '26px' }}>
                  <Skeleton variant='rounded' height={15} width={90} />
                  <Skeleton variant='rounded' height={15} width={50} />
                  <Skeleton variant='rounded' height={15} width={150} />
                </Stack>
                <Skeleton variant='rounded' sx={{ marginLeft: '32px', borderRadius: '18px' }} width={85} height={40} />
              </Stack>
            ))}
      </Box>
    </Box>
  )
}

export default SuggestFollow
