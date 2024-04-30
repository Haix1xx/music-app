import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AllNotifications from './AllNotifications'
import { useNotifications } from '../../context/NotificationContext'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ overflow: 'auto', maxHeight: '500px' }}
    >
      {value === index && (
        <Box sx={{ p: 3, width: '480px' }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

export default function NotificationTab() {
  const [value, setValue] = React.useState(0)
  const { notifsState } = useNotifications()
  const unreadNotifs = notifsState.notifications.filter((notif) => !notif.read)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
          <Tab label={<div style={{ color: '#E078D8' }}>All </div>} {...a11yProps(0)} />
          <Tab
            label={
              <div style={{ color: '#E078D8' }}>
                Unread{' '}
                {notifsState.unread > 0 && (
                  <span
                    style={{
                      marginLeft: '5px',
                      backgroundColor: '#E078D8',
                      color: 'white',
                      padding: '3px 12px',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  >
                    {notifsState.notifications.filter((notif) => !notif.read).length}
                  </span>
                )}
              </div>
            }
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <AllNotifications notifications={notifsState.notifications} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <AllNotifications notifications={unreadNotifs} />
      </CustomTabPanel>
    </Box>
  )
}
