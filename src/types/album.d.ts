import { TrackInfo } from './TrackInfo'

export interface Album {
  _id: string
  title: string
  coverPath: string
  releaseDate: string
  isPublic: boolean
  duration: number
  artist: any
  tracks: TrackOrder[]
}

interface TrackOrder {
  order: number
  track: TrackInfo
}
