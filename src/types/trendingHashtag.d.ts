export interface TrendingHashtag {
  _id: string
  hashtag: {
    _id: string
    name: string
  }
  category: null | {
    _id: string
    name: string
  }
  count: number
}
