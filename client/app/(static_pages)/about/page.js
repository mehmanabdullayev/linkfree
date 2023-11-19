'use client'

import Header from '../../../components/header'
import Footer from '../../../components/footer'
import image from "../../../public/images/about_image.svg"

import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import {styled} from '@mui/material/styles'
import Typography from "@mui/material/Typography"

import Image from "next/image"
import Box from "@mui/material/Box";

const Board = styled(Paper)(({ theme }) => ({
    width: '80vw',
    padding: theme.spacing(4),
    ...theme.typography.body2,
    textAlign: 'center',
    elevation: 8,
    margin: theme.spacing(7),
}))

export default function About() {
    return (
        <>
            <Header hideProfile={true}/>
            <Box
                sx={{
                    mb: 2,
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    width: "100vw"
                }}>
                <Board square = {false}>
                    <Typography variant = 'h2'>About Linkfree</Typography>
                    <Image width = {280} src={image} alt='about image'/>
                    <Typography sx = {{mt: 7, fontSize: 20}} variant = 'body1'>Linkfree is a social networking app for industry professionals. As an alternative to Linkedin, you can use Linkfree free of charge, and it also encompasses most features of Linkedin. Why pay for Linkedin premuim, while you use Linkfree?</Typography>
                </Board>
            </Box>
        </>
    )
}