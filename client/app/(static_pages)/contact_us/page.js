'use client'

import { useState } from 'react'

import Header from '../../../components/header'
import Footer from '../../../components/footer'
import image from "../../../public/images/contact_us.svg"
import server_connection from "../../axios_connection";

import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import {styled} from '@mui/material/styles'
import Typography from "@mui/material/Typography"
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import Image from "next/image"
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const Board = styled(Paper)(({ theme }) => ({
    width: '80vw',
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'center',
    elevation: 8,
    margin: theme.spacing(3),
}))

export default function ContactUs() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [status, setStatus] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();

        setFormSubmitted(true);

        const r = await server_connection.post(
            '/api/auth/contact_us',
            {
                name: name,
                email: email,
                message: message
            })
        if (r.data['status'] === 'OK') setStatus(true);
        setFormSubmitted(false)
    }

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
                <Board square={false}>
                    <Typography variant='h3'>Contact Us</Typography>
                    <Image width={200} src={image} alt='about image'/>
                    <Box sx={{maxWidth: 600, mx: "auto", p: 2}}>
                        {status ?
                            <Alert sx = {{justifyContent: 'center'}} severity="success">
                                Thank you! We will contact you shortly!
                            </Alert> :
                            null
                        }
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                required
                                type="email"
                            />
                            <TextField
                                fullWidth
                                label="Message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                margin="normal"
                                required
                                multiline
                                rows={4}
                            />
                            <Button variant="contained" type="submit" sx={{mt: 2}}>
                                Submit
                            </Button>
                        </form>
                    </Box>
                </Board>
            </Box>
        </>
    )
}