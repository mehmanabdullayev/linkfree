'use client'

import {useEffect, useState} from "react"

import {useRouter} from "next/navigation";

import Header from '../../../components/header'
import Footer from '../../../components/footer'
import SuggestionsColumn from "../../../components/suggestions_column";
import {inter} from '../../../styles/fonts'
import {Item} from '../../../components/items'
import {Card1} from '../../../components/card'
import server_connection from '../../axios_connection'

import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from "@mui/material/IconButton";

import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import AttachmentIcon from '@mui/icons-material/Attachment';

export default function Feed() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState('')
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [fileName, setFileName] = useState('Attach Image (optional)')
    const [components, setComponents] = useState([])
    const [user, setUser] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()

        const data = new FormData(event.currentTarget)

        const r = await server_connection.post(
            '/api/network/add_post',
            {
                content: data.get('post'),
                image: data.get('file')
            }, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        )

        if (r.data.status === 'OK') window.location.reload()
    }

    useEffect(() => {
        let array = [], count = 0

        async function fetchData() {
            return await server_connection.get('/api/network/get_posts')
        }

        fetchData().then((r) => {
            for (let post of r.data.response) {
                count++
                array.push(
                    <Card1
                        key = {'post-' + count}
                        id = {'post-' + count}
                        avatarURL = {`${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/` + post.userImageURL}
                        title = {post.userName}
                        subheader = {post.userLocation + ' ' + post.dateString}
                        content = {[{variant: 'b1', content: post.content}]}
                        imageURL = {post.imageURL}
                        actions = {[{parameter: post.postId, value: post.likeCounts}]}
                    />
                )
            }

            setComponents(array)
            setUser(JSON.parse(localStorage.getItem('user')))
            setLoading(false)
        })
    }, [])

    return (
        <>
            {!loading ?
                <>
                    {form}
                    <Header router={router} setForm = {setForm} />
                    <Box sx={{flexGrow: 1}}>
                        <Grid container mb={14}>
                            <Grid key='left-column' item xs={0} md={3} sx={{display: {xs: 'none', md: 'block'}, padding: 4}}>
                                <Grid container direction='column'>
                                    <Card1
                                        id='current-user'
                                        avatarURL={user.image !== undefined ? `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/` + user.image : null}
                                        title={user.name}
                                        subheader='Go to profile'
                                        content={[]}
                                    />
                                </Grid>
                            </Grid>
                            <Grid key='middle-column' item xs={12} md = {6} sx={{padding: 2}}>
                                <Grid component='form' onSubmit={handleSubmit} container direction='column' justifyContent='flex-start'>
                                    <Typography
                                        sx={{m: 2, ml: 1}}
                                        fontSize={25}
                                        className={inter.className}
                                    >
                                        Feed
                                    </Typography>
                                    <TextField
                                        id="outlined-multiline-static"
                                        label="Create Post"
                                        required
                                        fullWidth
                                        margin='normal'
                                        multiline
                                        rows={4}
                                        placeholder="Add new post"
                                        name='post'
                                        autoComplete='Create Post'
                                        autoFocus={true}
                                    />
                                    <IconButton
                                        disableRipple
                                        size="large"
                                        aria-label="attachment"
                                        component = 'label'
                                    >
                                        <AttachmentIcon />
                                        <Typography
                                            sx = {{ml: 1}}
                                        >
                                            {fileName}
                                        </Typography>
                                        <input onChange = {() => {setFileName('Attached: ' + document.getElementById('file').files[0].name)}} accept='image/*' id = 'file' name='file' type="file" hidden/>
                                    </IconButton>
                                    <LoadingButton
                                        loading={formSubmitted}
                                        sx={{mt: 2, mb: 2}}
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        endIcon={<ArrowForwardIosRoundedIcon/>}
                                    >
                                        Add
                                    </LoadingButton>
                                    {
                                        components.length === 0 ?
                                            <Typography
                                                sx={{m: 3}}
                                                className={inter.className}
                                                variant='b1'
                                            >
                                                No one posted yet!
                                            </Typography>
                                            :
                                            components
                                    }
                                </Grid>
                            </Grid>
                            <SuggestionsColumn />
                        </Grid>
                    </Box>

                    <Footer/>
                </>
                :
                <Box
                    sx={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                        height: "100vh",
                        width: "100vw"
                    }}>
                    <CircularProgress/>
                </Box>}
        </>
    )
}