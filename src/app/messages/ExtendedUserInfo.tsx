'use client'

import useResponsive from '@/hooks/useResponsive'
import { Grid, Box, Typography, Stack, IconButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { NotificationAdd, PersonRounded, Search, NotificationsActive, ExpandMore } from '@mui/icons-material'
import AvatarCard from '@/components/common/AvatarCard'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import Image from 'next/image'

const ExtendedUserInfo = ({ width, friend }: { width: string, friend: any }) => {
    const router = useRouter()
    const axiosPrivate = useAxiosPrivate()

    const [images, setImages] = useState<string[]>([])

    const redirectToProfile = () => {
        router.push(`/profile/${friend.user}`)
    }

    const getImages = async () => {
        try {
            let response = await axiosPrivate.get(`${UrlConfig.messages.getChatImages}/${friend.user}`)
            setImages(response.data.data)
        } catch (err) { }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                await getImages();
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [friend])

    return <Box sx={{ position: "absolute", top: '50px', right: 0, width: width, backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AvatarCard avatar={friend?.avatar} name={friend?.firstname + " " + friend?.lastname} subtitle={friend?.bio} vertical />
        <Stack direction={"row"} spacing={2} sx={{ mt: "30px" }}>
            <IconButton  sx={{color: theme => theme.palette.primary.light}} onClick={redirectToProfile}>
                <PersonRounded  />
            </IconButton>
            <IconButton disabled>
                <NotificationsActive />
            </IconButton>
            <IconButton disabled>
                <Search />
            </IconButton>
        </Stack>
        <Accordion sx={{ mt: "20px" }}>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography variant='h5'>Chat Theme</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    Coming soon! (probs 16-17th) Stay tuned!
                </Typography>
            </AccordionDetails>
        </Accordion>
        <Accordion sx={{width: "100%"}}>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel2a-content"
                id="panel2a-header"
            >
                <Typography variant='h5'>Images</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{display: "flex", justifyContent: "center"}}>
                <Grid container spacing={1}>
                    {images.map((image) => {
                        return <Grid item xs={4} sx={{ position: "relative"}}>
                            <Box sx={{height: "80px", width: "80px", position: "relative"}}>
                            <Image src={image} alt="" layout="fill"
                                objectFit="cover" style={{ borderRadius: 4 }} /></Box>
                        </Grid>
                    })}
                </Grid>
            </AccordionDetails>
        </Accordion>
        {/* <Typography>Function under development</Typography><Typography>Stay tuned</Typography> */}
    </Box>
}

export default ExtendedUserInfo;