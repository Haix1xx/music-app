import useResponsive from '@/hooks/useResponsive'
import { timeSince } from '@/utils/changeDate'
import { Avatar, Box, Stack, Typography } from '@mui/material'
import HashtagWrapper from '@/components/common/HashtagWrapper'
import React from 'react'
import { Post } from '@/types/post'
import UrlConfig from '@/config/urlConfig'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { usePosts } from '@/context/PostContext'
import PostDetail from '@/components/Posts/PostDetail'

interface ReplyPostCardProps {
  post: Post
}

const ReplyPostCard = ({ post }: ReplyPostCardProps) => {
  const isMobile = useResponsive('down', 'sm')
  const [open, setOpen] = React.useState(false)
  const axiosPrivate = useAxiosPrivate()
  const [liked, setLiked] = React.useState(post.isLiked || false)

  const handleLike = async () => {
    try {
      if (!liked) {
        setLiked(true)
        post.isLiked = true
        await axiosPrivate.post(UrlConfig.posts.likePost(post._id))
      } else {
        setLiked(false)
        post.isLiked = false
        await axiosPrivate.delete(UrlConfig.posts.unlikePost(post._id))
      }
    } catch (err) {}
  }
  console.log(open)
  const content =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  return (
    <Box
      sx={{ border: '1px solid #cdc6c6', padding: '15px', borderRadius: '15px', marginTop: '15px' }}
      onClick={() => setOpen(true)}
    >
      <PostDetail
        key={post._id}
        post={post}
        open={open}
        handleClose={() => {
          setOpen(false)
          console.log('close')
        }}
        handleLike={handleLike}
      />
      <Stack
        direction={'row'}
        sx={{ alignItems: 'center', marginTop: '3px', cursor: 'pointer' }}
        //   onClick={() => redirectToProfile()
      >
        <Avatar
          sx={{ width: isMobile ? '45px' : '30px', height: isMobile ? '45px' : '30px', marginRight: '10px' }}
          src={post.user.profile?.avatar}
        ></Avatar>
        <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold', fontSize: '16px' }}>
          {post.user.profile?.firstname + ' ' + post.user.profile?.lastname}
        </Typography>
        <Typography
          sx={{
            color: 'rgba(0, 0, 0, 0.50)',
            fontSize: isMobile ? '10px' : '14px',
            fontWeight: 400,
            marginLeft: '7px'
          }}
        >
          @{post.user.profile?.slug}
        </Typography>
        <Box
          sx={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            marginLeft: '15px',
            backgroundColor: 'rgba(0, 0, 0, 0.50)'
          }}
        ></Box>
        <Typography
          sx={{
            color: 'rgba(0, 0, 0, 0.50)',
            fontSize: isMobile ? '13px' : '13px',
            fontWeight: 400,
            wordWrap: 'break-word',
            marginLeft: '15px'
          }}
        >
          {timeSince(new Date(post.createdAt))}
        </Typography>
      </Stack>
      <Stack direction={'row'} sx={{ marginTop: '10px', cursor: 'pointer' }} gap={'15px'}>
        <Box sx={{ width: '15%' }}>
          <img src={post?.images?.[0]} alt='' style={{ width: '100%', height: '100%', borderRadius: '15px' }} />
        </Box>
        <Box sx={{ width: '85%' }}>
          <Typography sx={{ fontSize: '16px' }}>
            {/* {post.user.profile?.firstname + ' ' + post.user.profile?.lastname} */}
            {`Replying to @${post.user.profile?.slug}`}
          </Typography>
          <Box
            sx={{
              margin: isMobile ? '5px 0' : '10px 0',
              fontSize: isMobile ? '12px' : '14px',
              overflow: 'hidden',
              maxHeight: '80px', // Set the maximum height for the text container
              whiteSpace: 'pre-line', // Preserve line breaks within the text
              textOverflow: 'ellipsis'
            }}
          >
            {post.content && <HashtagWrapper text={post.content} length={200} />}
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}

export default ReplyPostCard
