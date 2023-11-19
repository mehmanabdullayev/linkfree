'use client'

import { useState } from "react"

import { useRouter } from 'next/navigation'

import Header from '../../../../components/header'
import Footer from '../../../../components/footer'
import server_connection from '../../../axios_connection'

import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'

import HowToRegTwoToneIcon from '@mui/icons-material/HowToRegTwoTone'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'

export default function Login() {
    const router = useRouter()
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [authFailed, setAuthFailed] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setFormSubmitted(true)

        const data = new FormData(event.currentTarget)
        const r = await server_connection.post(
            '/api/auth/login',
            {
                email: data.get('email'),
                password: data.get('password')
            })

        if (r.data['status'] === 'OK') router.push('/profile')
        else {
            setAuthFailed(true)
            setFormSubmitted(false)
        }
    }

    return (
        <>
            <Header hideProfile = {true} hideSearch={true}/>
            <Box sx = {{width: '100vw'}} justifyContent = 'center'>
                <Grid container component = "main">
                    <Grid item md = {12}>
                        <Box
                            sx = {{
                                my: 8,
                                mx: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx = {{m: 1, bgcolor: 'indigo', width: 60, height: 60}}>
                                <HowToRegTwoToneIcon fontSize = 'large'/>
                            </Avatar>
                            <Typography component = "h1" variant = "h5">
                                Login
                            </Typography>
                            <Box component = "form" onSubmit = {handleSubmit} sx = {{mt: 1, mb: 7}}>
                                <TextField
                                    margin = "normal"
                                    required
                                    fullWidth
                                    id = "email"
                                    label = "Email Address"
                                    name = "email"
                                    type = 'email'
                                    autoComplete = "email"
                                    error = {authFailed}
                                    autoFocus = {true}
                                />
                                <TextField
                                    margin = "normal"
                                    required
                                    fullWidth
                                    name = "password"
                                    label = "Password"
                                    type = "password"
                                    id = "password"
                                    autoComplete = "current-password"
                                    autoFocus = {false}
                                    error = {authFailed}
                                    inputProps = {{
                                        maxLength: 20,
                                    }}
                                />
                                {authFailed ? <Alert severity = "warning">Email or password is wrong!</Alert> : null}
                                <LoadingButton
                                    loading = {formSubmitted}
                                    type = "submit"
                                    fullWidth
                                    variant = "contained"
                                    sx = {{mt: 3, mb: 3}}
                                    endIcon = {<ArrowForwardIosRoundedIcon/>}
                                >
                                    Continue
                                </LoadingButton>
                                <Grid container sx = {{mb: 7}}>
                                    <Grid item>
                                        <Link href = "/auth/registration" variant = "body1">
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Footer/>
        </>
    )
}