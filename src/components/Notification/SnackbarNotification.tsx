// @mui
import { Alert, Snackbar } from '@mui/material'

// hooks
import React, { useContext } from 'react'

// contexts
import useSnackbar from '@/context/snackbarContext'
import Slide, { SlideProps } from '@mui/material/Slide'
import NotificationCard from './NotificationCard'
import { Notification } from '@/types/notification'

//----------------------------------------------------------------

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction='up' />
}

//----------------------------------------------------------------

interface SnackbarProps {
  notification: Notification
}

const SnackbarNotification = ({ notification }: SnackbarProps) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      open={true}
      autoHideDuration={5000}
      onClose={(event, reason) => {
        if (reason === 'clickaway') {
          return
        }
      }}
    >
      <NotificationCard notification={notification} />
    </Snackbar>
  )
}

export default SnackbarNotification
