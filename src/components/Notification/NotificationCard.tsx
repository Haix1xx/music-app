import React from 'react'
import { Avatar, Stack, Box, Typography } from '@mui/material'
import CustomAvatar from './CustomAvatar'
import { Notification } from '@/types/notification'
import Link from 'next/link'
import { useNotifications } from '@/context/NotificationContext'
import { timeSince } from '@/utils/changeDate'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import urlConfig from '@/config/urlConfig'

interface NotificationCardProps {
  notification: Notification
}

function getLink(notification: Notification) {
  // eslint-disable-next-line prefer-destructuring
  const type = notification.type
  if (type === 'like post' || type === 'share post') {
    return `/posts/${notification.contentId}`
  } else if (type === 'follow') {
    return `/profile/${notification.populate.user}`
  } else if (type === 'comment') {
    return `/posts/${notification.populate.post}?commentId=${notification.populate._id}`
  } else if (type === 'reply comment') {
    return `/posts/${notification.populate.post}?commentId=${notification.populate._id}&parentCommentId=${notification.populate.parent}`
  } else if (type === 'like comment') {
    if (notification.populate.parent) {
      return `/posts/${notification.populate.post}?commentId=${notification.populate.parent}&parentCommentId=${notification.populate.parent}`
    }
    return `/posts/${notification.populate.post}?commentId=${notification.populate._id}`
  }
}

const NotificationCard = ({ notification }: NotificationCardProps) => {
  const axiosPrivate = useAxiosPrivate()
  const { notifsDispatch } = useNotifications()
  const handleNotificationClick = async () => {
    if (!notification.read) {
      notifsDispatch({ type: 'SET_NOTIFICATION_READ', payload: { notificationId: notification._id } })
      await axiosPrivate.patch(urlConfig.notifications.markAsRead, { notiId: notification._id })
    }
  }
  return (
    //@ts-ignore
    <Link href={getLink(notification)}>
      <Stack
        direction={'row'}
        sx={{ width: '100%', padding: '15px', marginBottom: '10px', backgroundColor: '#FBF8FC', borderRadius: '10px' }}
        gap={2}
        onClick={handleNotificationClick}
      >
        <CustomAvatar image={notification?.image} type={notification?.type} read={notification.read} />
        <Box sx={{ width: '100%' }}>
          {/* <Stack direction={'row'} sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}> */}
          <Typography
            sx={{
              fontSize: '14px',
              marginTop: '5px',
              color: '#979797',
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3, // Adjust the number of lines to display
              textOverflow: 'ellipsis' // Add ellipsis at the end
            }}
          >
            <span style={{ fontWeight: 'bold' }}>{notification?.actors}</span> {notification?.content}
          </Typography>
          <Typography
            sx={{
              color: '#B0B0B0',
              fontSize: '13px',
              fontWeight: 400,
              wordWrap: 'break-word'
            }}
          >
            {timeSince(new Date(notification.updatedAt))}
          </Typography>
          {/* </Stack> */}
          {/* <Typography sx={{ fontSize: '14px', marginTop: '5px', color: '#979797' }}>liked your post</Typography> */}
        </Box>
      </Stack>
    </Link>
  )
}

export default NotificationCard
