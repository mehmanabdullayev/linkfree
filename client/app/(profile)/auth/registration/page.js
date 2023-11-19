'use client'

import {useState} from "react"

import {useRouter} from 'next/navigation'

import Header from '../../../../components/header'
import Footer from '../../../../components/footer'
import server_connection from '../../../axios_connection'
import {search} from '../../../../services/location';

import Avatar from '@mui/material/Avatar'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Chip from "@mui/material/Chip"
import Alert from '@mui/material/Alert'
import Button from "@mui/material/Button";

import HowToRegTwoToneIcon from '@mui/icons-material/HowToRegTwoTone'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'

export default function Registration() {
    const router = useRouter()
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [passStrong, setPassStrong] = useState(true)
    const [places, setPlaces] = useState([])
    const [fileUploaded, setFileUploaded] = useState(null)
    const [emailRegistered, setEmailRegistered] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const regex = new RegExp(/^(?=.*\d)(?=.*[A-Z]).[a-zA-Z0-9!@#$%*]{7,20}/)

        if (data.get('file').name === '') {
            setFileUploaded(false)
        } else {
            setFileUploaded(true)
            if (regex.test(data.get('password'))) {
                setFormSubmitted(true)
                setPassStrong(true)

                const r = await server_connection.post(
                    '/api/auth/registration', {
                        fullName: data.get('fullName'),
                        email: data.get('email'),
                        headline: data.get('headline'),
                        password: data.get('password'),
                        location: data.get('location'),
                        image: data.get('file')
                    }, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    })

                if (r.data['status'] === 'OK') router.push('/profile')
                else if (r.data['status'] === 'USER ALREADY EXISTS') {
                    setEmailRegistered(true)
                    setFormSubmitted(false)
                } else window.location.reload();
            } else setPassStrong(false)
        }
    }

    return (
        <>
            <Header hideProfile={true} hideSearch={true}/>
            <Box sx={{width: '100vw'}} justifyContent='center'>
                <Grid container component="main">
                    <Grid item md={12}>
                        <Box
                            sx={{
                                my: 8,
                                mx: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{m: 1, bgcolor: 'indigo', width: 60, height: 60}}>
                                <HowToRegTwoToneIcon fontSize='large'/>
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Registration
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit} sx={{mt: 1, mb: 7}}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="fullName"
                                    label="Full name"
                                    name="fullName"
                                    autoComplete="fullName"
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    type='email'
                                    autoComplete="email"
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="headline"
                                    label="Headline"
                                    name="headline"
                                    autoComplete="headline"
                                    placeholder='Enter a headline up to 30 characters.'
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    error={!passStrong}
                                    inputProps={{
                                        maxLength: 20,
                                    }}
                                />
                                <Autocomplete
                                    sx={{mt: 1}}
                                    margin='normal'
                                    fullWidth
                                    freeSolo
                                    id="location"
                                    disableClearable
                                    options={places.map((place) => place)}
                                    onInputChange={async (event, value) => {
                                        if (value.length > 2) setPlaces(await search(value))
                                    }}
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option}>
                                                {option}
                                            </li>
                                        )
                                    }}
                                    renderTags={(tagValue, getTagProps) => {
                                        return tagValue.map((option, index) => (
                                            <Chip {...getTagProps({index})} key={option} label={option}/>
                                        ))
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            required
                                            name='location'
                                            {...params}
                                            label="Enter location (city)"
                                            InputProps={{
                                                ...params.InputProps,
                                            }}
                                        />
                                    )}
                                />
                                <Button sx={{mt: 3}} variant="contained" component="label">
                                    Upload a Profile Picture
                                    <input accept='image/*' name='file' type="file" hidden/>
                                </Button>
                                {!passStrong ?
                                    <Alert sx={{mt: 2}} severity="warning">
                                        Password must be between 8-20 characters, at
                                        least one number
                                        and one uppercase letter. No special characters!
                                    </Alert> : null}
                                {fileUploaded === false ?
                                    <Alert sx={{mt: 2}} severity="warning">Please upload a profile picture!</Alert> : null}
                                {emailRegistered ?
                                    <Alert sx={{mt: 2}} severity="warning">Email is already registered!</Alert> : null}
                                <LoadingButton
                                    loading={formSubmitted}
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{mt: 3, mb: 3}}
                                    endIcon={<ArrowForwardIosRoundedIcon/>}
                                >
                                    Sign up
                                </LoadingButton>
                                <Grid container sx={{mb: 7}}>
                                    <Grid item>
                                        <Link href="/auth/login" variant="body1">
                                            {"Already have an account? Login"}
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