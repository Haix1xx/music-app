import React, { useEffect } from 'react'
import { useNotifications } from '../../context/NotificationContext'
import UrlConfig from '@/config/urlConfig'
import { Notification } from '@/types/notification'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import NotificationCard from './NotificationCard'

interface AllNotificationsProps {
  notifications: Notification[]
}

const AllNotifications = ({ notifications }: AllNotificationsProps) => {
  return (
    <div>
      {notifications && (
        <>
          {notifications.map((notif) => (
            <NotificationCard key={notif._id} notification={notif} />
          ))}
        </>
      )}
    </div>
  )
}

export default AllNotifications
