'use client'

import {useEffect, useState} from "react"

import {useRouter} from "next/navigation";

import Header from '../../../components/header'
import Footer from '../../../components/footer'
import SuggestionsColumn from '../../../components/suggestions_column';
import {inter} from '../../../styles/fonts'
import {Item} from '../../../components/items'
import {Card1} from '../../../components/card'
import server_connection from '../../axios_connection';

import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

export default function Search({network = 'overall network'}) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState('')
    const [components, setComponents] = useState([])

    useEffect(() => {
        let array = []

        if (network !== 'my network') {
            for (let e of JSON.parse(localStorage.getItem('data')).users) {
                array.push(
                    <Card1
                        key={e.imageURL}
                        id={e.imageURL}
                        avatarURL={`${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/` + e.imageURL}
                        title={e.fullName}
                        subheader={e.location}
                        content={[{variant: 'b1', content: e.headline}]}
                    />
                )
            }

            setComponents(array)
            setLoading(false)
        } else {
            async function fetchData() {
                return await server_connection.get('/api/network/search')
            }

            fetchData().then((r) => {
                for (let e of r.data.networkData.users) {
                    array.push(
                        <Card1
                            key={e.imageURL}
                            id={e.imageURL}
                            avatarURL={`${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/` + e.imageURL}
                            title={e.fullName}
                            subheader={e.location}
                            content={[{variant: 'b1', content: e.headline}]}
                        />
                    )
                }

                setComponents(array)
                setLoading(false)
            })
        }
    }, [])

    return (
        <>
            {!loading ?
                <>
                    {form}
                    <Header router = {router} setForm = {setForm}/>
                    <Box sx = {{flexGrow: 1}}>
                        <Grid container mb = {14}>
                            <Grid key = 'left-column' item xs = {12} md = {8}  sx={{padding: 2}}>
                                <Grid container direction = 'column'>
                                    <Typography
                                        sx = {{m: 4}}
                                        fontSize = {25}
                                        className = {inter.className}
                                    >
                                        {network === 'my network' ? 'My network' : 'Network search results'}
                                    </Typography>
                                    {
                                        components.length === 0 ?
                                            <Typography
                                                sx = {{m: 3}}
                                                className = {inter.className}
                                                variant = 'b1'
                                            >
                                                {
                                                    network === 'my network' ?
                                                        'You do not follow anyone!'
                                                        :
                                                        'No results matched your query!'
                                                }
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
                </> : <Box sx = {{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    height: "100vh",
                    width: "100vw"
                }}><CircularProgress/></Box>}
        </>
    )
}