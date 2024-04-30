import { Box, Stack, Typography, Grid } from '@mui/material'
import TopicIcon from '@mui/icons-material/Topic'
import { Post } from '@/types/post'
import PostCard from '../Posts/PostCard'
interface TrendingPostCardProps {
  category: string
  posts: Post[]
}
export default function TrendingPostCard({ category, posts }: TrendingPostCardProps) {
  return (
    <Grid>
      <Typography variant='h3' sx={{ padding: '20px 0', color: 'black' }}>
        <TopicIcon color='secondary' sx={{ marginRight: '30px' }} fontSize='large' />
        {category}
      </Typography>
      <Stack sx={{ width: '74%' }}>
        {posts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}
      </Stack>
    </Grid>
  )
}
