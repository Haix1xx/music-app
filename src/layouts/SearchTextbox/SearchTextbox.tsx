import React from 'react'
import { useState } from 'react'
import { TextField, InputAdornment, FormControl, Box, Stack, Button, Typography } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { useRouter } from 'next/navigation'

export default function SearchTextbox() {
  const [searchText, setSearchText] = useState<string>('')
  const router = useRouter()
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchText !== '') {
      const q = encodeURIComponent(searchText)
      const url = `/search?q=${q}`
      router.push(url)
    }
  }

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length < 40) {
      setSearchText(event.target.value)
    }
  }
  return (
    <FormControl sx={{ width: '65%', justifyContent: 'center' }}>
      <TextField
        size='small'
        variant='outlined'
        placeholder='Search'
        sx={{
          marginLeft: '15px',
          '& .MuiInputBase-root': {
            height: '50px'
          },
          background: 'transparent',
          borderRadius: '10px'
          // marginBottom: '15px'
        }}
        //   onChange={handleChange}
        onChange={handleSearchTextChange}
        onKeyDown={handleKeyDown}
        value={searchText}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchRoundedIcon />
            </InputAdornment>
          )
        }}
      />
    </FormControl>
  )
}
