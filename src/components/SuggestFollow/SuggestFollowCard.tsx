import React, { useState } from 'react'
import { Card, CardHeader, Avatar, Button, Box, Typography } from '@mui/material'
import ButtonFollow from '../ButtonFollow/ButtonFollow'
import { useRouter } from 'next/navigation'

export default function SuggestFollowCard(props: any) {
  const { firstname, lastname, avatar, slug } = props.user.user.profile
  const count = props.user.count ? props.user.count : null
  const router = useRouter()
  const redirectToProfile = (id: string) => {
    router.push(`/profile/${id}`)
  }
  const [isVisible, setIsVisible] = useState(true)

  const handleDataFromChild = (data: string) => {
    if (data === 'follow') {
      setIsVisible(false)
      props.onFollow(props.user.user._id)
    }
  }
  return isVisible ? (
    <Box sx={{ position: 'relative', padding: '0 !important', width: '100%' }}>
      <CardHeader
        sx={{ padding: '20px' }}
        avatar={
          <Avatar
            src={avatar}
            sx={{ width: '60px', height: '60px', marginRight: '10px', cursor: 'pointer' }}
            onClick={() => redirectToProfile(props.user.user._id)}
          />
        }
        title={
          <>
            <Typography variant='subtitle1'>{firstname + ' ' + lastname}</Typography>
            <Typography variant='body2' color='textSecondary'>
              @{slug}
            </Typography>
          </>
        }
        subheader={count ? `${count} mutual following` : `Same interests`}
        action={
          <ButtonFollow
            userId={props.user.user._id}
            sendDataToParent={handleDataFromChild}
            status={false}
          ></ButtonFollow>
        }
      />
    </Box>
  ) : null
}
