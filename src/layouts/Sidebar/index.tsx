import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/assets/logo.png'
import { Box, Button, Stack, Typography, styled } from '@mui/material'
import { usePathname } from 'next/navigation'
import { Poppins } from 'next/font/google'
import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material'
import useResponsive from '@/hooks/useResponsive'
import { theme } from '@/theme'
import AvatarCard from '@/components/common/AvatarCard'
import { useAuth } from '@/context/AuthContext'

const StyledSidebar = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '310px',
  // paddingLeft: '10px',
  backgroundColor: '#fff'
}))

// Define StyledLinkBox with conditional styles
const StyledLinkBox = styled('div')<{ isActive: boolean }>(({ theme, ...props }) => ({
  backgroundColor: props.isActive ? theme.palette.primary.dark : '#fff',
  width: '100%',
  padding: '15px 0',
  opacity: 0.7,
  '& a': {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center'
  },
  transition: 'background-color 0.3s ease-in-out', // Smooth background color transition on hover
  '&:hover': {
    backdropFilter: 'blur(4px)', // Use 'backdropFilter' with a CSS value
    boxShadow: '-2px 5px 13px rgba(0, 0, 0, 0.06)',
    opacity: 0.9,
    transition: 'background-color 0.3s ease-in-out' // Smooth background color transition on hover
  },
  // Conditional styles based on isActive
  ...(props.isActive && {
    backdropFilter: 'blur(4px)',
    boxShadow: '-2px 5px 8px rgba(0, 0, 0, 0.06)',
    transition: 'background-color 0.5s ease-in-out',
    opacity: 1
  })
}))

const StyledStack = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: '35px'
}))

const StyledIconBox = styled('div')<{ isActive: boolean }>(({ theme, isActive }) => ({
  marginRight: '20px',
  '& svg': {
    fontSize: '28px',
    opacity: isActive ? 1 : 0.7,
    color: theme.palette.common.black,
    transition: 'opacity 0.3s, color 0.3s' // Add a transition for smoother changes
  }
}))

interface SidebarProps {
  menuItems: any
}
const Sidebar = ({ menuItems }: SidebarProps) => {
  const pathname = usePathname() // Get the current route from the router
  const isMobile = useResponsive('down', 'sm') // Get the current breakpoint from the theme (see below)

  const { user } = useAuth()

  const isLinkActive = (path: String) => {
    return path === pathname
  }
  return (
    <>
      {!isMobile ? (
        <StyledSidebar>
          <Box
            sx={{ padding: '20px 0', height: '15%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Image src={logo} alt='logo' width={130} style={{ margin: 'auto' }} />
          </Box>
          <Stack sx={{ justifyContent: 'space-between', height: '85%' }}>
            <Box>
              <Typography
                variant='h4'
                sx={{ fontWeight: 'bold', marginTop: '20px', marginLeft: '32px', color: 'black' }}
              >
                Menu
              </Typography>
              <Stack direction='column' spacing={1} sx={{ marginTop: '25px', width: '100%' }}>
                {menuItems.map((item: any) => (
                  <StyledLinkBox key={item.path} isActive={isLinkActive(item.path)}>
                    <Link href={item.path}>
                      <StyledStack>
                        <StyledIconBox isActive={isLinkActive(item.path)}>
                          {
                            isLinkActive(item.path) ? item.iconActive : item.icon // Use the outlined icon
                          }
                        </StyledIconBox>
                        <Typography
                          color='common.black'
                          style={{
                            fontWeight: 'bold',
                            verticalAlign: 'middle',
                            opacity: isLinkActive(item.path) ? 1 : 0.7,
                            fontSize: '18px'
                          }}
                        >
                          {item.label}
                        </Typography>
                      </StyledStack>
                    </Link>
                  </StyledLinkBox>
                ))}
              </Stack>
            </Box>
            <Link style={{ margin: '10px 25px 20px 15px' }} href={'/profile'}>
              <Button sx={{ width: '100%' }}>
                <ListItem sx={{ paddingLeft: '10px' }}>
                  <AvatarCard
                    avatar={user ? user?.profile.avatar : null}
                    name={user?.profile.firstname + ' ' + user?.profile.lastname}
                    subtitle={user ? '@' + user?.profile.slug : null}
                    vertical={false}
                  />
                  {/* <ListItemAvatar>
                <Avatar></Avatar>
              </ListItemAvatar>
              <ListItemText primary={<span style={{ fontWeight: 'bold' }}>Morgan</span>} secondary='@morgan_jackson' /> */}
                </ListItem>
              </Button>
            </Link>
          </Stack>
        </StyledSidebar>
      ) : (
        <Stack
          direction='row'
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'fixed',
            zIndex: 999,
            bottom: '0',
            width: '100%',
            height: '64px',
            backgroundColor: '#fff',
            borderTop: '1px solid #ccc',
            boxShadow: '0px 0px 35px rgba(0, 0, 0, 0.40)',
            padding: '0 8px'
          }}
        >
          {menuItems.map((item: any) => (
            <Link key={item.path} href={item.path}>
              <StyledIconBox key={item.path} isActive={isLinkActive(item.path)}>
                {isLinkActive(item.path) ? item.iconActive : item.icon}
              </StyledIconBox>
            </Link>
          ))}
        </Stack>
      )}
    </>
  )
}

export default Sidebar
