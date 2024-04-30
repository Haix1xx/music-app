import React, { useEffect } from 'react'
import {
  Box,
  Typography,
  Stack,
  List,
  ListItemAvatar,
  ListItem,
  Avatar,
  ListItemText,
  IconButton,
  CircularProgress
} from '@mui/material'
import useResponsive from '@/hooks/useResponsive'
import { Comment } from '@/types/comment'
import { timeSince } from '@/utils/changeDate'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import { usePosts } from '@/context/PostContext'
import { User } from '@/types/user'
import UserLikedList from '@/components/Posts/UserLikedList'

interface CommentCardProps {
  postId: string
  comment: Comment
  replyComment: (comment: Comment) => void
}

const CommentCard = ({ postId, comment, replyComment }: CommentCardProps) => {
  const isMobile = useResponsive('down', 'sm')
  const { postsState, postsDispatch } = usePosts()
  const [openReply, setOpenReply] = React.useState(false)
  const [liked, setLiked] = React.useState(comment.isLiked || false)
  const axiosPrivate = useAxiosPrivate()
  const [page, setPage] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [openUserLikeList, setOpenUserLikeList] = React.useState(false)

  const handleLike = async () => {
    try {
      if (!liked) {
        setLiked(true)
        comment.numLikes++
        comment.isLiked = true
        await axiosPrivate.post(UrlConfig.comments.likeComment(comment._id))
      } else {
        setLiked(false)
        comment.numLikes--
        comment.isLiked = false
        await axiosPrivate.delete(UrlConfig.comments.unlikeComment(comment._id))
      }
    } catch (err) {}
  }
  const getReplyComments = async () => {
    try {
      setLoading(true)
      const res = await axiosPrivate.get(
        `${UrlConfig.comments.getReplyComments(comment.post, comment._id, page)}?limit=5&page=${page}`
      )
      const comments = res.data.data as Comment[]
      postsDispatch({
        type: 'ADD_REPLY_COMMENTS',
        payload: {
          postId,
          commentId: comment._id,
          comments
        }
      })
      setPage((prev) => prev + 1)
      setLoading(false)
    } catch (err) {
      // Handle errors
    }
  }

  async function fetchUsersLikeComment(currentPage = 1) {
    try {
      if (openUserLikeList) {
        const response = await axiosPrivate.get(
          `${UrlConfig.comments.getUsersLikedComment(comment._id)}?limit=10&page=${currentPage}`
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

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <UserLikedList
        open={openUserLikeList}
        handleClose={() => setOpenUserLikeList(false)}
        // @ts-ignore
        propFetchMoreData={fetchUsersLikeComment}
      />
      <ListItem
        alignItems='flex-start'
        sx={{ paddingTop: '0px !important', paddingBottom: '0px !important', paddingRight: '0px !important' }}
      >
        <ListItemAvatar>
          <Avatar alt='Remy Sharp' src={comment.user.profile?.avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Stack direction={'row'} sx={{ alignItems: 'center', marginTop: '3px' }}>
              <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                {comment.user.profile?.firstname + ' ' + comment.user.profile?.lastname}
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(0, 0, 0, 0.50)',
                  fontSize: isMobile ? '10px' : '12px',
                  fontWeight: 400,
                  marginLeft: '7px'
                }}
              >
                @{comment.user.profile?.slug}
              </Typography>
            </Stack>
          }
          secondary={
            <>
              <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ width: '90%' }}>
                  <Box
                    sx={{
                      margin: isMobile ? '5px 0' : '5px 0',
                      fontSize: isMobile ? '13px' : '14px',
                      width: '90%'
                    }}
                  >
                    {comment.content.split(' ').map((word, index) => {
                      if (word.startsWith('@')) {
                        return (
                          <span key={index} style={{ color: 'blue' }}>
                            {word + ' '}
                          </span>
                        )
                      }
                      return word + ' '
                    })}
                  </Box>
                  <Stack direction={'row'} gap={2}>
                    <Typography
                      sx={{
                        color: 'rgba(0, 0, 0, 0.50)',
                        fontSize: isMobile ? '13px' : '13px',
                        fontWeight: 600,
                        wordWrap: 'break-word',
                        cursor: 'pointer'
                      }}
                    >
                      {timeSince(new Date(comment.createdAt))}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(0, 0, 0, 0.50)',
                        fontSize: isMobile ? '13px' : '13px',
                        fontWeight: 600,
                        wordWrap: 'break-word',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setOpenUserLikeList(true)
                      }}
                    >
                      {comment.numLikes} {comment.numLikes > 1 ? 'likes' : 'like'}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(0, 0, 0, 0.50)',
                        fontSize: isMobile ? '13px' : '13px',
                        fontWeight: 600,
                        wordWrap: 'break-word',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        //get the root comment
                        replyComment(comment)
                      }}
                    >
                      Reply
                    </Typography>
                  </Stack>
                </Box>
                <IconButton
                  sx={{ marginLeft: 'auto' }}
                  onClick={() => {
                    handleLike()
                  }}
                >
                  {liked ? (
                    <FavoriteRoundedIcon color='secondary' fontSize='small' />
                  ) : (
                    <FavoriteBorderRoundedIcon color='secondary' fontSize='small' />
                  )}
                </IconButton>
              </Stack>
              {comment.numReplies > 0 && (
                <Box className='comments-child' sx={{ marginTop: '13px' }}>
                  <Typography
                    sx={{
                      color: 'rgba(0, 0, 0, 0.50)',
                      fontSize: isMobile ? '13px' : '13px',
                      fontWeight: 600,
                      wordWrap: 'break-word',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      if (!openReply) {
                        setOpenReply(true)
                        if (!comment.children && !loading) {
                          getReplyComments()
                        } else if (comment?.children?.length === 0 && !loading) {
                          getReplyComments()
                        }
                      } else {
                        setOpenReply(false)
                      }
                    }}
                  >
                    {!openReply
                      ? `____   View replies (${comment.numReplies})`
                      : !loading
                      ? `____   Hide replies`
                      : `____   View replies (${comment.numReplies})`}
                    {loading && <CircularProgress size={13} sx={{ marginLeft: '20px' }} />}
                  </Typography>
                  {openReply && (
                    <>
                      {comment.children?.map((childComment) => (
                        <CommentCard
                          key={childComment._id}
                          comment={childComment}
                          replyComment={replyComment}
                          postId={postId}
                        />
                      ))}
                      {/* {!endOfPage && comment?.children?.length && comment.children.length >= 3 && ( */}
                      {comment.children?.length && comment.numReplies > comment.children?.length && (
                        <Stack direction={'row'} sx={{ alignItems: 'center', marginLeft: '20px', marginTop: '5px' }}>
                          <Typography
                            onClick={() => getReplyComments()}
                            sx={{
                              color: 'rgba(0, 0, 0, 0.50)',
                              fontSize: isMobile ? '13px' : '13px',
                              fontWeight: 600,
                              wordWrap: 'break-word',
                              cursor: 'pointer'
                            }}
                          >
                            Show more
                          </Typography>
                          {loading && <CircularProgress size={13} sx={{ marginLeft: '20px' }} />}
                        </Stack>
                      )}
                    </>
                  )}
                </Box>
              )}
            </>
          }
        />
      </ListItem>
    </List>
  )
}

export default CommentCard
