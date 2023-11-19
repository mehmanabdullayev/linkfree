'use client'

import {useEffect, useState} from 'react'

import server_connection from '../app/axios_connection';
import {Card1} from './card'

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function SuggestionsColumn() {
    const [components, setComponents] = useState([])

    useEffect(() => {
        let array = []

        async function fetchData() {
            return await server_connection.get('/api/network/suggestions')
        }

        fetchData().then((r) => {
            for (let e of r.data.response) {
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
        })
    }, []);

    return (
        <Grid key='right-column' item xs={0} md={3} sx={{padding: 3, display: {xs: 'none', lg: 'block'}}}>
            <Grid container direction='column'>
                {
                    components.length > 0 ?
                        <>
                            <Typography
                                sx={{m: 2}}
                                variant='h5'
                            >
                                Network suggestions:
                            </Typography>
                            {components}
                        </>
                        :
                        null
                }
            </Grid>
        </Grid>
    )
}