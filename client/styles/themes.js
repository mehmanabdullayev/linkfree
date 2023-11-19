import { createTheme } from '@mui/material/styles'
import { inter } from './fonts'

export const mainTheme = createTheme({
    palette: {
        primary: {
            main: '#39db90',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#fff'
        },
        secondary: {
            main: '#e0991d'
        }
    },
    typography: {
        fontFamily: inter.style.fontFamily
    }
})