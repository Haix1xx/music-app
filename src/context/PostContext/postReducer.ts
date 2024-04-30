import { PostState, PostAction } from './types'
import { Post } from '@/types/post'
import { Comment } from '@/types/comment'

const addCommentToPost = (post: Post, comment: Comment, parentId: string) => {
  if (!parentId) {
    return {
      ...post,
      comments: [comment, ...post.comments],
      numComments: post.numComments + 1
    }
  } else {
    return {
      ...post,
      numComments: post.numComments + 1,
      comments: post.comments.map((parentComment) => {
        if (parentComment._id === parentId) {
          return {
            ...parentComment,
            numReplies: parentComment.numReplies + 1,
            children: [...(parentComment.children || []), comment]
          }
        } else {
          return parentComment
        }
      })
    }
  }
}

const addReplyCommentsToParentComment = (parentComment: Comment, commentId: string, comments: Comment[]) => {
  if (parentComment._id === commentId) {
    // Add the new reply comments to the parent comment
    const updatedParentComment = {
      ...parentComment,
      children: [...(parentComment.children || []), ...comments]
    }
    return updatedParentComment
  } else {
    return parentComment
  }
}

export const postReducer = (state: PostState, action: PostAction) => {
  switch (action.type) {
    case 'SELECT_POST': {
      return { ...state, selectedPost: action.payload }
    }
    case 'SET_POSTS': {
      return { ...state, posts: action.payload }
    }
    case 'SET_PROFILE_POSTS': {
      const { posts, totalPosts } = action.payload
      return { ...state, profile: { posts, totalPosts } }
    }
    case 'ADD_POSTS_IN_PROFILE': {
      const { posts, totalPosts } = action.payload
      return { ...state, profile: { posts: [...state.profile.posts, ...posts], totalPosts: totalPosts } }
    }
    case 'ADD_POST': {
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        profile: {
          ...state.profile,
          posts: [action.payload, ...state.profile.posts],
          totalPosts: state.profile.totalPosts ? state.profile.totalPosts + 1 : 1
        }
      }
    }
    case 'UPDATE_POST': {
      console.log(action.payload)
      return {
        ...state,
        posts: state.posts.map((item) => (item._id === action.payload._id ? action.payload : item)),
        profile: {
          ...state.profile,
          posts: state.profile.posts.map((item) => (item._id === action.payload._id ? action.payload : item))
        }
      }
    }
    case 'DELETE_POST': {
      return {
        ...state,
        posts: state.posts.filter((item) => item._id !== action.payload.postId),
        profile: {
          ...state.profile,
          posts: state.profile.posts.filter((item) => item._id !== action.payload.postId),
          totalPosts: state.profile.totalPosts ? state.profile.totalPosts - 1 : 0
        }
      }
    }
    case 'ADD_MULTIPLE_POSTS': {
      const { payload: multiplePosts } = action

      const updatedPosts = [...state.posts, ...multiplePosts]

      const uniquePostsSet = new Set(updatedPosts.map((post) => post._id))

      const uniquePostsArray = Array.from(uniquePostsSet)

      let uniquePosts = uniquePostsArray.map((postId) => updatedPosts.find((post) => post._id === postId))
      if (uniquePosts.length === state.posts.length) uniquePosts = [...uniquePosts, updatedPosts[0]]
      console.log(uniquePosts)

      return {
        ...state,
        posts: uniquePosts
      }
    }
    case 'ADD_MULTIPLE_COMMENTS': {
      const { postId, comments, totalComments } = action.payload
      return {
        ...state,
        selectedPost:
          state.selectedPost?._id === postId
            ? {
                ...state.selectedPost,
                comments: Array.from(new Set([...state.selectedPost.comments, ...comments])),
                totalComments
              }
            : state.selectedPost,
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: Array.from(new Set([...post.comments, ...comments])),
                totalComments
              }
            : post
        )
      }
    }
    case 'ADD_COMMENT': {
      const { postId, comment, parentId } = action.payload

      const updatedSelectedPost =
        state.selectedPost?._id === postId
          ? addCommentToPost(state.selectedPost, comment, parentId)
          : state.selectedPost

      const updatedPosts = state.posts.map((post) => {
        if (post._id === postId) {
          return addCommentToPost(post, comment, parentId)
        } else {
          return post
        }
      })

      return {
        ...state,
        selectedPost: updatedSelectedPost,
        posts: updatedPosts
      }
    }

    case 'ADD_REPLY_COMMENTS': {
      const { postId, commentId, comments } = action.payload

      const updatedSelectedPost = {
        ...state.selectedPost,
        comments: state.selectedPost?.comments.map((parentComment) =>
          addReplyCommentsToParentComment(parentComment, commentId, comments)
        )
      }

      const updatedPosts = state.posts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            comments: post.comments.map((parentComment) =>
              addReplyCommentsToParentComment(parentComment, commentId, comments)
            )
          }
        } else {
          return post
        }
      })

      return {
        ...state,
        selectedPost: updatedSelectedPost,
        posts: updatedPosts
      }
    }
    case 'SET_LIKED_POST': {
      const { postId, isLiked } = action.payload
      return {
        ...state,
        selectedPost:
          state.selectedPost?._id === postId
            ? {
                ...state.selectedPost,
                isLiked,
                numLikes: isLiked ? state.selectedPost.numLikes + 1 : state.selectedPost.numLikes - 1
              }
            : state.selectedPost
      }
    }
    default:
      throw new Error()
  }
}
