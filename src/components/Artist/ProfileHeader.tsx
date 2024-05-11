import { Avatar, Container, Grid, Paper, Typography, Box } from '@mui/material'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
interface ProfileHeaderProps {
  avatar: string
  artistName: string
}
export default function ProfileHeader({ avatar, artistName }: ProfileHeaderProps) {
  return (
    <Box paddingBottom='30px'>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Avatar sx={{ width: '300px', height: '300px' }} src={avatar} />
        </Grid>
        <Grid item xs={12} md={9} sx={{ position: 'relative' }}>
          <Container sx={{ position: 'absolute', bottom: '0' }}>
            <Typography>
              Verify Artist
              {
                <VerifiedRoundedIcon
                  sx={{
                    fontSize: '22px',
                    marginLeft: '10px'
                  }}
                  color='secondary'
                />
              }
            </Typography>
            <Typography variant='h1'>{artistName}</Typography>
          </Container>
        </Grid>
      </Grid>
    </Box>
  )
}
