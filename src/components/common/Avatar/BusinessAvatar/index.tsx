import React from 'react'
import { Avatar, Badge, Box } from '@mui/material'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import useResponsive from '@/hooks/useResponsive'

interface BusinessAvatarProps {
  avatar: string
  type: string
  redirectToProfile: () => void
}

const BusinessAvatar = ({ avatar, type, redirectToProfile }: BusinessAvatarProps) => {
  const isMobile = useResponsive('down', 'sm')
  console.log(type)

  return (
    <>
      {type === 'advertisement' ? (
        <Box sx={{ position: 'relative', height: 'max-content' }}>
          <Avatar
            sx={{ width: isMobile ? '45px' : '60px', height: isMobile ? '45px' : '60px', cursor: 'pointer' }}
            src={avatar}
          ></Avatar>
          <VerifiedRoundedIcon
            sx={{
              fontSize: '24px',
              position: 'absolute',
              bottom: '-2px',
              right: '-6px'
            }}
            color='secondary'
          />
        </Box>
      ) : (
        <Avatar
          sx={{ width: isMobile ? '45px' : '60px', height: isMobile ? '45px' : '60px', cursor: 'pointer' }}
          src={avatar}
          onClick={redirectToProfile}
        />
      )}
    </>
  )
}

export default BusinessAvatar
