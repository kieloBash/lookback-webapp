'use client'
import { signOut } from 'next-auth/react'
import React from 'react'

const DashboardPage = () => {
    return (
        <div>DashboardPage
            <button onClick={() => signOut()}>log out</button>
        </div>
    )
}

export default DashboardPage