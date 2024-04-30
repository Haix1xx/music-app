
'use client'

import {
  Typography,
  Avatar,
  Box,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Button,
  Stack,
  Card,
  Paper,
  Slide,
  Menu
} from '@mui/material'
import {
  LockResetOutlined,
  Logout,
  PersonOutline,
  SensorOccupiedOutlined,
  ArrowBackIosNew,
  GTranslate,
  AccountCircle,
  ArrowForwardIos,
  Settings
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded'

// hooks
import { useState, useEffect, useRef, ReactNode, MouseEventHandler } from 'react'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/navigation'

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  width: '100%',
  borderRadius: '6px',
  padding: '10px 15px',
  minWidth: '220px'
}))

const Popover = ({ icon, items }: { icon: ReactNode, items: { icon: ReactNode, content: string, onClickFunc?: any, color?: string }[] }) => {
  const containerRef = useRef(null)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <div>
      <IconButton
        onClick={handleClick}
      >
        {icon}
      </IconButton>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        sx={{
          '& .MuiMenu-paper': {

            '@media (-webkit-device-pixel-ratio: 1.25)': {
              // left: '1500px !important'
            }
          }
        }}
      >

        <Stack sx={{ p: '0px' }}>
          {items.map(item =>
            <Box sx={{ padding: '0px 8px' }}>
              <StyledMenuItem onClick={() => { item.onClickFunc(); handleClose(); }}>
                <ListItemIcon sx={{ alignItems: 'center', color: item.color, minWidth: '32px!important' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText sx={{ '& span': { color: `${item.color} !important` } }}>{item.content}</ListItemText>
              </StyledMenuItem></Box>
          )}
        </Stack>
      </Menu>
    </div >
  )
}

export default Popover
