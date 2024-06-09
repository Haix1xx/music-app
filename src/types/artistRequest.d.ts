import { User } from './user'

export interface ArtistRequest {
  _id: string
  artist: User
  status: string
  createdAt: string
  updatedAt: string
}
