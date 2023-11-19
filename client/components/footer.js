'use client'

import { useState } from "react"

import Typography from "@mui/material/Typography"
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import {
    HistoryEdu,
    Shield,
    ChatBubble,
} from '@mui/icons-material'

import ThemeRegistry from "../styles/ThemeRegistry"

export default function Footer() {
    const [selected, setSelected] = useState(0)

    return (
        <ThemeRegistry options = {{key: 'mui'}} themeName='mainTheme'>
            <Paper elevation = {8} sx = {{ zIndex: 1500, padding: 3, width: '100%', bottom: 0, position: 'fixed' }}>
                <BottomNavigation
                    showLabels
                    value={selected}
                    onChange={(event, newValue) => {
                        setSelected(newValue);
                    }}
                >
                    <BottomNavigationAction href = '/about' disableRipple showLabel = {true} label = {<Typography color = 'text.secondary' paddingTop = '10px' textAlign = 'center' fontSize = '15px' fontWeight = '600'>About</Typography>} icon = {<HistoryEdu fontSize = 'large' color = 'secondary'/>}/>
                    <BottomNavigationAction href = '/contact_us' disableRipple showLabel = {true} label = {<Typography color = 'text.secondary' paddingTop = '10px' textAlign = 'center' fontSize = '15px' fontWeight = '600'>Contact Us</Typography>} icon = {<ChatBubble fontSize = 'large' color = 'secondary'/>}/>

                </BottomNavigation>
            </Paper>
        </ThemeRegistry>
    )
}