'use client'

import {useEffect, useState} from "react"

import Image from 'next/image'
import Link from 'next/link'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'

import SearchIcon from '@mui/icons-material/Search';

import logo from '../public/images/logo.svg'
import ThemeRegistry from '../styles/ThemeRegistry'
import server_connection from '../app/axios_connection'
import {openForm} from "./form";

const pages = ['Feed', /*'Jobs',*/ 'Network', /*'Organization'*/]
const pages1 = ['Profile', /*'Settings',*/ 'Logout']

export default function Header({router, setForm, hideProfile, hideSearch}) {
    const [anchorElNav, setAnchorElNav] = useState(null)
    const [anchorElUser, setAnchorElUser] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [user, setUser] = useState('')

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget)
    }
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseNavMenu = (event) => {
        setAnchorElNav(null)
    }

    const handleCloseUserMenu = async (setting) => {
        if (setting === 'Profile') {
            router.replace('/profile')
        } else if (setting === 'Logout') {
            const r = await server_connection.get('/api/auth/logout')
            if (r.data.status === 'OK') window.location.replace('/auth/login')
        }

        setAnchorElUser(null)
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
    }

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')))
    }, []);

    return (
        <ThemeRegistry options={{key: 'mui'}} themeName='mainTheme'>
            <AppBar position="sticky" color='primary'>
                <Container>
                    <Toolbar disableGutters>
                        <Link href='/'><Image src={logo} width={230} alt='logo' className='mr-7'/></Link>

                        <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: {xs: 'block', md: 'none'}
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Link href={'/' + page.toLowerCase()}>
                                            <Typography textAlign="center">{page}</Typography></Link>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        {
                            !hideSearch ?
                                <SearchIcon
                                    onClick = {() => {
                                        openForm(
                                            setForm,
                                            router,
                                            '/api/network/search',
                                            'post',
                                            'Search',
                                            [
                                                {
                                                    label: 'Enter search term...',
                                                    name: 'term',
                                                    type: 'text',
                                                    required: true
                                                }
                                            ],
                                            true,
                                            '/search'
                                        )
                                    }}
                                    sx = {{cursor: 'pointer', ml: 1.5, mr: 4, fontSize: 35}}
                                />
                                :
                                null
                        }

                        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                            {
                                pages.map((page) => (
                                        <Button
                                            href={'/' + page.toLowerCase()}
                                            disableRipple
                                            key={page}
                                            sx={{
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                my: 2,
                                                textTransform: 'none',
                                                color: 'text.secondary',
                                                display: 'block'
                                            }}
                                        >
                                            {page}
                                        </Button>
                                    )
                                )
                            }
                        </Box>

                        {!hideProfile ?
                            <Box sx={{flexGrow: 0, display: {xs: 'none', md: 'flex'}}}>
                                <Tooltip title = {<Typography fontSize = {15}>Open pages</Typography>}>
                                    <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                        <Avatar imgProps = {{crossOrigin: 'anonymous'}} alt = {user.name} src = {user.image !== undefined ? `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/` + user.image : null}/>
                                        <Typography
                                            sx={{display: {xs: 'none', md: 'flex'}}}
                                            color='text.secondary'
                                            padding='15px'
                                            fontSize='20px'>
                                            {user.name}
                                        </Typography>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{mt: '60px'}}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {
                                        pages1.map((setting) => (
                                                <MenuItem sx={{width: '150px'}} key={setting} onClick={async () => {await handleCloseUserMenu(setting)}}>
                                                    <Typography textAlign="center">{setting}</Typography>
                                                </MenuItem>
                                            )
                                        )
                                    }
                                </Menu>
                            </Box> :
                            null
                        }
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeRegistry>
    )
}