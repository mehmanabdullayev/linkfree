'use client'

import ProfileComponent from "../../../components/profile_component";

import {useSearchParams} from "next/navigation";

export default function User() {
    const searchParams = useSearchParams()

    return (
        <ProfileComponent imageURL={searchParams.get('id') + '.png'} />
    )
}