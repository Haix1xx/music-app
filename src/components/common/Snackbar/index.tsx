// @mui
import { Alert, Snackbar } from '@mui/material'

// hooks
import React, { useContext } from 'react'

// contexts
import useSnackbar from '@/context/snackbarContext'
import Slide, { SlideProps } from '@mui/material/Slide'

//----------------------------------------------------------------

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction='up' />
}

//----------------------------------------------------------------

const CustomSnackbar = () => {
  const { snack, setSnack } = useSnackbar()
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      open={snack.open}
      autoHideDuration={3000}
      TransitionComponent={SlideTransition}
      onClose={(event, reason) => {
        if (reason === 'clickaway') {
          return
        }
        setSnack({ ...snack, open: false })
      }}
    >
      <Alert severity={snack.type} sx={{ width: '100%', boxShadow: (theme) => theme.shadows[4] }}>
        {snack.message}
      </Alert>
    </Snackbar>
  )
}

export default CustomSnackbar
