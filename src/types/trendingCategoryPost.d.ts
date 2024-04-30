import { Category } from './category'
import { Post } from './post'

export interface TrendingCategoryPost {
  category: Category
  posts: Post[]
}
