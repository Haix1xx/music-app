import { axiosPrivate } from '@/axios'
import { useEffect } from 'react'
import useRefreshToken from './useRefreshToken'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const useAxiosPrivate = () => {
  const refresh = useRefreshToken()
  const { accessToken, setAccessToken, setUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config: any) => {
        if (!config.headers['Authorization']) {
          if (localStorage.getItem('persist') && !accessToken) {
            const newAccesstoken = await refresh()
            config.headers['Authorization'] = `Bearer ${newAccesstoken}`
          } else {
            config.headers['Authorization'] = `Bearer ${accessToken}`
          }
        }
        return config
      },
      (error: any) => Promise.reject(error)
    )

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const prevRequest = error?.config
        if ((error?.response?.status === 403 || error?.response?.status === 401) && !prevRequest?.sent) {
          prevRequest.sent = true
          const newAccessToken = await refresh()
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return axiosPrivate(prevRequest)
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, refresh])

  return axiosPrivate
}

export default useAxiosPrivate
