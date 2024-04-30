export interface Notification {
  _id: string
  recipient: string
  type: string
  actors: string[] | string
  image: string
  contentId: string
  subContentId: string | null
  read: boolean
  createdAt: string
  updatedAt: string
  populate: any
  content: string
}
