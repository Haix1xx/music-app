'use client'

import useResponsive from '@/hooks/useResponsive'
import { Grid, Box, Card, Typography, styled } from '@mui/material'
import ChatList from './ChatList'
import ChatBox from './ChatBox'
import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import Profile from '@/types/profile'
import CustomSnackbar from '@/components/common/Snackbar'
import socketFunctions from '@/utils/socket'
import Image from 'next/image'
import NoFriendImg from '@/assets/no_friends.jpg'
import Message from '@/types/message'
import withAuth from '@/authorization/withAuth'

const StyledBox = styled('div')(({ theme }) => ({
  width: '100%',
  height: '96%',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  padding: '15px 25px',
  display: 'flex',
  flexDirection: 'column'
}))

const INFO_PANE_WIDTH = '30%'

interface FriendAndMessage {
  friend: Profile
  message: Message
  unseenMessageCount: number
}

function Page() {
  const isMobile = useResponsive('down', 'sm')
  const [selectedFriend, setSelectedFriend] = useState<Profile | null>(null)
  const [friends, setFriends] = useState<FriendAndMessage[] | null>(null)
  const axiosPrivate = useAxiosPrivate()

  const [onlineUserIds, setOnlineUserIds] = useState<any>([])
  useEffect(() => {
    socketFunctions.getOnlineUsers(setOnlineUserIds)
  })

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <title>Messages | Beegin</title>
      <Grid sx={{ width: '100%', height: '100%' }} container spacing={3}>
        {friends?.length === 0 ? (
          <Grid item xs={12} sx={{ height: '100%' }}>
            <Card className='flex flex-col justify-center items-center' sx={{ height: '95%', background: '#fdfdfd' }}>
              <Image src={NoFriendImg} alt='' height={400} />
              <Typography variant='h1'>Boohoo.</Typography>
              <Typography variant='h3'>You don't have any friends yet</Typography>
              <Typography variant='h5'>Beefriend others now by following people you know!</Typography>
            </Card>
          </Grid>
        ) : (
          <>
            <Grid item xs={4} sx={{ height: '100%' }}>
              <StyledBox>
                <ChatList
                  setSelectedFriend={setSelectedFriend}
                  onlineUserIds={onlineUserIds}
                  friends={friends}
                  setFriends={setFriends}
                />
              </StyledBox>
            </Grid>

            <Grid item xs={8} sx={{ height: '100%' }}>
              <StyledBox sx={{ padding: 0, position: 'relative' }}>
                <ChatBox friend={selectedFriend} onlineUserIds={onlineUserIds} />
              </StyledBox>
            </Grid>
          </>
        )}
      </Grid>

      <CustomSnackbar />
    </Box>
  )
}

export default withAuth(Page)(['business', 'user'])
