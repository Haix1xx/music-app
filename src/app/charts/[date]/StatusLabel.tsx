import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import RemoveIcon from '@mui/icons-material/Remove'
import { Grid, Stack, Typography } from '@mui/material'
interface StatusLabelProps {
  curr: number
  prev: number
  peak: number
}

export default function StatusLabel({ curr, prev, peak }: StatusLabelProps) {
  let diff = prev - curr
  if (prev === -1) {
    diff = 0
  }

  if (peak === curr && prev === -1) {
    return (
      <Grid sx={{ backgroundColor: '#62c6fc', borderRadius: '10px', paddingX: '10px' }}>
        <Stack spacing={1} direction='row'>
          <Typography variant='h5'>NEW</Typography>
        </Stack>
      </Grid>
    )
  } else if (diff > 0) {
    return (
      <Grid sx={{ backgroundColor: '#9afcb1', borderRadius: '10px', paddingX: '10px' }}>
        <Stack spacing={1} direction='row'>
          <ArrowUpwardIcon fontSize='small' />
          <Typography variant='h5'>{diff}</Typography>
        </Stack>
      </Grid>
    )
  } else if (diff < 0) {
    return (
      <Grid sx={{ backgroundColor: '#e6a8a8', borderRadius: '10px', paddingX: '10px' }}>
        <Stack spacing={1} direction='row'>
          <ArrowDownwardIcon fontSize='small' />
          <Typography variant='h5'>{diff}</Typography>
        </Stack>
      </Grid>
    )
  } else {
    return (
      <Grid sx={{ backgroundColor: '#ebe3dd', borderRadius: '10px', paddingX: '10px' }}>
        <Stack spacing={1} direction='row'>
          <RemoveIcon fontSize='small' />
        </Stack>
      </Grid>
    )
  }
}
