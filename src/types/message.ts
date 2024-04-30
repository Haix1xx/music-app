export default interface Message {
    id: string
    fromSelf: boolean
    type: string
    content: string
    reaction: string
    status?: string
    createdAt: string
  }
  