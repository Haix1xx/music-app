import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'

interface FollowSearchButtonProps {
  userId: string
  myId?: string
}
export default function FollowSearchButton({ userId, myId }: FollowSearchButtonProps) {
  const axiosPrivate = useAxiosPrivate()
  const [follow, setFollow] = useState<boolean>(false)
  const isFollowing = async (id: any) => {
    try {
      const url = UrlConfig.me.isFollowing.replace(':id', id)
      const response = await axiosPrivate.get(url)
      setFollow(response.data.data)
    } catch (err) { }
  }
  const followingOtherUser = async (id: any) => {
    try {
      const url = UrlConfig.me.followingOtherUser
      await axiosPrivate.post(url, { id: id })
    } catch (err) { }
  }
  const unfollow = async (id: any) => {
    try {
      const url = UrlConfig.me.unfollow.replace(':id', id)
      await axiosPrivate.delete(url)
    } catch (err) { }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        await isFollowing(userId)
      } catch (error) { }
    }
    fetchData()
  }, [])
  // const sendDataToParent = (data: string) => {
  //   props.sendDataToParent(data)
  // }
  const handleFollow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (follow === true) {
      unfollow(userId)
      // sendDataToParent('unfollow')
    } else {
      followingOtherUser(userId)
      // sendDataToParent('follow')
    }
    setFollow((prev: boolean) => !prev)
  }
  if (userId !== myId)
    return (
      <Button
        variant={follow ? 'outlined' : 'contained'}
        sx={{
          padding: '10px 20px',
          width: '100px',
          borderRadius: '18px',
          position: 'absolute',
          right: '30px',
          top: '19%',
          backgroundColor: follow ? 'white !important' : 'initial'
        }}
        onClick={(e) => handleFollow(e)}
      >
        {follow ? 'Following' : 'Follow'}
      </Button>
    );
  return <></>
}
