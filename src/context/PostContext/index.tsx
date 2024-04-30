import React, { createContext, useContext, useState, useEffect, ReactNode, useReducer } from 'react'
import { PostState, PostAction } from './types'
import { postReducer } from './postReducer'

export enum ActionType {
  FETCH_POSTS = 'FETCH_POSTS',
  MARK_POST_AS_LIKED = 'MARK_POST_AS_LIKED',
  MARK_POST_AS_UNLIKED = 'MARK_POST_AS_UNLIKED'
}

// Create the context
export interface PostContextType {
  postsState: PostState
  postsDispatch: React.Dispatch<PostAction>
}

const PostContext = createContext<PostContextType | undefined>(undefined)

// Custom hook to access the context
export function usePosts() {
  const context = useContext(PostContext)

  if (context === undefined) {
    throw new Error('useContext must be used within a PostProvider')
  }

  const { postsState, postsDispatch } = context

  return {
    postsState,
    postsDispatch
  }
}

// Create a provider component
interface PostProviderProps {
  children: ReactNode
}

export function PostProvider({ children }: PostProviderProps) {
  const initialState: PostState = {
    posts: [],
    selectedPost: null,
    profile: {
      posts: [],
      totalPosts: undefined
    }
  }

  //@ts-ignore
  const [postsState, postsDispatch] = useReducer(postReducer, initialState)

  const contextValues: PostContextType = {
    postsState,
    postsDispatch
  }

  return <PostContext.Provider value={contextValues}>{children}</PostContext.Provider>
}
