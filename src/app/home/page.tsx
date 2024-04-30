'use client'
import PostCard from '@/components/Posts/PostCard'
import { Box, Typography, Stack, TextField, Avatar, Modal } from '@mui/material'
import PostLayout from '@/layouts/PostLayout'
import useResponsive from '@/hooks/useResponsive'
import { Post } from '@/types/post'
import { Feed } from '@/types/feed'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useState } from 'react'
import urlConfig from '@/config/urlConfig'
import CreatePost from '@/components/Posts/CreatePost'
import { useAuth } from '@/context/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
import { useInfiniteQuery } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import PostSkeleton from '@/components/common/Skeleton/PostSkeleton'
import withAuth from '@/authorization/withAuth'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import { usePosts } from '@/context/PostContext'

function Home() {
  const isMobile = useResponsive('down', 'sm')
  const { postsState, postsDispatch } = usePosts()
  const [open, setOpen] = useState(false)
  const [newPost, setNewPost] = useState<Post | null>(null)
  const axios = useAxiosPrivate()
  const { user } = useAuth()
  async function fetchPosts({ pageParam }: { pageParam?: number }) {
    try {
      // Fetch posts
      const response = await axios.get(`${urlConfig.feeds.getFeeds}?limit=5&page=${pageParam}`)
      let feeds = response.data.data as Feed[]
      let { total } = response.data

      let posts = feeds.map((feed: Feed) => {
        return {
          ...feed.post,
          type: feed.type,
          _feedId: feed._id,
          comments: []
        }
      })
      postsDispatch({ type: 'ADD_MULTIPLE_POSTS', payload: posts })
      return {
        posts,
        total,
        prevPage: pageParam
      }
    } catch (error) {
      // Handle errors if necessary
    }
  }
  const { fetchNextPage, isFetching, hasNextPage } = useInfiniteQuery({
    queryKey: ['postsData'],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.prevPage === undefined) return undefined
      if (lastPage?.prevPage * 5 > lastPage?.total) {
        return undefined
      }
      return lastPage?.prevPage + 1
    },
    staleTime: 1000 * 60 * 15 // 10 minutes
  })

  // const postsData = data?.pages?.reduce<Post[]>((acc, page) => {
  //   //@ts-ignore
  //   return [...acc, ...page?.posts]
  // }, [])

  return (
    <>
      <title>Home | Beegin</title>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            //   width: isMobile ? '80vw' : width ? width : '100vw',
            width: isMobile ? '80%' : '40%',
            height: isMobile ? '80%' : '83%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            padding: isMobile ? 3 : '20px'
          }}
        >
          <CreatePost open={open} setOpen={setOpen} newPost={newPost} setNewPost={setNewPost} />
        </Box>
      </Modal>
      <PostLayout>
        <Box sx={{ overflowX: 'hidden', overflowY: 'hidden' }}></Box>

        <Box sx={{ overflowX: 'hidden', overflowY: 'hidden' }}>
          {/* <Typography variant='h4' sx={{ fontWeight: 'bold', color: 'black' }} onClick={() => fetchNextPage()}>
            Feeds
          </Typography> */}
          <Stack direction={'row'} sx={{ marginTop: '25px', marginLeft: '30px', justifyContent: 'center' }} spacing={2}>
            <Avatar src={user?.profile?.avatar} sx={{ width: 50, height: 50 }}></Avatar>
            <TextField
              size='small'
              variant='outlined'
              placeholder='What’s on your mind?'
              onClick={() => setOpen(true)}
              sx={{
                '& .MuiInputBase-root': {
                  height: '50px'
                },
                //   background: 'white',
                //   borderRadius: '10px',
                //   marginBottom: '15px',
                width: '700px'
              }}
            />
          </Stack>
          <InfiniteScroll
            dataLength={postsState.posts ? postsState.posts.length : 0}
            next={() => {
              fetchNextPage()
            }}
            hasMore={true}
            loader={<></>}
            endMessage={<div>No more posts</div>}
            scrollableTarget='scrollableDiv'
            style={{
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Box
              sx={{
                width: '74%',
                marginTop: '50px',
                overflowX: 'hidden'
              }}
            >
              {postsState?.posts?.map((post: Post, index: number) => {
                if (post && post.parent) {
                  return <PostCard key={post._feedId || index} post={post} postParent={post.parent} />
                } else if (post) {
                  return <PostCard key={post._feedId || index} post={post} />
                }
              })}
              {hasNextPage || isFetching ? (
                <>
                  <PostSkeleton />
                  <PostSkeleton />
                </>
              ) : (
                <></>
              )}
            </Box>
          </InfiniteScroll>
        </Box>
      </PostLayout>
    </>
  )
}

export default withAuth(Home)(['business', 'user'])
