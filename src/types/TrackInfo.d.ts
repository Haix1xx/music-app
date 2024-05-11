export interface TrackInfo {
  _id: string
  title: string
  url: string
  coverPath: string
  releaseDate: string
  isPublic?: boolean
  duration: number
  totalStreams?: number
  album?: string
  artist: any
  collaborators?: string[]
  writtenBy?: string
  producedBy?: string
  source?: string
  copyRight?: string
  publishRight?: string
  track?: any
  genres?: any[]
}
