'use client'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import withAuth from '@/authorization/withAuth'

function Home() {
  const { user } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/admin/overview')
    } else if (user?.role === 'artist') {
      router.push('/artist')
    }
  }, [user])

  return (
    <>
      <title>Home | MusicApp</title>
    </>
  )
}

export default withAuth(Home)(['admin', 'user', 'artist'])
