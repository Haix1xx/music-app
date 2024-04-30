import React from 'react'
import { Card, CardHeader, Avatar, Button, Box } from '@mui/material'
import { useAuth } from '@/context/AuthContext'
import UrlConfig from '@/config/urlConfig'
import { axiosPrivate } from '@/axios'

export default function ListFollowCard(props: any) {
  const { name, username, avatar, isFollowing, _id } = props.user
  const { user } = useAuth()
  const [follow, setFollow] = React.useState(isFollowing)
  const isUser = user?._id === _id
  const handleFollow = () => {
    if (follow) {
      unfollow(_id)
    } else {
      followOtherUser(_id)
    }
    setFollow((prev: boolean) => !prev)
  }

  const followOtherUser = async (id: any) => {
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

  return (
    <Box sx={{ position: 'relative', padding: '0 !important', width: '100%' }}>
      <CardHeader
        sx={{ padding: '20px' }}
        avatar={<Avatar src={avatar} sx={{ width: '60px', height: '60px', marginRight: '10px' }} />}
        title={name}
        subheader={`@${username}`}
        action={
          <Button
            onClick={handleFollow}
            variant={follow ? 'outlined' : 'contained'}
            hidden={isUser}
            sx={{
              padding: '10px 20px',
              width: '100px',
              borderRadius: '18px',
              top: '50%',
              position: 'absolute',
              transform: 'translate(-100%, -50%)'
            }}
          >
            {follow ? 'Following' : 'Follow'}
          </Button>
        }
      />
    </Box>
  )
}
