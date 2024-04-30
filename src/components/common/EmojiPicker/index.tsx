import React from 'react'
import { IconButton, Popover } from '@mui/material'
import { useState } from 'react'
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined'
import Picker from 'emoji-picker-react'

interface EmojiPickerProps {
  content: string
  setContent: any
  sizeMedium: boolean
}

const EmojiPicker = ({ content, setContent, sizeMedium = false }: EmojiPickerProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const openAnchorEl = Boolean(anchorEl)
  const id = openAnchorEl ? 'simple-popover' : undefined
  const openPicker = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const onEmojiClick = (emojiObject: any, event: any) => {
    setContent((prevInput: string) => prevInput + emojiObject.emoji)
  }

  return (
    <>
      <IconButton aria-describedby={id} onClick={openPicker}>
        <EmojiEmotionsOutlinedIcon color='secondary' fontSize={sizeMedium ? 'medium' : 'large'} />
      </IconButton>
      <Popover
        id={id}
        open={openAnchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Picker onEmojiClick={onEmojiClick} />
      </Popover>
    </>
  )
}

export default EmojiPicker
