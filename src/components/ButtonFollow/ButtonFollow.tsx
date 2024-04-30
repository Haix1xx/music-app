import React, { useEffect, useState } from 'react'
import { Button, Skeleton } from '@mui/material'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'

const ButtonFollow = (props: any) => {
  const { userId } = props
  const axiosPrivate = useAxiosPrivate()
  const [follow, setFollow] = useState<boolean>(props.status !== undefined ? props.status : undefined)
  const isFollowing = async (id: any) => {
    try {
      const url = UrlConfig.me.isFollowing.replace(':id', id)
      const response = await axiosPrivate.get(url)
      setFollow(response.data.data)
    } catch (err) {}
  }

  const followingOtherUser = async (id: any) => {
    try {
      const url = UrlConfig.me.followingOtherUser
      await axiosPrivate.post(url, { id: id })
    } catch (err) {}
  }

  const unfollow = async (id: any) => {
    try {
      const url = UrlConfig.me.unfollow.replace(':id', id)
      await axiosPrivate.delete(url)
    } catch (err) {}
  }

  useEffect(() => {
    if (props.status === undefined) {
      isFollowing(userId)
    }
    if (props.status !== follow) {
      setFollow(props.status)
    }
  }, [userId])

  const sendDataToParent = (data: string) => {
    props.sendDataToParent(data)
  }

  const handleFollow = () => {
    if (follow === true) {
      unfollow(userId)
      sendDataToParent('unfollow')
    } else {
      followingOtherUser(userId)
      sendDataToParent('follow')
    }
    setFollow((prev: boolean) => !prev)
  }

  return (
    <Button
      variant={follow ? 'outlined' : 'contained'}
      sx={{
        padding: '10px 20px',
        width: '100px',
        borderRadius: '18px',
        // position: 'absolute',
        // right: '35px',
        // top: '25px',
        backgroundColor: follow ? 'white !important' : 'initial'
      }}
      onClick={handleFollow}
    >
      {follow === undefined ? (
        <Skeleton variant='text' width={80} height={20} /> // Replace with your desired skeleton
      ) : follow === true ? (
        'Following'
      ) : (
        'Follow'
      )}
    </Button>
  )
}

export default ButtonFollow
