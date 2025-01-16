'use client'
import { useCurrentRole } from '@/lib/hooks'
import { UserRole } from '@prisma/client'
import React from 'react'

type RoleType = UserRole | 'ANY';

interface IProps {
    roles: RoleType[];
    children: React.ReactNode
}

const RoleGateLayout = ({ roles, children }: IProps) => {
    const currentRole = useCurrentRole();
    if (currentRole && roles.includes(currentRole) || roles.includes('ANY')) {
        return children
    } else {
        return (
            <section className="w-full h-full flex justify-center items-center flex-col">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className='text-muted-foreground mt-1.5'>Switch to another role to access this page</p>
            </section>
        )
    }
}


export default RoleGateLayout