import { currentUser } from '@/lib/auth'
import { ILayoutProps } from '@/types/global'
import { UserRole } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

import StaffLayout from './StaffLayout'
import AdminLayout from './AdminLayout'

const AuthenticatedLayout = async ({ children }: ILayoutProps) => {
    const user = await currentUser()

    if (!user) redirect(`/auth/error?message=Unauthenticated User`);

    if (user.role === UserRole.USER)
        return (
            <StaffLayout>{children}</StaffLayout>
        );
    else if (user.role === UserRole.ADMIN)
        return (
            <AdminLayout>{children}</AdminLayout>
        )
}

export default AuthenticatedLayout