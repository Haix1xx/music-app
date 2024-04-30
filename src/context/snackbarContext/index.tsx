// @mui
import { AlertColor } from '@mui/material/Alert/Alert'

// hooks
import { useState, useContext } from 'react'

// context
import { createContext } from 'react'

//----------------------------------------------------------------

type Snack = { open: boolean; type?: AlertColor; message: string }

let snack: Snack = { open: false, type: 'success', message: '' }

const SnackDefaultValue = {
  snack: snack,
  setSnack: (snack: Snack) => {}
}
export const SnackbarContext = createContext(SnackDefaultValue)

//----------------------------------------------------------------

export const SnackbarContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [snack, setSnack] = useState<Snack>(SnackDefaultValue.snack)
  return <SnackbarContext.Provider value={{ snack, setSnack }}>{children}</SnackbarContext.Provider>
}

export default function useSnackbar() {
  return useContext(SnackbarContext)
}
