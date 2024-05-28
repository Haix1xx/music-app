import { TrackInfo } from './TrackInfo'

export interface TrackChart {
  order: number
  totalStreams: number
  prevPosition: number
  peak: number
  track: TrackInfo
}

export default interface Chart {
  _id: string
  chartDate: string
  tracks: TrackChart[]
}
