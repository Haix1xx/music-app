import { Avatar, Badge, Box } from '@mui/material'
import React from 'react'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded'
import ModeCommentRoundedIcon from '@mui/icons-material/ModeCommentRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'

interface CustomAvatarProps {
  image: string
  type: string
  read: boolean
}

function getIcon(type: string) {
  switch (type) {
    case 'like post':
    case 'like comment':
      return (
        <FavoriteRoundedIcon
          sx={{
            fontSize: '22px',
            position: 'absolute',
            bottom: '-2px',
            right: '-6px'
          }}
          color='secondary'
        />
      )
    case 'comment':
    case 'reply comment':
      return (
        <ModeCommentRoundedIcon
          sx={{
            fontSize: '22px',
            position: 'absolute',
            bottom: '-2px',
            right: '-6px'
          }}
          color='secondary'
        />
      )
    case 'follow':
      return (
        <Person2RoundedIcon
          sx={{
            fontSize: '22px',
            position: 'absolute',
            bottom: '-2px',
            right: '-6px'
          }}
          color='secondary'
        />
      )
    case 'share post':
      return (
        <ShareRoundedIcon
          sx={{
            fontSize: '22px',
            position: 'absolute',
            bottom: '-2px',
            right: '-6px'
          }}
          color='secondary'
        />
      )

    default:
      return <div></div>
  }
}

const CustomAvatar = ({ image, type, read }: CustomAvatarProps) => {
  console.log('type', type)
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {read ? (
        <Box sx={{ position: 'relative' }}>
          <Avatar sx={{ width: '50px', height: '50px' }} src={image}></Avatar>
          {getIcon(type)}
        </Box>
      ) : (
        <Badge
          variant='dot'
          color='secondary'
          overlap='circular'
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Avatar sx={{ width: '50px', height: '50px' }} src={image}></Avatar>
            {getIcon(type)}
          </Box>
        </Badge>
      )}
    </div>
  )
}

export default CustomAvatar
