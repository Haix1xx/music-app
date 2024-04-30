import { Post } from '@/types/post'
import { Comment } from '@/types/comment'
import { Notification } from '@/types/notification'

interface AddNotifAction {
  type: 'ADD_NOTIFICATION'
  payload: {
    notification: Notification
  }
}

interface SetNotifsAction {
  type: 'SET_NOTIFICATIONS'
  payload: {
    notifications: Notification[]
    unread: number
  }
}

interface SetNotifReadAction {
  type: 'SET_NOTIFICATION_READ'
  payload: {
    notificationId: string
  }
}

export interface NotifState {
  notifications: Notification[]
  unread: number
}

export type NotifAction = AddNotifAction | SetNotifsAction | SetNotifReadAction
