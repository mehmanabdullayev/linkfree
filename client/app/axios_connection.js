import axios from 'axios'

export const local_connection = axios.create({
    baseURL: process.env.NEXT_PUBLIC_CLIENT_ORIGIN
})

const server_connection = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_ORIGIN,
    withCredentials: true
})

export default server_connection