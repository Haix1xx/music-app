import React, { createContext, useContext, useState, useEffect, ReactNode, useReducer } from 'react'
import { NotifState, NotifAction } from './types'
import { notifReducer } from './notifReducer'

// Create the context
export interface NotificationContextType {
  notifsState: NotifState
  notifsDispatch: React.Dispatch<NotifAction>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Custom hook to access the context
export function useNotifications() {
  const context = useContext(NotificationContext)

  if (context === undefined) {
    throw new Error('useContext must be used within a PostProvider')
  }

  const { notifsState, notifsDispatch } = context

  return {
    notifsState,
    notifsDispatch
  }
}

// Create a provider component
interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const initialState: NotifState = {
    notifications: [],
    unread: 0
  }

  //@ts-ignore
  const [notifsState, notifsDispatch] = useReducer(notifReducer, initialState)

  const contextValues: NotificationContextType = {
    notifsState,
    notifsDispatch
  }

  return <NotificationContext.Provider value={contextValues}>{children}</NotificationContext.Provider>
}
