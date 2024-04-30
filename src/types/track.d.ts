export interface Track {
  _id: string
  title: string | boolean
  url: string | boolean
  coverPath: string | boolean
  releaseDate?: string | boolean
  isPublic?: boolean
  duration?: number | boolean
  totalStreaam?: number | boolean
  album?: string | boolean
  artist: string | boolean
  collaborators?: string[] | boolean
  writtenBy?: string | boolean
  producedBy?: string | boolean
  source?: string | boolean
  copyRight?: string | boolean
  publishRight?: string | boolean
  track?: any
  genres?: any[]
}
