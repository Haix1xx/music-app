'use client'
import React, { useEffect, useRef } from 'react'
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal
} from '@mui/material'
import Slider from '@/components/Posts/ImageSlider'
import HeartIcon from '../common/HeartIcon'
import RootModal from '@/components/common/modals/RootModal'
import useResponsive from '@/hooks/useResponsive'
import { CardHeader, Avatar, Button, Typography, Stack, TextField } from '@mui/material'
import CommentCard from '@/components/Comment/CommentCard'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import ShareIcon from '@mui/icons-material/Share'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Post } from '@/types/post'
import { timeSince } from '@/utils/changeDate'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import urlConfig from '@/config/urlConfig'
import { Comment } from '@/types/comment'
import HashtagWrapper from '@/components/common/HashtagWrapper'
import EmojiPicker from '../common/EmojiPicker'
import _ from 'lodash'
import { usePosts } from '@/context/PostContext'
import CreatePost from './CreatePost'
import { useRouter } from 'next/navigation'
import UserLikedList from './UserLikedList'
import SharePostList from './SharePostList'
import { User } from '@/types/user'

// find the root of children comment
function findRootComment(comments: Comment[], comment: Comment | null | undefined): Comment | null {
  if (!comment) return null
  if (comment.parent) {
    const parentComment = comments.find((c) => c._id === comment.parent)
    if (parentComment) {
      return findRootComment(comments, parentComment)
    }
  }
  return comment
}

interface PostDetailProps {
  post: Post
  open: boolean
  postParent?: Post
  handleLike: () => void
  handleClose: () => void
}

