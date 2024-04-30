'use client'
import { Avatar, Box, Stack, Typography, Button, Modal, Grid, IconButton, Chip } from '@mui/material'
import { MoreVert } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import React, { useEffect, useRef, useState } from 'react'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import ShareIcon from '@mui/icons-material/Share'
import useResponsive from '@/hooks/useResponsive'
import UrlConfig from '@/config/urlConfig'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Post } from '@/types/post'
import { Comment } from '@/types/comment'
import { timeSince } from '@/utils/changeDate'
import PostDetail from './PostDetail'
import HashtagWrapper from '@/components/common/HashtagWrapper'
import { useRouter } from 'next/navigation'
import { usePosts } from '@/context/PostContext'
import CreatePost from './CreatePost'
import ReplyPostCard from './ReplyPostCard'
import Video from 'next-video'
import Popover from '@/components/common/Popover'
import { BiPencil } from 'react-icons/bi'
import { FaRegTrashAlt } from 'react-icons/fa'
import { FiEdit3 } from 'react-icons/fi'
import { useAuth } from '@/context/AuthContext'
import { FaRegFaceAngry } from 'react-icons/fa6'
import RootModal from '../common/modals/RootModal'
import useSnackbar from '@/context/snackbarContext'
import EditPost from './EditPost'
import UserLikedList from './UserLikedList'
import SharePostList from './SharePostList'
import { User } from '@/types/user'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import Snackbar from '@/components/common/Snackbar'
import HeartIcon from '@/components/common/HeartIcon'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import BusinessAvatar from '../common/Avatar/BusinessAvatar'

const ImageContainerStyled = styled('div')<{ number: number }>((props) => ({
  display: props.number === 0 ? 'none' : 'grid',
  gridGap: '5px',
  width: '100%',
  height: 'auto',
  cursor: 'pointer',
  gridTemplateColumns: props.number === 1 ? 'minmax(100%,1fr)' : 'repeat(2, 1fr)',
  gridTemplateRows: props.number === 1 ? 'repeat(1,1fr)' : props.number === 2 ? 'repeat(1, 390px)' : 'repeat(2, 300px)',
  '& img': {
    borderRadius: '12px',
    objectFit: 'cover',
    width: '100%',
    height: '100%'
  },
  '& .image-1': {
    gridArea: '1 / 1 / 2 / 2',
    maxHeight: '720px'
  },
  '& .image-2': {
    gridArea: props.number === 3 ? '1 / 2 / 3 / 3' : '1 / 2 / 2 / 3'
  },
  '& .image-3': {
    gridArea: props.number === 4 ? '2 / 1 / 3 / 2' : '2 / 1 / 3 / 2'
  },
  '& .image-4': {
    gridArea: '2 / 2 / 3 / 3'
  },
  '@media only screen and (max-width: 600px)': {
    gridGap: '2px',
    gridTemplateRows:
      props.number === 1 ? 'repeat(1,1fr)' : props.number === 2 ? 'repeat(1,170px)' : 'repeat(2, 100px)',
    '& img': {
      borderRadius: '8px',
      objectFit: 'cover'
    }
  },
  '.next-video-container': {
    height: '100%',
    maxHeight: '600px'
  },
  '.video-2': {
    height: props.number === 3 ? '605px' : '100%'
  }
}))

interface PostCardProps {
  post: Post
  isRepost?: boolean
  postParent?: Post
}

