import * as React from 'react'
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Stack from '@mui/material/Stack'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import { BusinessRequest } from '@/types/businessRequest'
interface MenuListProps {
  user: string | null
  request: string | null
  setRequests: (requestId: string, status: string) => void
}
export default function MenuListComposition({ user, request, setRequests }: MenuListProps) {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const axios = useAxiosPrivate()

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }
  const cancelRequest = async (event: Event | React.SyntheticEvent) => {
    try {
      if (user) {
        const response = await axios.post(UrlConfig.admin.cancelBusinessRequest, { id: user })
        const data = response.data
        if (data && request !== null) {
          setRequests(request, data.status)
        }
      }
    } catch (err) {
    } finally {
      handleClose(event)
    }
  }

  const rejectRequest = async (event: Event | React.SyntheticEvent) => {
    try {
      if (user) {
        const response = await axios.post(UrlConfig.admin.rejectBusinessRequest, { id: user })
        const data = response.data
        if (data && request !== null) {
          setRequests(request, data.status)
        }
      }
    } catch (err) {
    } finally {
      handleClose(event)
    }
  }

  const approveRequest = async (event: Event | React.SyntheticEvent) => {
    try {
      if (user) {
        const response = await axios.post(UrlConfig.admin.sendApprovalRequest, { id: user })
        const data = response.data
        if (data && request !== null) {
          setRequests(request, data.status)
        }
      }
    } catch (err) {
    } finally {
      handleClose(event)
    }
  }
  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <div>
      <Button
        ref={anchorRef}
        id='composition-button'
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleToggle}
      >
        <MoreHorizIcon />
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement='bottom-start'
        transition
        disablePortal
        sx={{ zIndex: 99 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom'
            }}
          >
            <Paper sx={{ border: '1px' }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id='composition-menu'
                  aria-labelledby='composition-button'
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem onClick={(e) => approveRequest(e)}>Approve</MenuItem>
                  <MenuItem onClick={(e) => rejectRequest(e)}>Reject</MenuItem>
                  <MenuItem onClick={(e) => cancelRequest(e)}>Cancel</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}
