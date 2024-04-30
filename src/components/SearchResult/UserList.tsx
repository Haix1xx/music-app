import * as React from 'react'
import { useState, useEffect } from 'react'
import { Post } from '@/types/post'
import { Box, CircularProgress, Skeleton, Stack, Typography } from '@mui/material'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import { ParsedUrlQuery } from 'querystring'
import { useRouter, useSearchParams } from 'next/navigation'
import UserCard from './UserCard'
import SearchProfile from '@/types/searchProfile'
import NotFound from './NotFound'

interface UserListProps {
  f: string
  limit: number | undefined
}
function UserList({ f, limit }: UserListProps) {
  const [profiles, setProfiles] = useState<SearchProfile[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const axios = useAxiosPrivate()
  const searchParams = useSearchParams()
  const router = useRouter()
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        if (searchParams.get('q') !== null) {
          setLoading(true)
          const q = searchParams.get('q') ?? ''
          const response = await axios.get(UrlConfig.search.searchUsers(encodeURIComponent(q), limit))
          console.log(response.data)
          setLoading(false)
          setProfiles(response.data.data)
        }
      } catch (error) {}
    }

    fetchProfiles()
  }, [searchParams])

  const handleShowMore = () => {
    const q = encodeURIComponent(searchParams.get('q') ?? '')
    const url = `/search?q=${q}&f=user`
    router.push(url)
  }
  return (
    <Stack spacing={1}>
      {loading ? (
        <CircularProgress color='primary' sx={{ alignSelf: 'center' }} />
      ) : profiles.length > 0 ? (
        <Stack spacing={1}>
          {profiles.map((profile, index) => (
            <UserCard key={index} profile={profile} />
          ))}

          {limit !== undefined && limit === profiles.length && (
            <Typography
              onClick={handleShowMore}
              color='primary'
              sx={{
                fontWeight: 'bold',
                verticalAlign: 'middle',
                fontSize: '18px',
                cursor: 'pointer',
                margin: '0 0 20px 0'
              }}
            >
              Show more
            </Typography>
          )}
        </Stack>
      ) : (
        <NotFound q={searchParams.get('q')} />
      )}
    </Stack>
  )
}

export default UserList
