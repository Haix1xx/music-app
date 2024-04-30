import useResponsive from '@/hooks/useResponsive'
import { Grid, Box, Stack, Typography, styled, Badge, Avatar } from '@mui/material'

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

const CustomAvatar = ({ img, online }: { img: string, online: boolean }) => {
    const isMobile = useResponsive('down', 'sm')

    return <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
            <>{online && (<Box sx={{
                backgroundColor: '#33a04d', borderRadius: '50%', width: '20px', height: '20px',
                border: (theme) => `3px solid ${theme.palette.background.paper}`,
            }}></Box>) 
            // : (<Box sx={{
            //     backgroundColor: '#73c987', borderRadius: '12px', color: "#41754c", paddingX: "5px",
            //     border: (theme) => `3px solid ${theme.palette.background.paper}`,
            // }}><Typography variant='subtitle2'>{status}m</Typography></Box>)
            }</>
        }
    > <Avatar
        sx={{ width: isMobile ? '45px' : '60px', height: isMobile ? '45px' : '60px', borderRadius: "50%" }}
        src={img}
    >
        </Avatar>
    </Badge >
}

export default CustomAvatar;