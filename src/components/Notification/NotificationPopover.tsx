import React from 'react'
import { useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { Button, Badge, Popover, Typography, Box } from '@mui/material'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import NotificationTab from './NotificationTab'
import { useNotifications } from '../../context/NotificationContext'
import UrlConfig from '@/config/urlConfig'
import { Notification } from '@/types/notification'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { pusherClient } from '@/libs/pusher'
import { useAuth } from '@/context/AuthContext'

const StyledIconNotifBox = styled('div')(({ theme }) => ({
  width: '55px',
  height: '55px',
  borderRadius: '50%',
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  border: `1px solid ${theme.palette.primary.light}`,
  '& svg': {
    fontSize: '28px',
    color: theme.palette.primary.light
  }
}))

const NotificationPopover = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const axiosPrivate = useAxiosPrivate()
  const { notifsState, notifsDispatch } = useNotifications()
  const auth = useAuth()
  const myId = auth.user?._id

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (!myId) return
    pusherClient.subscribe(myId)
    pusherClient.bind('notifications:new', (data: Notification) => {
      notifsDispatch({ type: 'ADD_NOTIFICATION', payload: { notification: data } })
    })
    return () => {
      pusherClient.unsubscribe(myId)
      pusherClient.unbind('notifications:new')
    }
  }, [myId])

  async function getNotifications() {
    try {
      const res = await axiosPrivate(UrlConfig.notifications.getNotifications)
      const data = res.data.data as Notification[]
      notifsDispatch({
        type: 'SET_NOTIFICATIONS',
        payload: {
          notifications: data,
          unread: res.data.numUnread
        }
      })
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  useEffect(() => {
    getNotifications()
  }, [])

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover-notif' : undefined
  return (
    <div>
      <Button
        aria-describedby={id}
        sx={{
          borderRadius: '50%',
          // ...(open && { backgroundColor: (theme) => `${alpha(theme.palette.primary.main, 0.8)} !important`, }),
          transition: 'all 0.15s ease-in-out'
        }}
        onClick={handleClick}
      >
        <StyledIconNotifBox>
          <Badge badgeContent={notifsState.unread} color='error' overlap='circular' max={100}>
            <NotificationsRoundedIcon />
          </Badge>
        </StyledIconNotifBox>
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        sx={{
          '& .MuiPopover-paper': {
            '@media (-webkit-device-pixel-ratio: 1.25)': {
              left: '1300px !important'
            }
          }
        }}
      >
        <Typography variant={'h4'} sx={{ padding: '25px 0px 10px 15px', fontSize: '17px' }}>
          Notifications
        </Typography>
        <NotificationTab />
      </Popover>
    </div>
  )
}

export default NotificationPopover
