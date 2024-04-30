'use client'
import React from 'react'
import useResponsive from '@/hooks/useResponsive'
import PostDetail from '@/components/Posts/PostDetail'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import { Post } from '@/types/post'
import { Comment } from '@/types/comment'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePosts } from '@/context/PostContext'
import Loader from '@/components/common/Loader/Loader'

const PostDetailPage = ({ params }: { params: { id: string } }) => {
  const isMobile = useResponsive('down', 'sm')
  const { postsState, postsDispatch } = usePosts()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [open, setOpen] = React.useState(true)
  const [loading, setLoading] = React.useState(true)
  const axiosPrivate = useAxiosPrivate()

  async function getPost() {
    setLoading(true)
    const response = await axiosPrivate.get(`${UrlConfig.posts.getPosts}/${params.id}`)
    const post = response.data.data as Post
    const commentResponse = await axiosPrivate.get(`${UrlConfig.posts.getComments(post._id)}?limit=10&page=1`)
    const comments = commentResponse.data.data as Comment[]

    // Check if commentID and parentId exist in searchParams
    const commentID = searchParams.get('commentId')
    console.log('commentID', commentID)
    const parentId = searchParams.get('parentCommentId')
    console.log(parentId)


    if (parentId) {
      // Check if the comment exists in the selectedPost
      const existingComment = comments.find((comment) => comment._id === parentId)
      if (!existingComment) {
        // If the comment doesn't exist, fetch it from the API
        const newParentCommentResponse = await axiosPrivate.get(`${UrlConfig.comments.getCommentById(parentId)}`)
        const newParentComment = newParentCommentResponse.data.data as Comment
        const commentResponse = await axiosPrivate.get(`${UrlConfig.comments.getCommentById(commentID)}`)
        const newCommentReply = commentResponse.data.data as Comment
        newParentComment?.children?.unshift(newCommentReply)
        comments?.unshift(newParentComment)
      }

      // Move the specified comment to the top
      const commentIndex = comments.findIndex((comment) => comment._id === commentID)
      if (commentIndex !== -1) {
        const [commentToMove] = comments?.splice(commentIndex, 1)
        comments?.unshift(commentToMove)
      }
    } else if (!parentId && commentID) {
      const existingComment = comments.find((comment) => comment._id === commentID)
      if (!existingComment) {
        // If the comment doesn't exist, fetch it from the API
        const commentResponse = await axiosPrivate.get(`${UrlConfig.comments.getCommentById(commentID)}`)
        const newComment = commentResponse.data.data as Comment
        comments?.unshift(newComment)
      }
      // Move the specified comment to the top
      const commentIndex = comments.findIndex((comment) => comment._id === commentID)
      if (commentIndex !== -1) {
        const [commentToMove] = comments?.splice(commentIndex, 1)
        comments?.unshift(commentToMove)
      }
    }

    postsDispatch({
      type: 'SELECT_POST',
      payload: { ...post, comments, totalComments: commentResponse.data.total }
    })
    setLoading(false)
  }
  const handleLike = async () => {
    if (!postsState.selectedPost) return
    if (postsState.selectedPost?.isLiked) {
      postsDispatch({ type: 'SET_LIKED_POST', payload: { postId: params.id, isLiked: false } })
      await axiosPrivate.post(UrlConfig.posts.likePost(postsState.selectedPost._id))
    } else {
      postsDispatch({ type: 'SET_LIKED_POST', payload: { postId: params.id, isLiked: true } })
      await axiosPrivate.post(UrlConfig.posts.unlikePost(postsState.selectedPost._id))
    }
  }

  const handleClose = () => {
    setOpen(false)
    router.back()
  }

  React.useEffect(() => {
    getPost()
  }, [])

  return loading ? (
    <Loader />
  ) : (
    postsState.selectedPost && (
      <>
        <title>Post | Beegin</title>
        <PostDetail open={true} post={postsState.selectedPost} handleLike={handleLike} handleClose={handleClose} />
      </>
    )
  )
}

export default PostDetailPage