const PostCard = ({ post, isRepost, postParent }: PostCardProps) => {
  const [newPost, setNewPost] = useState<Post | null>(null)
  const { postsState, postsDispatch } = usePosts()
  const router = useRouter()
  const axiosPrivate = useAxiosPrivate()
  const isMobile = useResponsive('down', 'sm')
  const [open, setOpen] = useState(false)
  const [repostOpen, setRepostOpen] = useState(false)
  const [like, setLike] = useState<boolean>(post.isLiked ? true : false)
  const videoRef = useRef<any>()
  const { user } = useAuth()
  const [openUserLikeList, setOpenUserLikeList] = React.useState(false)
  const [openSharePostList, setOpenSharePostList] = React.useState(false)
  const queryClient = useQueryClient()

  const handleLike = async () => {
    try {
      if (!like) {
        setLike(true)
        post.isLiked = true
        post.numLikes++
        postsDispatch({
          type: 'SET_LIKED_POST',
          payload: {
            postId: post._id,
            isLiked: true
          }
        })
        await axiosPrivate.post(UrlConfig.posts.likePost(post._id))
      } else {
        setLike(false)
        post.isLiked = false
        post.numLikes--
        postsDispatch({
          type: 'SET_LIKED_POST',
          payload: {
            postId: post._id,
            isLiked: false
          }
        })
        await axiosPrivate.delete(UrlConfig.posts.unlikePost(post._id))
      }
    } catch (err) {}
  }

  const openPostDetail = async () => {
    videoRef.current?.pause()
    const commentResponse = await axiosPrivate.get(`${UrlConfig.posts.getComments(post._id)}?limit=10&page=1`)
    const comments = commentResponse.data.data as Comment[]
    const isFollowing = await axiosPrivate.get(UrlConfig.me.isFollowingOtherUser(post.user._id))
    postsDispatch({
      type: 'SELECT_POST',
      payload: { ...post, comments, totalComments: commentResponse.data.total, isFollowing: isFollowing.data.data }
    })
    setOpen(true)
  }
  const closePostDetail = () => {
    setOpen(false)
  }
  const redirectToProfile = async () => {
    try {
      const response = await axiosPrivate.get(UrlConfig.me.checkId(post.user._id))
      if (response.data.data) {
        router.push(`/profile`)
      } else {
        router.push(`/profile/${post.user._id}`)
      }
    } catch (error) {}
  }

  const { snack, setSnack } = useSnackbar()
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)

  const onDeleteBtnClick = () => {
    setOpenDeleteModal(true)
  }

  async function handleDeletePost() {
    const result = await axiosPrivate.delete(UrlConfig.posts.deletePost(post._id))
    queryClient.setQueryData(['categoryPosts'], (oldData: any) => {
      if (!oldData) return
      let updatedPosts = [...oldData]
      updatedPosts = updatedPosts.filter((item: any) => item._id !== post._id)
      return updatedPosts
    })
    postsDispatch({ type: 'DELETE_POST', payload: { postId: post._id } })
    if (result) {
      setOpenDeleteModal(false)
      setSnack({ open: true, message: 'Deleted post successfully', type: 'success' })
    }
  }

  async function fetchUserLikePost(currentPage = 1) {
    try {
      if (openUserLikeList) {
        const response = await axiosPrivate.get(
          `${UrlConfig.posts.getUsersLikedPost(post._id)}?limit=10&page=${currentPage}`
        )
        const data = response.data.data as User[]
        const profile = data.map((user) => ({
          _id: user._id,
          name: user.profile?.firstname + ' ' + user.profile?.lastname,
          username: user.profile?.slug,
          avatar: user.profile?.avatar,
          isFollowing: user.profile?.isFollowing
        }))
        return profile
      }
    } catch (error) {
      // Handle error
    }
  }

  async function fetchSharePostList(currentPage = 1) {
    try {
      if (openSharePostList) {
        const response = await axiosPrivate.get(
          `${UrlConfig.posts.getUsersSharedPost(post._id)}?limit=10&page=${currentPage}`
        )
        const data = response.data.data as Post[]
        return data
      }
    } catch (error) {
      // Handle error
    }
  }

  return (
    <>
      <UserLikedList
        open={openUserLikeList}
        handleClose={() => setOpenUserLikeList(false)}
        // @ts-ignore
        propFetchMoreData={fetchUserLikePost}
      />
      <SharePostList
        open={openSharePostList}
        handleClose={() => setOpenSharePostList(false)}
        // @ts-ignore
        propFetchMoreData={fetchSharePostList}
      />
      <Snackbar />
      <Modal open={repostOpen} onClose={() => setRepostOpen(false)}>
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
          <CreatePost
            open={repostOpen}
            setOpen={setRepostOpen}
            newPost={newPost}
            setNewPost={setNewPost}
            repost={postParent ? postParent : post}
          />
        </Box>
      </Modal>
      {postsState.selectedPost && (
        <PostDetail
          key={post._id}
          post={postsState.selectedPost}
          postParent={postParent}
          open={open}
          handleClose={closePostDetail}
          handleLike={handleLike}
        />
      )}
      <Grid
        container
        direction={isMobile ? 'column' : 'row'}
        spacing={isMobile ? 1 : 3}
        sx={{
          width: '100%',
          justifyContent: 'center',
          ...(isRepost && {
            border: '1px solid #dbd5d5',
            borderRadius: '12px',
            overflowX: 'hidden',
            width: '100%',
            marginTop: '10px',
            marginLeft: '0px !important',
            padding: '20px'
          })
        }}
      >
        <Grid
          item
          sx={{
            paddingLeft: '0px !important',
            display: 'flex',
            justifyContent: 'center',
            ...(isRepost && { display: 'none' })
          }}
          md={2}
        >
          <Avatar
            sx={{ width: isMobile ? '45px' : '60px', height: isMobile ? '45px' : '60px', cursor: 'pointer' }}
            src={post.user?.profile?.avatar}
            onClick={redirectToProfile}
          ></Avatar>
          {/* <BusinessAvatar avatar={post.user?.profile?.avatar} type={post.type} redirectToProfile={redirectToProfile} /> */}
        </Grid>
        <Grid
          item
          xs={!isMobile ? 8 : 12}
          md={isRepost ? 12 : 10}
          sx={{ paddingLeft: '0px !important', ...(isRepost && { paddingTop: '0px !important' }) }}
        >
          <Stack direction={'row'} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack
              direction={'row'}
              sx={{ alignItems: 'center', marginTop: '3px', cursor: 'pointer' }}
              onClick={() => redirectToProfile()}
            >
              {isRepost && (
                <Avatar
                  sx={{ width: isMobile ? '30px' : '45px', height: isMobile ? '30px' : '45px', marginRight: '10px' }}
                  src={post.user?.profile?.avatar}
                ></Avatar>
              )}
              <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                {post.user?.profile?.firstname + ' ' + post.user?.profile?.lastname}
              </Typography>
              {post.user.role == 'business' && (
                <VerifiedRoundedIcon
                  sx={{
                    fontSize: '22px',
                    marginLeft: '10px'
                    // position: 'absolute',
                    // bottom: '-2px',
                    // right: '-6px'
                  }}
                  color='secondary'
                />
              )}
              <Typography
                sx={{
                  color: 'rgba(0, 0, 0, 0.50)',
                  fontSize: isMobile ? '10px' : '14px',
                  fontWeight: 400,
                  marginLeft: '7px'
                }}
              >
                @{post.user?.profile?.slug}
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
                  marginLeft: '15px',
                  lineHeight: 1
                }}
              >
                {timeSince(new Date(post.createdAt))}
              </Typography>
              {post.type === 'advertisement' && (
                <Chip label='Sponsored' variant='outlined' color='secondary' sx={{ marginLeft: '15px' }} />
              )}
              {post.type === 'suggested' && (
                <Chip label='Suggested' variant='outlined' color='secondary' sx={{ marginLeft: '15px' }} />
              )}
            </Stack>
            <Popover
              icon={<MoreVert />}
              items={
                user?._id === post.user._id
                  ? [
                      { icon: <FiEdit3 />, content: 'Edit', onClickFunc: () => setOpenEditModal(true) },
                      { icon: <FaRegTrashAlt />, content: 'Delete', color: '#FF4842', onClickFunc: onDeleteBtnClick }
                    ]
                  : [{ icon: <FaRegFaceAngry />, content: 'Report' }]
              }
            />
          </Stack>
          <Box
            sx={{
              margin: isMobile ? '5px 0' : '10px 0',
              fontSize: isMobile ? '13px' : '18px',
              overflow: 'hidden',
              // minHeight: '50px',
              maxHeight: '80px', // Set the maximum height for the text container
              whiteSpace: 'pre-line', // Preserve line breaks within the text
              textOverflow: 'ellipsis',
              paddingRight: '20px'
            }}
          >
            {post.content && <HashtagWrapper text={post.content} length={200} />}
          </Box>
          <ImageContainerStyled number={post.images ? post.images.length : 0}>
            {post.images?.map((src, index) => {
              if (src && src.split('/')[4] === 'video') {
                return (
                  <Video
                    className={`video-${index + 1}`}
                    ref={videoRef}
                    key={index}
                    src={src}
                    autoPlay={false}
                    accentColor='#E078D8'
                  />
                )
              } else if (src.split('/')[4] === 'image') {
                return (
                  <img
                    onClick={openPostDetail}
                    className={`image-${index + 1}`}
                    src={src}
                    key={index}
                    alt='image'
                    loading='lazy'
                  />
                )
              } else {
                // Handle the case where src is undefined or null
                return null
              }
            })}
          </ImageContainerStyled>
          {post?.images?.length !== 0 && postParent && <ReplyPostCard post={postParent as Post} />}
          {post?.images?.length === 0 && postParent && <PostCard post={postParent as Post} isRepost={true} />}
          {!isRepost && (
            <Stack
              direction={'row'}
              sx={{
                margin: isMobile ? '7px 0px 30px 0px' : '15px 10px 30px 10px',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Button
                onClick={() => {
                  handleLike()
                }}
              >
                {/* {like ? <FavoriteRoundedIcon color='secondary' /> : <FavoriteBorderRoundedIcon color='secondary' />} */}
                <HeartIcon isLiked={like} handleLike={handleLike} />
                {/* <FavoriteBorderRoundedIcon color='secondary' /> */}
                <Typography
                  component={'span'}
                  sx={{
                    marginLeft: isMobile ? '7px' : '12px',
                    marginTop: '2px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'primary.main',
                      fontWeight: 600
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpenUserLikeList(true)
                  }}
                >
                  {post.numLikes}
                </Typography>
              </Button>

              <Button
                onClick={() => {
                  openPostDetail()
                }}
              >
                <ChatBubbleOutlineIcon color='secondary' sx={{ fontSize: '28px' }} />{' '}
                <span style={{ marginLeft: isMobile ? '7px' : '12px', fontWeight: 500 }}>{post.numComments}</span>
              </Button>
              <Button
                onClick={() => {
                  setRepostOpen(true)
                }}
              >
                <ShareIcon color='secondary' sx={{ fontSize: '28px' }} />
                <Typography
                  component={'span'}
                  sx={{
                    marginLeft: isMobile ? '7px' : '12px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'primary.main',
                      fontWeight: 600
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpenSharePostList(true)
                  }}
                >
                  {post.numShares}
                </Typography>
              </Button>
            </Stack>
          )}
        </Grid>
      </Grid>
      {openDeleteModal && (
        <RootModal
          variant='Delete'
          handleOk={handleDeletePost}
          handleClose={() => setOpenDeleteModal(false)}
          open={openDeleteModal}
          closeOnly={false}
          height={'auto'}
          width='500px'
        >
          <div>Are you sure you want to delete this post?</div>
        </RootModal>
      )}
      {openEditModal && <EditPost open={openEditModal} setOpen={setOpenEditModal} post={post} repost={postParent} />}
    </>
  )
}

export default PostCard
