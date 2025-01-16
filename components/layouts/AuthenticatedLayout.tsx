import React from 'react'
import { currentUser } from '@/lib/auth';
import { ILayoutProps } from '@/types/global'
import { redirect } from 'next/navigation';
import StaffLayout from './StaffLayout';
import UserLayout from './UserLayout';
import ManagementLayout from './ManagementLayout';



const AuthenticatedLayout = async ({ children }: ILayoutProps) => {
    const user = await currentUser();

    if (!user) redirect(`/auth/error?message=Unauthenticated User`);

    if (!user.isOnboarded) return (
        <>{children}</>
    );

    if (user.role === "USER") {
        return <UserLayout>{children}</UserLayout>
    } else if (user.role === "MANAGEMENT") {
        return <ManagementLayout>{children}</ManagementLayout>
    }


    return (
        <div>error</div>
    )
}

export default AuthenticatedLayout