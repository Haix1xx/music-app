import { Comment } from './comment'
export interface Post {
  _feedId: string
  _id: string
  content: string
  images?: string[]
  imageVideo?: string
  categories?: any
  hashtags?: string[]
  user: any
  numLikes: number
  numComments: number
  numShares?: number
  createdAt: string
  isLiked?: boolean
  parent?: Post
  comments: Comment[]
  totalComments: number
  isFollowing?: boolean
  type?: string
}
