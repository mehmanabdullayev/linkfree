'use client'

import {useEffect, useState} from "react"

import {useRouter} from "next/navigation";

import Header from './header'
import Footer from './footer'
import SuggestionsColumn from "./suggestions_column";
import {openForm} from './form'
import {inter} from '../styles/fonts'
import server_connection from '../app/axios_connection'
import {Item} from './items'
import {StyledBadge} from './badges';

import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Tooltip from "@mui/material/Tooltip"
import Button from '@mui/material/Button'

import EditIcon from '@mui/icons-material/Edit';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import AddIcon from '@mui/icons-material/Add';

export default function ProfileComponent({imageURL}) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState('')
    const [components, setComponents] = useState([])

    const handleFollow = async () => {
        const r = await server_connection.post(
            '/api/network/follow_action', {
                imageURL: imageURL
            })

        if (r.data.status === 'OK') window.location.reload()
    }

    useEffect(() => {
        let count = 0

        async function fetchData() {
            if (imageURL) {
                const r = await server_connection.get('/api/profile/get_user_data?imageURL=' + imageURL)
                const currentUser = r.data.response.currentUser

                delete r.data.response.currentUser
                return {response: r, currentUser: currentUser}
            }
            else return {response: await server_connection.get('/api/profile/get_user_data'), currentUser: true}
        }

        fetchData().then((r) => {
            let data = r.response.data.response, currentUser = r.currentUser, array = [], following = r.response.data.response.following
            delete data.following
            delete data.currentUser

            Object.entries(data).forEach(([key, value]) => {
                let alignment = 'left', subcomponents = []

                if (key === 'userBasicInfo') {
                    alignment = 'center';
                    if (currentUser) localStorage.setItem('user', JSON.stringify({image: value.imageURL, name: value.fullName}))
                }

                if (key !== 'locations') {
                    if (key !== 'userBasicInfo' && value.length !== 0) {
                        for (let e of value) {
                            let level = 0

                            Object.entries(e).forEach(([key1, value1]) => {
                                if (key1 === 'logoURL' || value1) {
                                    level++
                                    count++
                                    subcomponents.push(
                                        <Grid
                                            key={'key-' + count}
                                            item xs={12}
                                            md={key === 'skills' ? 1 : key === 'interests' ? 2 : 12}
                                        >
                                            {
                                                key !== 'projects' && key1 === 'logoURL'?
                                                    <Avatar sx={{ml: 2, mt: 1}} imgProps={{crossOrigin: 'anonymous'}}
                                                            alt='company logo'
                                                            src={value1 ? `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/` + value1 : `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/` + 'company_default.svg'}/>
                                                    :
                                                    <Typography
                                                        sx={{m: 2}}
                                                        className={inter.className}
                                                        variant={key === 'skills' || key === 'interests' ? 'h6' : level === 2 ? 'h5' : level === 3 ? 'h6' : level === 4 ? 'subtitle1' : level === 5 ? 'subtitle2' : 'body1'}
                                                    >
                                                        {(key === 'skills' || key === 'interests') && (key1 !== 'name') ? null : value1}
                                                    </Typography>
                                            }
                                        </Grid>
                                    )
                                }
                            })
                        }
                    } else {
                        subcomponents.push(
                            <Grid key={'key-' + count} item xs={12}>
                                <Typography
                                    sx={{m: 2}}
                                    className={inter.className}
                                    variant={'h6'}
                                >
                                    {
                                        !currentUser ?
                                            `No ${key} to display`
                                            :
                                            `You do not have any ${key.slice(0, -1)} yet. Click the "plus button" on right hand side to add a ${key.slice(0, -1)}.`
                                    }
                                </Typography>
                            </Grid>
                        )
                    }

                    array.push(
                        <Grid key={key} item xs={12}>
                            <Item sx={{textAlign: alignment}}>
                                {
                                    key === 'userBasicInfo' ?
                                        <>
                                            <Tooltip title={<Typography fontSize={15}>Online</Typography>}>
                                                <StyledBadge
                                                    overlap="circular"
                                                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                                                    variant="dot"
                                                    sx={{"& .MuiBadge-badge": {fontSize: 5, height: 12, minWidth: 12}}}
                                                >
                                                    <Avatar
                                                        imgProps={{crossOrigin: 'anonymous'}}
                                                        alt={value.fullName}
                                                        src={`${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/` + value.imageURL}
                                                        sx={{width: 150, height: 150}}
                                                    />
                                                </StyledBadge>
                                            </Tooltip>
                                            <Typography
                                                id='fullname'
                                                sx={{m: 2}}
                                                className={inter.className}
                                                variant='h5'
                                            >
                                                {value.fullName}
                                            </Typography>
                                            <Typography
                                                sx={{m: 2}}
                                                className={inter.className}
                                                variant='b1'
                                            >
                                                Location: {data.locations.at(-1).city + ' ' + data.locations.at(-1).country}
                                            </Typography>
                                            <Typography
                                                xs={9}
                                                sx={{m: 2}}
                                                className={inter.className}
                                                variant='h6'
                                            >
                                                {value.headline}
                                            </Typography>
                                            {
                                                currentUser ?
                                                    <Tooltip title={<Typography fontSize={15}>Edit basic info</Typography>}>
                                                        <EditIcon
                                                            onClick={() => {
                                                                openForm(
                                                                    setForm,
                                                                    router,
                                                                    '/api/profile/edit_info',
                                                                    'post',
                                                                    'Edit Info',
                                                                    [
                                                                        {
                                                                            label: 'Full name (optional)',
                                                                            name: 'fullName',
                                                                            type: 'text',
                                                                            required: false
                                                                        },
                                                                        {
                                                                            label: 'Headline (optional)',
                                                                            name: 'headline',
                                                                            type: 'text',
                                                                            required: false
                                                                        }
                                                                    ]
                                                                )
                                                            }}
                                                            sx={{
                                                                cursor: 'pointer',
                                                                ml: 2,
                                                                color: 'green'
                                                            }}/>
                                                    </Tooltip>
                                                    :
                                                    <Button
                                                        variant = 'contained'
                                                        onClick = {async () => {
                                                            await handleFollow()
                                                        }}
                                                    >
                                                        <AddIcon
                                                            sx = {{fontSize: 30, fontWeight: 700}}
                                                        />
                                                        <Typography
                                                            variant = 'body1'
                                                            className = {inter.className}
                                                            sx = {{fontSize: 18, fontWeight: 600}}
                                                        >
                                                            {following? 'Unfollow' : 'Follow'}
                                                        </Typography>
                                                    </Button>
                                            }
                                        </>
                                        :
                                        <Grid container>
                                            <Grid item xs={currentUser? 8 : 12}>
                                                <Typography
                                                    sx={{m: 2}}
                                                    className={inter.className}
                                                    variant='h6'
                                                >
                                                    {key === 'positions' ? 'Experience' : key.charAt(0).toUpperCase() + key.slice(1)}
                                                </Typography>
                                            </Grid>
                                            {
                                                currentUser?
                                                    <Grid item xs={4} sx={{textAlign: 'right', padding: 1}}>
                                                        <Tooltip title={<Typography fontSize={15}>Add {key !== 'education' ? key.slice(0, -1) : key}</Typography>}>
                                                            <AddCircleRoundedIcon
                                                                onClick={() => {
                                                                    let fields

                                                                    if (key === 'certificates') {
                                                                        fields = [
                                                                            {
                                                                                label: 'Certificate name ',
                                                                                name: 'name',
                                                                                type: 'text',
                                                                                required: true
                                                                            },
                                                                            {
                                                                                label: 'Issuing organization ',
                                                                                name: 'organization',
                                                                                type: 'text',
                                                                                required: true
                                                                            },
                                                                            {
                                                                                label: 'Issue date *',
                                                                                name: 'issueDate',
                                                                                type: 'date',
                                                                                required: true
                                                                            },
                                                                            {
                                                                                label: 'Expire date (optional)',
                                                                                name: 'expireDate',
                                                                                type: 'date',
                                                                                required: false
                                                                            },
                                                                            {
                                                                                label: 'Credential id ',
                                                                                name: 'credentialID',
                                                                                type: 'text',
                                                                                required: true
                                                                            },
                                                                            {
                                                                                label: 'Credential url ',
                                                                                name: 'credentialURL',
                                                                                type: 'text',
                                                                                required: true
                                                                            }
                                                                        ]
                                                                    } else if (key === 'education') {
                                                                        fields = [
                                                                            {
                                                                                label: 'Institution ',
                                                                                name: 'organization',
                                                                                type: 'text',
                                                                                required: true
                                                                            },
                                                                            {
                                                                                label: 'Degree ',
                                                                                name: 'degree',
                                                                                type: 'text',
                                                                                required: true
                                                                            },
                                                                            {
                                                                                label: 'Field of study ',
                                                                                name: 'fieldOfStudy',
                                                                                type: 'text',
                                                                                required: true
                                                                            },
                                                                            {
                                                                                label: 'Start date *',
                                                                                name: 'startDate',
                                                                                type: 'date',
                                                                                required: true
                                                                            },
                                                                            {
                                                                                label: 'End date (optional)',
                                                                                name: 'endDate',
                                                                                type: 'date',
                                                                                required: false
                                                                            },
                                                                            {
                                                                                label: 'Grade (optional)',
                                                                                name: 'grade',
                                                                                type: 'text',
                                                                                required: false
                                                                            },
                                                                            {
                                                                                label: 'Activities (optional)',
                                                                                name: 'activites',
                                                                                type: 'text',
                                                                                required: false
                                                                            }
                                                                        ]
                                                                    } else if (key === 'interests') {
                                                                        fields = [
                                                                            {
                                                                                label: 'Organization of interest ',
                                                                                name: 'organization',
                                                                                type: 'text',
                                                                                required: true
                                                                            }
                                                                        ]
                                                                    } else if (key === 'positions') {
                                                                        fields = [
                                                                            {
                                                                                label: 'Title ',
                                                                                name: 'title',
                                                                                type: 'text',
                                                                                required: true
                                                                            },
                                                                            {
                                                                                label: 'Employment type',
                                                                                name: 'employmentType',
                                                                                type: 'text',
                                                                                required: true
                                                                            },
                                                                            {
                                                                                label: 'Organization ',
                                                                                name: 'organization',
                                                                                type: 'text',
                                                                                required: true
                                                                            },
                                                                            {
                                                                                label: 'Location (optional)',
                                                                                name: 'location',
                                                                                type: 'text',
                                                                                required: false
                                                                            },
                                                                            {
                                                                                label: 'Location type (remote, onsite, etc.) ',
                                                                                name: 'locationType',
                                                                                type: 'text',
                                                                                required: true
                                                                            },
                                                                            {
                                                                                label: 'Start date *',
                                                                                name: 'startDate',
                                                                                type: 'date',
                                                                                required: true
                                                                            },
                                                                            {
                                                                                label: 'End date (optional)',
                                                                                name: 'endDate',
                                                                                type: 'date',
                                                                                required: false
                                                                            },
                                                                            {
                                                                                label: 'Description ',
                                                                                name: 'description',
                                                                                type: 'text',
                                                                                required: true
                                                                            }
                                                                        ]
                                                                    } else if (key === 'projects') {
                                                                        fields = [
                                                                            {
                                                                                label: 'Project name ',
                                                                                name: 'name',
                                                                                type: 'text',
                                                                                required: true
                                                                            },
                                                                            {
                                                                                label: 'Description ',
                                                                                name: 'description',
                                                                                type: 'text',
                                                                                required: true
                                                                            },
                                                                            {
                                                                                label: 'Start date *',
                                                                                name: 'startDate',
                                                                                type: 'date',
                                                                                required: true
                                                                            },
                                                                            {
                                                                                label: 'End date (optional)',
                                                                                name: 'endDate',
                                                                                type: 'date',
                                                                                required: false
                                                                            }
                                                                        ]
                                                                    } else {
                                                                        fields = [
                                                                            {
                                                                                label: 'Skill name ',
                                                                                name: 'name',
                                                                                type: 'text',
                                                                                required: true
                                                                            },
                                                                            {
                                                                                label: 'Skill type ',
                                                                                name: 'type',
                                                                                type: 'text',
                                                                                required: true
                                                                            }
                                                                        ]
                                                                    }

                                                                    let title = key !== 'education' ? key.slice(0, -1) : key
                                                                    openForm(
                                                                        setForm,
                                                                        router,
                                                                        '/api/profile/add_' + title,
                                                                        'post',
                                                                        'Add ' + title,
                                                                        fields
                                                                    )
                                                                }
                                                                }
                                                                color='secondary'
                                                                sx={{cursor: 'pointer', fontSize: 35}}
                                                            />
                                                        </Tooltip>
                                                    </Grid>
                                                    :
                                                    null
                                            }
                                            {subcomponents}
                                        </Grid>
                                }
                            </Item>
                        </Grid>
                    )
                }
            })

            setComponents(array)
            setLoading(false)
        })
    }, []);

    return (
        <>
            {!loading ?
                <>
                    {form}
                    <Header router = {router} setForm = {setForm}/>
                    <Grid key='main-body' sx={{width: '100vw', padding: 2, mb: 15}} container rowSpacing={2}
                          columnSpacing={{xs: 1, sm: 2, md: 3}} justifyContent="flex-start">
                        <Grid key='left-column' item xs={12} sm={8} md={8}>
                            <Grid container direction='column' rowSpacing={2} columnSpacing={{xs: 3, sm: 4, md: 5}}>
                                {components}
                            </Grid>
                        </Grid>
                        <SuggestionsColumn />
                    </Grid>

                    <Footer/>
                </> : <Box sx={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    height: "100vh",
                    width: "100vw"
                }}><CircularProgress/></Box>}
        </>
    )
}