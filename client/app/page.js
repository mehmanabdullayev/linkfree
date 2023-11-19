'use client'

import bgImage from "../public/images/HeroVector.png"

import Header from "../components/header";
import Footer from "../components/footer"

import Image from 'next/image'

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function App() {

    return (
        <>
            <Header hideProfile={true} hideSearch={true}/>
            <Box sx = {{width: '100vw'}}>
                <Grid container component="main">
                    <Grid item md={12}>
                        <Box
                            sx={{
                                mb: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                style={{
                                    right: 0,
                                    position: 'absolute',
                                    maxWidth: '60vw',
                                    maxHeight: '60vh'
                                }}
                                src={bgImage}
                                alt="cover"
                            />
                            <Typography sx = {{mt: {xs: 10, md: 30}, mb: 5, mx: {xs: 3}}} variant="h5">
                                Linkfree is a free professional social networking app that helps you to stay connected!
                            </Typography>
                            <Button
                                href={'/auth/login'}
                                disableRipple
                                key={'login-page'}
                                variant='contained'
                                sx={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    my: 2,
                                    textTransform: 'none',
                                    color: 'white',
                                    width: 'fit-content'
                                }}
                            >
                                Try It Today!
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Footer/>
        </>
    )
}