import { Box, Typography, Stack } from '@mui/material'
import ListFollowCard from './ListFollowCard'

//temp data
const suggested_follow_list = [
  {
    name: 'Arthur Shelby',
    username: 'arthurshelby1',
    avatar: 'https://pbs.twimg.com/profile_images/1498070100393754625/C2V-fbll_400x400.jpg'
  },
  {
    name: 'Donald J. Trump',
    username: 'realDonaldTrump',
    avatar: 'https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg'
  },
  {
    name: 'Eva Fox',
    username: 'EvaFoxU',
    avatar: 'https://pbs.twimg.com/profile_images/1699898466959347712/WS3HVOtW_400x400.jpg'
  }
]
function ListFollow() {
  return (
    <Box>
      <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
        <Typography variant='h4' sx={{ color: 'black' }}>
          List following
        </Typography>
        <Typography
          color='secondary'
          sx={{
            fontWeight: 'bold',
            verticalAlign: 'middle',
            cursor: 'pointer'
          }}
          variant='h4'
        >
          Show more
        </Typography>
      </Stack>
      <Box sx={{ marginLeft: '-13px' }}>
        {suggested_follow_list.map((user, index) => (
          <ListFollowCard key={index} user={user} />
        ))}
      </Box>
    </Box>
  )
}

export default ListFollow
