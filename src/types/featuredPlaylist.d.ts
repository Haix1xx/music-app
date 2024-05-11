import { TrackInfo } from './TrackInfo'
export interface FeaturedPlaylist {
  _id: string
  title: string
  coverPath: string
  isPublic: boolean
  tracks: TrackOrder[]
  createdAt: string
  updatedAt: string
}

export interface TrackOrder {
  order: number
  track: TrackInfo
}
