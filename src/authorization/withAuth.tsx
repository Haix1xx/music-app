/* eslint-disable react/display-name */
'use client'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import LoadingScreen from '@/components/common/Loader/Loader'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useAuth } from '@/context/AuthContext'

const withAuth =
  //// eslint-disable-next-line react/display-name, react/display-name
  (Component: React.FC) => (allowedRole: string[]) => (props: any) => {
    const router = useRouter()
    const pathname = usePathname()
    const axios = useAxiosPrivate()
    const [isAllowed, setIsAllowed] = useState(false)
    const auth = useAuth()
    useEffect(() => {
      const role = auth?.user?.role ?? localStorage.getItem('role')
      //@ts-ignore
      if (allowedRole.includes(role)) {
        setIsAllowed(true)
      } else {
        setIsAllowed(false)
        router.push('/401')
      }
    }, [pathname, router, auth])

    //@ts-ignore
    return isAllowed ? <Component {...props} /> : <LoadingScreen />
  }

export default withAuth
