'use client'

import '../styles/globals.css'
import ThemeRegistry from "../styles/ThemeRegistry"

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

export default function RootLayout({ children }) {

    return (
        <html lang='en'>
        <body>
        <ThemeRegistry options={{key: 'mui'}} themeName='mainTheme'>{children}</ThemeRegistry>
        </body>
        </html>
    )
}
