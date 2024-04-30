import { useEffect, useState } from 'react'
import { Divider, Stack, CircularProgress } from '@mui/material'
import { TrendingCategoryPost } from '@/types/trendingCategoryPost'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import TrendingCard from './TrendingCard'
import TrendingPostCard from './TrendingPostCard'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'

export default function TrendingPostList() {
  // const [categoryPosts, setCategoryPost] = useState<TrendingCategoryPost[]>([])
  const axios = useAxiosPrivate()
  const { user } = useAuth()
  const {
    data: categoryPosts,
    error,
    isLoading,
    status
  } = useQuery<TrendingCategoryPost[]>({
    queryKey: ['categoryPosts'],
    queryFn: fetchData,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  async function fetchData() {
    try {
      const preferences =
        user?.preferences.join(',') ?? '65392b8f96ed3a51de029346,653a96bd9bbda0b0c41d4b67,65392b7896ed3a51de029340'
      const response = await axios.get(UrlConfig.trending.getTrendingPosts(preferences))
      return response.data.data
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Stack>
      {isLoading && user === null ? (
        <CircularProgress color='primary' sx={{ alignSelf: 'center' }} />
      ) : (
        categoryPosts?.map((item, index) => (
          <>
            <Divider sx={{}} />
            <TrendingPostCard key={index} category={item?.category?.name} posts={item.posts} />
          </>
        ))
      )}
    </Stack>
  )
}
