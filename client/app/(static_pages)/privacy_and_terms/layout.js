export const metadata = {
    title: 'Linkfree | Privacy and Terms',
    description: 'Fully functional social networking app. Author: Mehman Abdullayev',
    viewport: 'initial-scale=1, width=device-width',
    icons: {
        icon: '/images/favicon.png'
    }
}

export default function PATLayout({children}) {
    return (
        <section>
            {children}
        </section>
    )
}