'use client'
import './globals.css'
import '@/styles/typing.css'
import { Poppins } from 'next/font/google'
import ThemeProvider from '../theme'
import * as React from 'react'
import Layout from '@/layouts'
import { usePathname } from 'next/navigation'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { Snackbar } from '@mui/material'
import { SnackbarContextProvider } from '@/context/snackbarContext'
import { PostProvider } from '@/context/PostContext'
import { NotificationProvider } from '@/context/NotificationContext'
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import ArticleIcon from '@mui/icons-material/Article'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined'
import SummarizeIcon from '@mui/icons-material/Summarize'
import ContactPageIcon from '@mui/icons-material/ContactPage'
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined'
import { LibraryMusicOutlined, LibraryMusic, Dashboard, DashboardOutlined } from '@mui/icons-material'
import TanstackProvider from '@/providers/TanstackProvider'
import { FaHouseChimney, FaRegUser, FaUser, FaCircleUser, FaRegCircleUser } from 'react-icons/fa6'
import { FaCompass, FaRegCompass } from 'react-icons/fa'
import { BiSolidMessageSquareDetail } from 'react-icons/bi'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { AiOutlineHome, AiFillHome } from 'react-icons/ai'

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins'
})

const metadata = {
  title: 'Beegin',
  description: 'A new next generation social media application! Where your stories beegin.'
}
const menuItems = [
  {
    icon: <AiOutlineHome />,
    iconActive: <AiFillHome />,
    label: 'Home',
    path: '/home'
  },
  {
    icon: <FaRegCompass />,
    iconActive: <FaCompass />,
    label: 'Explore',
    path: '/explore'
  },
  {
    icon: <BiMessageSquareDetail />,
    iconActive: <BiSolidMessageSquareDetail />,
    label: 'Messages',
    path: '/messages'
  },
  {
    icon: <FaRegCircleUser />,
    iconActive: <FaCircleUser />,
    label: 'Profile',
    path: '/profile'
  }
  // {
  //   icon: <SettingsOutlined />,
  //   iconActive: <SettingsRoundedIcon />,
  //   label: 'Settings',
  //   path: '/settings'
  // }
]

const menuAdminItems = [
  {
    icon: <AnalyticsOutlinedIcon />,
    iconActive: <AnalyticsIcon />,
    label: 'Overview',
    path: '/admin/overview'
  },
  {
    icon: <ArticleOutlinedIcon />,
    iconActive: <ArticleIcon />,
    label: 'Reports',
    path: '/admin/reports'
  },
  {
    icon: <PeopleOutlineOutlinedIcon />,
    iconActive: <PeopleAltIcon />,
    label: 'User Management',
    path: '/admin/user-management'
  },
  {
    icon: <ContactPageOutlinedIcon />,
    iconActive: <ContactPageIcon />,
    label: 'Business Management',
    path: '/admin/business-management'
  },
  {
    icon: <SummarizeOutlinedIcon />,
    iconActive: <SummarizeIcon />,
    label: 'Advertisements',
    path: '/admin/advertisements'
  }
]

const menuBusinessItems = [
  {
    icon: <AnalyticsOutlinedIcon />,
    iconActive: <AnalyticsIcon />,
    label: 'Analytics',
    path: '/business/analytics'
  },
  {
    icon: <ArticleOutlinedIcon />,
    iconActive: <ArticleIcon />,
    label: 'Transactions',
    path: '/business/transactions'
  },
  {
    icon: <SummarizeOutlinedIcon />,
    iconActive: <SummarizeIcon />,
    label: 'Advertisements',
    path: '/business/advertisement'
  },
  {
    icon: <BiMessageSquareDetail />,
    iconActive: <BiSolidMessageSquareDetail />,
    label: 'Messages',
    path: '/messages'
  },
  {
    icon: <FaRegCircleUser />,
    iconActive: <FaCircleUser />,
    label: 'Profile',
    path: '/profile'
  }
]

const menuArtistItems = [
  {
    icon: <DashboardOutlined />,
    iconActive: <Dashboard />,
    label: 'Dashboard',
    path: '/artist'
  },
  {
    icon: <LibraryMusicOutlined />,
    iconActive: <LibraryMusic />,
    label: 'Discography',
    path: '/artist/discography'
  }
]
export default function RootLayout({ children, session }: { children: React.ReactNode; session: any }) {
  const pathname = usePathname()
  const role = localStorage.getItem('role')
  const noLayoutPaths = ['/login', '/register', '/register/artist', '/register/personal', '/forgot-password']

  return (
    <html lang='en'>
      <head>
        <link rel='shortcut icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <meta name='description' content={metadata.description} />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={metadata.title} />
      </head>
      <body className={poppins.variable}>
        <AuthProvider>
          <TanstackProvider>
            <SnackbarContextProvider>
              <SessionProvider session={session}>
                <NotificationProvider>
                  <PostProvider>
                    {noLayoutPaths.includes(pathname) || pathname.startsWith('/verify') ? (
                      <ThemeProvider>{children}</ThemeProvider>
                    ) : (
                      <ThemeProvider>
                        {role === 'admin' ? (
                          <Layout menuItems={menuAdminItems}>{children}</Layout>
                        ) : role === 'business' ? (
                          <Layout menuItems={menuBusinessItems}>{children}</Layout>
                        ) : role === 'artist' ? (
                          <Layout menuItems={menuArtistItems}>{children}</Layout>
                        ) : (
                          <Layout menuItems={menuItems}>{children}</Layout>
                        )}
                      </ThemeProvider>
                    )}
                  </PostProvider>
                </NotificationProvider>
              </SessionProvider>
            </SnackbarContextProvider>
          </TanstackProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
