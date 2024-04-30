import React, { useEffect, useState } from 'react'
import { CardHeader, Avatar, Box, Card } from '@mui/material'
import ButtonFollow from '../../components/ButtonFollow/ButtonFollow'
import { useRouter } from 'next/navigation'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import { useAuth } from '@/context/AuthContext'

export default function CardUser(props: any) {
  const { firstname, lastname, avatar, slug } = props.profile
  const { user } = useAuth()
  const router = useRouter()
  const axiosPrivate = useAxiosPrivate()
  const redirectToProfile = async () => {
    try {
      const response = await axiosPrivate.get(UrlConfig.me.checkId(props.userId))
      if (response.data.data) {
        router.push(`/profile`)
      } else {
        router.push(`/profile/${props.userId}`)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleDataFromChild = (data: string) => {}
  return (
    <Card sx={{ position: 'relative', padding: '0 20px !important', width: '100%', boxShadow: 0 }}>
      <CardHeader
        sx={{
          padding: '20px',
          cursor: 'pointer',
          '&:hover': {
            color: '#9747FF',
            fontWeight: 'bold'
          },
          '& .MuiCardHeader-action': {
            top: '11px',
            right: '10px',
            position: 'relative'
          }
        }}
        avatar={
          <Avatar
            src={avatar}
            sx={{ width: '60px', height: '60px', marginRight: '10px', cursor: 'pointer' }}
            onClick={() => redirectToProfile()}
          />
        }
        title={firstname + ' ' + lastname}
        subheader={slug !== '' ? `@${slug}` : `@username`}
        action={
          props.isVisible === true &&
          props.userId !== user?._id && (
            <ButtonFollow
              userId={props.userId}
              sendDataToParent={handleDataFromChild}
              status={props.status}
            ></ButtonFollow>
          )
        }
      />
    </Card>
  )
}
