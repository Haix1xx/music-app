const UrlConfig: any = {
  admin: {
    getOverview: (year: number) => `/api/v1/users/overview/${year}`,
    getAllReports: `/api/v1/reports/getAllReports`,
    reportProcessing: `/api/v1/reports/reportProcessing`,
    getAllUsers: `/api/v1/users`,
    getBusinessRequest: `/api/v1/users/business/requests`,
    rejectBusinessRequest: `/api/v1/users/business/reject`,
    sendApprovalRequest: `/api/v1/users/business/approve`,
    cancelApprovalRequest: `/api/v1/users/business/cancel`,
    lockOrUnlockAccount: (userId: string) => `/api/v1/users/lockOrUnlockAccount/${userId}`,
    getTransactions: `/api/v1/transactions/all`,
    getRevenue: `/api/v1/transactions/revenue`
  },
  artist: {
    signup: `/api/v1/users/artists/signup`,
    tracks: `/api/v1/tracks`
  },
  common: {
    genres: `/api/v1/genres`,
    getGenresById: (genreId: string) => `/api/v1/genres/${genreId}`,
    getTracksByArtist: (artistId: string, limit: number = 5, page: number = 1) =>
      `/api/v1/artists/${artistId}/tracks?limit=${limit}&page=${page}`,
    getAlbumsByArtist: (artistId: string, limit: number = 5, page: number = 1) =>
      `/api/v1/artists/${artistId}/albums?limit=${limit}&page=${page}`
  },
  user: {
    login: `${process.env.NEXT_APP_BEEGIN_DOMAIN}/api/v1/users/login`,
    signup: `${process.env.NEXT_APP_BEEGIN_DOMAIN}/api/v1/users/signup`,
    refresh: `/api/v1/users/refresh`,
    forgotPassword: '/api/v1/users/forgotPassword'
  },
  me: {
    getMe: `/api/v1/users/me`,
    checkId: (id: string) => `/api/v1/users/checkId/${id}`,
    getMyNumberOfFollows: `/api/v1/follows/getMyNumberOfFollows`,
    getMyFollowerList: `/api/v1/follows/getMyFollowerList`,
    getMyFollowingList: `/api/v1/follows/getMyFollowingList`,
    isFollowing: `/api/v1/follows/isFollowing/:id`,
    unfollow: `/api/v1/follows/unfollow/:id`,
    followingOtherUser: `/api/v1/follows/followingOtherUser`,
    suggestFollow: `/api/v1/follows/suggestFollow`,
    updateProfile: `/api/v1/users/updateMe`,
    createReport: `/api/v1/reports/createReport`,
    isFollowingOtherUser: (id: string) => `/api/v1/follows/isFollowing/${id}`,
    unFollowOtherUser: (id: string) => `/api/v1/follows/unfollow/${id}`
  },
  otherUsers: {
    getProfileByID: `/api/v1/users/getProfileByID/:id`,
    getMyNumberOfFollows: `/api/v1/follows/getNumberOfFollows/:id`,
    getMyFollowerList: `/api/v1/follows/getAllFollowers/:id`,
    getMyFollowingList: `/api/v1/follows/getAllFollowings/:id`
  },
  posts: {
    createPost: `/api/v1/posts`,
    getPosts: `/api/v1/posts`,
    getComments: (postId: string) => `/api/v1/posts/${postId}/comments`,
    getMyPosts: `/api/v1/posts/me`,
    likePost: (postId: string) => `/api/v1/posts/${postId}/like`,
    unlikePost: (postId: string) => `/api/v1/posts/${postId}/like`,
    checkLikePost: (postId: string) => `/api/v1/posts/${postId}/like`,
    getPostByUserId: (userId: string) => `/api/v1/posts/getPostByUserId/${userId}`,
    deletePost: (postId: string) => `/api/v1/posts/${postId}`,
    update: (postId: string | undefined) => `/api/v1/posts/${postId}`,
    getUsersLikedPost: (postId: string) => `/api/v1/posts/${postId}/users/like`,
    getUsersSharedPost: (postId: string) => `/api/v1/posts/${postId}/users/share`
  },
  feeds: {
    getFeeds: `/api/v1/feed`
  },
  comments: {
    likeComment: (commentId: string) => `/api/v1/comments/${commentId}/like`,
    unlikeComment: (commentId: string) => `/api/v1/comments/${commentId}/like`,
    createComment: (postId: string) => `/api/v1/posts/${postId}/comments`,
    getReplyComments: (postId: string, commentId: string) => `/api/v1/posts/${postId}/comments/${commentId}`,
    getCommentById: (commentId: string) => `/api/v1/comments/id/${commentId}`,
    getUsersLikedComment: (commentId: string) => `/api/v1/comments/users/${commentId}`
  },
  categories: {
    getCategories: `/api/v1/categories`
  },
  messages: {
    getFriends: `/api/v1/messages/get-friends-and-recent-message`,
    getFriendMessages: `/api/v1/messages`,
    sendMessage: `/api/v1/messages`,
    deleteMessage: `/api/v1/messages`,
    updateMessageReaction: `/api/v1/messages`,
    getChatImages: `api/v1/messages/get-chat-images`
  },
  trending: {
    getTrendingHashtags: (limit: number = 5) => `/api/v1/trending/hashtags?limit=${limit}`,
    getTrendingPosts: (category: string) => `/api/v1/trending/posts?category=${category}`
  },
  search: {
    getPostsByHashtag: (hashtag: string | null, media: string = '', sort: string = '-createdAt', limit: number = 10) =>
      `/api/v1/search?hashtag=${hashtag}&media=${media}&sort=${sort}&limit=${limit}`,
    searchUsers: (q: string, limit: number | undefined = undefined) => `/api/v1/search/users?q=${q}&limit=${limit}`,
    searchPosts: (q: string, media: string | null = null, sort: string = '-createdAt', limit: number = 10) =>
      `/api/v1/search/posts?q=${q}&media=${media}&sort=${sort}&limit=${limit}`
  },
  bussiness: {
    createAdvertisement: `/api/v1/transactions/create_payment_url`,
    getUnitPrice: `/api/v1/prices`,
    signup: `${process.env.NEXT_APP_BEEGIN_DOMAIN}/api/v1/users/business/signup`
  },
  notifications: {
    getNotifications: `/api/v1/notifications`,
    markAsRead: `/api/v1/notifications`
  }
}

export default UrlConfig
