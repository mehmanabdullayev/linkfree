'use client'

import {useEffect, useState} from 'react'

import {inter} from '../styles/fonts'
import server_connection from '../app/axios_connection'

import {useRouter} from "next/navigation";
import Link from "next/link";

import Card from '@mui/material/Card'
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardMedia from '@mui/material/CardMedia'
import CardActions from '@mui/material/CardActions';
import Menu from "@mui/material/Menu";

import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuItem from "@mui/material/MenuItem";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

export function Card1({id, avatarURL, title, subheader, content, imageURL, actions}) {
    const router = useRouter()
    const [components, setComponents] = useState([])
    const [anchorEl, setAnchorEl] = useState(null)

    const openOptions = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const closeOptions = (event) => {
        setAnchorEl(null)
    }

    const handleLike = async (event, postId) => {
        event.stopPropagation()
        const r = await server_connection.post('/api/network/like_post', {postId})

        if (r.data.status === 'OK') window.location.reload()
    }

    useEffect(() => {
        let array = [], count = 0

        if (content.length > 0) {
            for (let e of content) {
                count++
                array.push(
                    <Typography
                        key={'key-' + id + '-' + count}
                        className={e.fontFamily ? e.fontFamily : inter.className}
                        variant={e.variant}
                    >
                        {e.content}
                    </Typography>
                )
            }
        }

        setComponents(array)
    }, [])

    return (
        <Card
            key = {id}
            raised = {true}
            sx = {{mt: 2, padding: 1, cursor: 'pointer'}}
            onClick = {() => {
                window.location.replace(subheader === 'Go to profile' ? '/profile' : '/user?id=' + (avatarURL.replace(`${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/`, '')).replace('.png', ''))
            }}
        >
            <CardHeader
                avatar={
                    <Avatar
                        sx={{mr: 3, width: 70, height: 70}}
                        imgProps={{crossOrigin: 'anonymous'}}
                        alt={title}
                        src={avatarURL}
                    />
                }
                title = {title}
                subheader = {subheader}
            />
            {
                imageURL ?
                    <CardMedia
                        crossOrigin = 'anonymous'
                        component="img"
                        sx = {{maxWidth: 700, maxHeight: 500}}
                        image = {`${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/` + imageURL}
                        alt = 'post image'
                    />
                    :
                    null
            }
            <CardContent>
                {components}
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={closeOptions}
                >
                    <MenuItem key={'kjb'} onClick={closeOptions}>
                        <Link href={'htt/'}>
                            <Typography textAlign="center">Follow</Typography>
                        </Link>
                    </MenuItem>

                </Menu>
            </CardContent>
            {
                actions ?
                    <CardActions disableSpacing>
                        <IconButton onClick = {async (event) => await handleLike(event, actions[0].parameter)} aria-label="add to favorites">
                            <FavoriteIcon />
                            <Typography sx = {{ml: 1}}>
                                {actions[0].value}
                            </Typography>
                        </IconButton>
                    </CardActions>
                    :
                    null
            }
        </Card>
    )
}