export const metadata = {
    title: 'Linkfree | Registration',
    description: 'Fully functional social networking app. Author: Mehman Abdullayev',
    viewport: 'initial-scale=1, width=device-width',
    icons: {
        icon: '/images/favicon.png'
    }
}

export default function RegistrationLayout({children}) {
    return (
        <section>
            {children}
        </section>
    )
}