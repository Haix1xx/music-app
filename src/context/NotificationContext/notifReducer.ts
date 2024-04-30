import { NotifAction, NotifState } from './types'

function AddContentNotification(notification: any) {
  let actorsString = ''
  const distinctActors = [...new Set(notification.actors)]
  const lastActor = notification.actors[notification.actors.length - 1]
  if (distinctActors.length > 1) {
    if (distinctActors.length - 1 === 1) {
      actorsString = `${lastActor} and 1 other`
    } else {
      actorsString = `${lastActor} and ${distinctActors.length - 1} others`
    }
  } else {
    actorsString = distinctActors.join(', ')
  }
  switch (notification.type) {
    case 'follow':
      return {
        ...notification,
        content: 'started following you',
        actors: actorsString
      }
    case 'like post':
      return {
        ...notification,
        content: `liked your post`,
        actors: actorsString
      }
    case 'like comment':
      return {
        ...notification,
        content: `liked your comment`,
        actors: actorsString
      }
    case 'comment':
      return {
        ...notification,
        content: `commented on your post "${notification.populate?.content}"`,
        actors: actorsString
      }
    case 'reply comment':
      return {
        ...notification,
        content: `replied to your comment "${notification.populate?.content}"`,
        actors: actorsString
      }
    case 'share post':
      return {
        ...notification,
        content: `shared your post`,
        actors: actorsString
      }

    default:
      return notification
  }
}

export const notifReducer = (state: NotifState, action: NotifAction) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      let updatedNotifications = [...state.notifications]
      let { unread } = state
      const { notification } = action.payload

      if (
        notification.type === 'like post' ||
        notification.type === 'share post' ||
        notification.type === 'like comment'
      ) {
        // check if the same contentId
        const existingNotification = updatedNotifications.find((notif) => notif._id === notification._id)
        if (existingNotification) {
          // remove the existing notification
          updatedNotifications = updatedNotifications.filter((notif) => notif._id !== notification._id)
        }
        updatedNotifications.unshift(AddContentNotification(notification))
      } else if (notification.type === 'follow') {
        const existingNotification = updatedNotifications.find((notif) => notif.contentId === notification.contentId)
        if (existingNotification) {
          // remove the existing notification
          updatedNotifications = updatedNotifications.filter((notif) => notif.contentId !== notification.contentId)
        }
        updatedNotifications.unshift(AddContentNotification(notification))
      }
      return {
        ...state,
        notifications: updatedNotifications,
        unread: updatedNotifications.filter((notification) => !notification.read).length
      }

    case 'SET_NOTIFICATIONS':
      const newNotifications = action.payload.notifications.map((notification) => AddContentNotification(notification))
      const uniqueFollowNotifications = new Set<string>()

      // Filter out duplicate 'follow' notifications with the same contentId
      const filteredNotifications = newNotifications.filter((notification) => {
        if (notification.type === 'follow') {
          const key = `${notification.type}_${notification.contentId}`
          if (uniqueFollowNotifications.has(key)) {
            // Skip if a 'follow' notification with the same contentId already exists
            return false
          }
          uniqueFollowNotifications.add(key)
        }
        return true
      })

      console.log(filteredNotifications)

      return {
        ...state,
        notifications: filteredNotifications,
        unread: filteredNotifications.filter((notification) => !notification.read).length
      }

    case 'SET_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((notification) => {
          if (notification._id === action.payload.notificationId) {
            return {
              ...notification,
              read: true
            }
          }
          return notification
        }),
        unread: state.notifications.filter((notification) => !notification.read).length - 1
      }

    default:
      return state
  }
}
