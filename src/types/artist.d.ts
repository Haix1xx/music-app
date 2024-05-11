import { User } from './user'

export interface Artist {
  _id: string
  firstname: string
  lastname: string
  gender: boolean
  avatar: string
  bio?: string
  images: string[]
  createdAt: string
  updatedAt: string
  displayname: string
  birthday?: string
  user: User
}

export interface ArtistProfile {
  _id: string
  firstname: string
  lastname: string
  gender: boolean
  avatar: string
  bio?: string
  images: string[]
  createdAt: string
  updatedAt: string
  displayname: string
  birthday?: string
  user: string
}
