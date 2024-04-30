import { Post } from '@/types/post'
import { Comment } from '@/types/comment'

interface AddPostAction {
  type: 'ADD_POST'
  payload: Post
}

interface UpdatePostAction {
  type: 'UPDATE_POST'
  payload: Post
}

interface AddMultiplePostsAction {
  type: 'ADD_MULTIPLE_POSTS'
  payload: Post[]
}

interface AddMultipleCommentsAction {
  type: 'ADD_MULTIPLE_COMMENTS'
  payload: {
    postId: string
    comments: Comment[]
    totalComments: number
  }
}

interface AddReplyCommentsAction {
  type: 'ADD_REPLY_COMMENTS'
  payload: {
    postId: string
    commentId: string
    comments: Comment[]
  }
}

interface SetLikedPostsAction {
  type: 'SET_LIKED_POSTS'
  payload: {
    postId: string
    isLiked: boolean
  }
}

interface AddCommentAction {
  type: 'ADD_COMMENT'
  payload: {
    postId: string
    comment: Comment
    parentId: string
  }
}

interface SelectPostAction {
  type: 'SELECT_POST'
  payload: Post
}

interface DeletePostAction {
  type: 'DELETE_POST'
  payload: {
    postId: string
  }
}

export interface PostState {
  posts: Post[]
  selectedPost: Post | null
  profile: {
    posts: Post[]
    totalPosts: number | undefined
  }
}

interface SetPostsAction {
  type: 'SET_POSTS'
  payload: Post[]
}

interface SetLikedPostAction {
  type: 'SET_LIKED_POST'
  payload: {
    postId: string
    isLiked: boolean
  }
}

interface AddPostsInProfileAction {
  type: 'ADD_POSTS_IN_PROFILE'
  payload: {
    posts: Post[]
    totalPosts: number | undefined
  }
}

interface SetPostsProfileAction {
  type: 'SET_PROFILE_POSTS'
  payload: {
    posts: Post[]
    totalPosts: number | undefined
  }
}

export type PostAction =
  | SetPostsAction
  | AddPostAction
  | UpdatePostAction
  | SetLikedPostsAction
  | AddCommentAction
  | AddMultiplePostsAction
  | AddMultipleCommentsAction
  | AddReplyCommentsAction
  | SelectPostAction
  | SetLikedPostAction
  | DeletePostAction
  | AddPostsInProfileAction
  | SetPostsProfileAction
