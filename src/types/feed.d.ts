import { Post } from './post'

export interface Feed {
  _id: string
  post: Post
  seen: boolean
  type: string
  isLiked: boolean
  createdAt: string
}
