import { REQUEST_STATUS } from '@/common/requestStatus'
import { Chip } from '@mui/material'

interface RequestStatusLabelProps {
  status: string
}
export default function RequestStatusLabel({ status }: RequestStatusLabelProps) {
  switch (status) {
    case REQUEST_STATUS.APPROVED:
      return <Chip sx={{ width: '100px' }} color='success' label={REQUEST_STATUS.APPROVED.toUpperCase()} />
    case REQUEST_STATUS.REJECTED:
      return <Chip sx={{ width: '100px' }} color='error' label={REQUEST_STATUS.REJECTED.toUpperCase()} />
    default:
      return <Chip sx={{ width: '100px' }} label={REQUEST_STATUS.PENDING.toUpperCase()} />
  }
}
