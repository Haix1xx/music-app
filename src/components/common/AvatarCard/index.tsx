import useResponsive from '@/hooks/useResponsive'
import { Grid, Box, Stack, Typography, styled, Badge, Avatar, Skeleton } from '@mui/material'

const AvatarCard = ({ name, subtitle, avatar, vertical = false }: { name: string, subtitle: string | null, avatar: string, vertical: boolean }) => {
    const isMobile = useResponsive('down', 'sm')
    console.log(subtitle);

    return <Stack direction={vertical ? "column" : "row"} alignItems={"center"}>
        {avatar !== null ?
            <Avatar sx={{ width: vertical ? '60px' : '45px', height: vertical ? '60px' : '45px', borderRadius: "50%" }} src={avatar} />
            : <Skeleton variant="circular" width={40} height={40} />}
        <Stack sx={{ justifyContent: "center", paddingLeft: vertical ? '0' : '15px', alignItems: vertical ? "center" : "normal" }}>
            {name !== "undefined undefined" ?
                <Typography component="div" variant="h4" sx={{ marginY: vertical ? "10px" : 0, lineHeight: 1, marginBottom: "2px" }}>{name}</Typography>
                : <Skeleton width={150} />}
            {subtitle ?
                <Typography variant="body2" color="text.secondary" component="div" sx={{ lineHeight: 1, padding: vertical ? "0 20px" : 0, textAlign: vertical ? "center" : "initial", textTransform: 'initial' }}>
                    {subtitle}
                </Typography>
                : <Skeleton width={100} />
            }
        </Stack>
    </Stack>
}

export default AvatarCard;