const PostDetail = ({ post, open, handleClose, handleLike, postParent }: PostDetailProps) => {
  const { postsDispatch } = usePosts()
  const [newPost, setNewPost] = React.useState<Post | null>(null)
  const isMobile = useResponsive('down', 'sm')
  const hasImages = post.images?.length === 0 ? false : true
  const axiosPrivate = useAxiosPrivate()
  const [comment, setComment] = React.useState('')
  const [commentReply, setCommentReply] = React.useState<Comment>()
  const [page, setPage] = React.useState(2)
  const [loading, setLoading] = React.useState(false)
  const [repostOpen, setRepostOpen] = React.useState(false)
  const [isFollowing, setIsFollowing] = React.useState(post.isFollowing)
  const [openUserLikeList, setOpenUserLikeList] = React.useState(false)
  const [openSharePostList, setOpenSharePostList] = React.useState(false)

  const router = useRouter()

  const fetchComments = async () => {
    setLoading(true)
    const response = await axiosPrivate.get(`${urlConfig.posts.getComments(post._id)}?limit=10&page=${page}`)
    postsDispatch({
      type: 'ADD_MULTIPLE_COMMENTS',
      payload: {
        postId: post._id,
        comments: response.data.data,
        totalComments: response.data.total
      }
    })
    setPage(page + 1)
    setLoading(false)
  }

  const createComment = async () => {
    let response
    let rootComment
    try {
      if (!commentReply) {
        response = await axiosPrivate.post(urlConfig.comments.createComment(post._id), {
          content: comment
        })
      } else {
        rootComment = findRootComment(post.comments, commentReply)
        response = await axiosPrivate.post(urlConfig.comments.createComment(post._id), {
          content: comment,
          parent: rootComment?._id
        })
        setCommentReply(undefined)
      }

      const createdComment = response.data.data

      // @ts-ignore
      postsDispatch({
        type: 'ADD_COMMENT',
        // @ts-ignore
        payload: {
          postId: post._id,
          comment: createdComment,
          parentId: rootComment?._id
        }
      })
    } catch (error) {}
  }

  const handleFollow = async (event: any) => {
    event.stopPropagation()
    try {
      if (isFollowing) {
        setIsFollowing(false)
        await axiosPrivate.delete(urlConfig.me.unFollowOtherUser(post.user._id))
      } else {
        setIsFollowing(true)
        await axiosPrivate.post(urlConfig.me.followingOtherUser, { id: post.user._id })
      }
    } catch (error) {}
  }

  const navigateToProfile = (event: any) => {
    router.push(`/profile/${post.user._id}`)
  }

  const replyComment = (commentReply: Comment) => {
    setCommentReply(commentReply)
    if (commentReply.user.profile?.slug) setComment(`@${commentReply.user.profile?.slug} `)
    else setComment(`@${commentReply.user.profile?.firstname + commentReply.user.profile?.lastname} `)
  }

  async function fetchUserLikePost(currentPage = 1) {
    try {
      if (openUserLikeList) {
        const response = await axiosPrivate.get(
          `${urlConfig.posts.getUsersLikedPost(post._id)}?limit=10&page=${currentPage}`
        )
        const data = response.data.data as User[]
        const profile = data.map((user) => ({
          name: user.profile?.firstname + ' ' + user.profile?.lastname,
          username: user.profile?.slug,
          avatar: user.profile?.avatar
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
          `${urlConfig.posts.getUsersSharedPost(post._id)}?limit=10&page=${currentPage}`
        )
        const data = response.data.data as Post[]
        return data
      }
    } catch (error) {
      // Handle error
    }
  }

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       await fetchComments()
  //     } catch (error) {}
  //   }
  //   if (!post.comments) {
  //     fetchData()
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return (
    post && (
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
        <Modal open={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              //   width: isMobile ? '80vw' : width ? width : '100vw',
              width: isMobile ? '80%' : hasImages ? '80%' : '50%',
              height: isMobile ? '80%' : '90%',
              bgcolor: 'rgba(0, 0, 0, 1)',
              boxShadow: 24,
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
              {hasImages && (
                <Box sx={{ width: '55%', height: '100%' }}>
                  <Slider images={post.images ?? []} />
                </Box>
              )}
              <Box
                sx={{
                  width: hasImages ? '45%' : '100%',
                  height: '83%',
                  bgcolor: 'background.paper',
                  overflow: 'auto',
                  borderRadius: hasImages ? '0px 10px 10px 0px' : '10px'
                }}
                id='commentDiv'
              >
                <Box sx={{ overflow: 'auto', width: '100%', height: '93%', overflowX: 'hidden' }}>
                  <Stack
                    direction={'row'}
                    gap={isMobile ? 1 : 3}
                    sx={{ margin: '15px 0px 15px 15px', cursor: 'pointer' }}
                    onClick={navigateToProfile}
                  >
                    <Avatar
                      sx={{ width: isMobile ? '45px' : '40px', height: isMobile ? '45px' : '40px' }}
                      src={post.user?.profile?.avatar}
                    ></Avatar>
                    <Stack sx={{ width: '90%' }}>
                      <Box>
                        <Stack direction={'row'} sx={{ alignItems: 'center', marginTop: '3px' }}>
                          <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                            {post.user?.profile?.firstname + ' ' + post.user?.profile?.lastname}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'rgba(0, 0, 0, 0.50)',
                              fontSize: isMobile ? '10px' : '13px',
                              fontWeight: 400,
                              marginLeft: '7px'
                            }}
                          >
                            @{post.user?.profile?.slug}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'rgba(0, 0, 0, 0.50)',
                              fontSize: isMobile ? '13px' : '12px',
                              fontWeight: 400,
                              wordWrap: 'break-word',
                              marginLeft: '15px'
                            }}
                          >
                            {timeSince(new Date(post.createdAt))}
                          </Typography>
                          <Box
                            sx={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              marginLeft: '15px',
                              marginRight: '10px',
                              backgroundColor: 'rgba(0, 0, 0, 0.50)'
                            }}
                          ></Box>
                          <Stack
                            direction={'row'}
                            sx={{
                              alignItems: 'center',
                              overflow: 'scroll',
                              '&::-webkit-scrollbar': {
                                display: 'none'
                              }
                            }}
                          >
                            {post?.categories?.map((category: any, index: number) => (
                              <Chip
                                variant='outlined'
                                key={index}
                                label={category.name}
                                sx={{
                                  fontSize: isMobile ? '10px' : '12px',
                                  fontWeight: 600,
                                  borderRadius: '10px',
                                  padding: '2px 10px',
                                  margin: '0 10px'
                                }}
                                color='secondary'
                              />
                            ))}
                          </Stack>
                        </Stack>
                        <Box
                          sx={{
                            margin: isMobile ? '5px 0' : '10px 0',
                            fontSize: isMobile ? '13px' : '14px',
                            width: '90%'
                          }}
                        >
                          {post.content && <HashtagWrapper text={post.content} />}
                        </Box>
                      </Box>
                    </Stack>
                  </Stack>
                  <Divider variant='inset' />
                  <Box sx={{ paddingRight: '15px' }}>
                    {post?.comments?.map((comment: Comment, index: number) => (
                      <CommentCard key={comment._id} comment={comment} replyComment={replyComment} postId={post._id} />
                    ))}
                    {post.comments?.length < post.totalComments && (
                      <Stack direction={'row'} sx={{ alignItems: 'center', marginLeft: '20px', marginTop: '15px' }}>
                        <Typography
                          onClick={() => fetchComments()}
                          sx={{
                            fontWeight: 'bold',
                            verticalAlign: 'middle',
                            fontSize: '14px',
                            cursor: 'pointer',
                            opacity: 0.7
                          }}
                        >
                          Show more
                        </Typography>
                        {loading && <CircularProgress size={14} sx={{ marginLeft: '20px' }} />}
                      </Stack>
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{
                    position: 'fixed',
                    width: hasImages ? '45%' : '100%',
                    bottom: '0px', // Adjust the position as needed
                    zIndex: 999, // Adjust the z-index as needed
                    backgroundColor: 'white', // Background color
                    height: '190px',
                    borderTop: '1px solid #e8ebed',
                    borderRadius: '0px 0px 12px 0px'
                  }}
                >
                  <Stack
                    direction={'row'}
                    gap={isMobile ? 1 : 2}
                    sx={{
                      margin: isMobile ? '7px 0px 30px 0px' : '15px 10px 5px 10px',
                      alignItems: 'center'
                    }}
                  >
                    <Stack direction={'row'} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                      <IconButton
                        onClick={() => {
                          handleLike()
                        }}
                      >
                        {/* {post.isLiked ? (
                          <FavoriteRoundedIcon color='secondary' />
                        ) : (
                          <FavoriteBorderRoundedIcon color='secondary' />
                        )} */}
                        <HeartIcon isLiked={post.isLiked || false} handleLike={handleLike} />
                        {/* <FavoriteBorderRoundedIcon color='secondary' /> */}
                      </IconButton>
                      <Typography
                        component={'span'}
                        sx={{
                          marginLeft: isMobile ? '7px' : '5px',
                          fontWeight: 600,
                          fontSize: '13px',
                          cursor: 'pointer',
                          '&:hover': {
                            color: 'primary.main',
                            fontWeight: 600
                          }
                        }}
                        onClick={() => setOpenUserLikeList(true)}
                      >
                        {post.numLikes}
                      </Typography>
                    </Stack>
                    <Stack direction={'row'} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                      <IconButton>
                        <ChatBubbleOutlineIcon color='secondary' sx={{ fontSize: '26px' }} />
                      </IconButton>
                      <span style={{ marginLeft: isMobile ? '7px' : '5px', fontWeight: 600, fontSize: '13px' }}>
                        {post.numComments}
                      </span>
                    </Stack>
                    <Stack direction={'row'} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                      <IconButton
                        onClick={() => {
                          setRepostOpen(true)
                        }}
                      >
                        <ShareIcon color='secondary' />
                      </IconButton>
                      <Typography
                        component={'span'}
                        sx={{
                          marginLeft: isMobile ? '7px' : '5px',
                          fontWeight: 600,
                          fontSize: '13px',
                          cursor: 'pointer',
                          '&:hover': {
                            color: 'primary.main',
                            fontWeight: 600
                          }
                        }}
                        onClick={() => setOpenSharePostList(true)}
                      >
                        {post.numShares}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: isMobile ? '13px' : '15px',
                      fontWeight: 400,
                      opacity: 0.7,
                      marginTop: '10px',
                      wordWrap: 'break-word',
                      marginLeft: '25px'
                    }}
                  >
                    {timeSince(new Date(post.createdAt))}
                  </Typography>
                  <Box sx={{ padding: '0 13px', marginTop: '15px' }}>
                    <FormControl sx={{ width: '100%' }}>
                      <TextField
                        inputRef={(input) => input && input.focus()}
                        multiline
                        size='small'
                        variant='outlined'
                        placeholder='Write a comment...'
                        sx={{
                          '& fieldset': { border: 'none' },
                          '& .MuiInputBase-root': {
                            height: '60px',
                            maxHeight: '70px',
                            overflow: 'auto'
                          },
                          background: '#f8e5ee',
                          borderRadius: '10px',
                          marginBottom: '15px'
                        }}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            if (comment === '') return
                            createComment()
                            //clear input
                            setComment('')
                          }
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <EmojiPicker content={comment} setContent={setComment} sizeMedium={false} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </FormControl>
                    {/* <CustomTextfield /> */}
                  </Box>
                </Box>
              </Box>
            </Box>
            <IconButton
              sx={{ position: 'absolute', top: '-3%', right: hasImages ? '-10%' : '-47%' }}
              onClick={() => handleClose()}
            >
              <CloseRoundedIcon sx={{ color: 'white', fontSize: '25px' }} />
            </IconButton>
          </Box>
        </Modal>
      </>
    )
  )
}

export default PostDetail
