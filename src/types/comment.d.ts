export interface Comment {
  _id: string
  content: string
  user: any
  post: string
  numLikes: number
  createdAt: string
  numReplies: number
  children?: Comment[]
  parent?: string
  isLiked?: boolean
  total: number
}
