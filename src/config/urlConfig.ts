const UrlConfig: any = {
  admin: {
    getOverview: (year: number) => `/api/v1/users/overview/${year}`,
    overview: `/api/v1/overview`,
    topTracks: `/api/v1/overview/top-tracks`,
    getAllReports: `/api/v1/reports/getAllReports`,
    reportProcessing: `/api/v1/reports/reportProcessing`,
    getAllUsers: `/api/v1/users`,
    getBusinessRequest: `/api/v1/users/business/requests`,
    rejectBusinessRequest: `/api/v1/users/business/reject`,
    sendApprovalRequest: `/api/v1/users/business/approve`,
    cancelApprovalRequest: `/api/v1/users/business/cancel`,
    lockOrUnlockAccount: (userId: string) => `/api/v1/users/lockOrUnlockAccount/${userId}`,
    getRevenue: `/api/v1/transactions/revenue`
  },
  artist: {
    signup: `/api/v1/users/artists/signup`,
    tracks: `/api/v1/tracks`,
    overview: `/api/v1/overview/artists`,
    topTracks: (limit: number = 10, page: number = 1) =>
      `/api/v1/overview/artists/top-tracks?limit=${limit}&page=${page}`
  },
  common: {
    tracks: `/api/v1/tracks`,
    track: (id: string) => `/api/v1/tracks/${id}`,
    artists: `/api/v1/artists`,
    artist: (id: string) => `/api/v1/artists/${id}`,
    genres: `/api/v1/genres`,
    genre: (id: string) => `/api/v1/genres/${id}`,
    albums: `/api/v1/albums`,
    fplaylists: `/api/v1/f-playlists`,
    fplaylist: (id: string) => `/api/v1/f-playlists/${id}`,
    getTrack: (id: string) => `/api/v1/tracks/${id}`,
    getAlbum: (id: string) => `/api/v1/albums/${id}`,
    albumAndTracks: (id: string) => `/api/v1/albums/${id}/tracks`,
    playlistAndTracks: (id: string) => `/api/v1/f-playlists/${id}/tracks`,
    getGenresById: (genreId: string) => `/api/v1/genres/${genreId}`,
    getTracksByArtist: (artistId: string, limit: number = 5, page: number = 1) =>
      `/api/v1/artists/${artistId}/tracks?limit=${limit}&page=${page}`,
    getAlbumsByArtist: (artistId: string, limit: number = 5, page: number = 1) =>
      `/api/v1/artists/${artistId}/albums?limit=${limit}&page=${page}`,
    getSinglesByArtist: (artistId: string, limit: number = 5, page: number = 1) =>
      `/api/v1/artists/${artistId}/singles?limit=${limit}&page=${page}`,
    search: (q: string, type: string = 'all', limit: number = 5, page: number = 1) =>
      `/api/v1/search?q=${q}&type=${type}&limit=${limit}&page=${page}`,
    chart: `/api/v1/charts`,
    getChart: (chartDate: string) => `/api/v1/charts/${chartDate}`,
    stream: `/api/v1/streams`
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
    createReport: `/api/v1/reports/createReport`
  },
  notifications: {
    getNotifications: `/api/v1/notifications`,
    markAsRead: `/api/v1/notifications`
  }
}

export default UrlConfig
