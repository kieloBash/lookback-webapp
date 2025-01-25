import React from 'react'
import { currentUser } from '@/lib/auth';
import { ILayoutProps } from '@/types/global'
import { redirect } from 'next/navigation';
import StaffLayout from './StaffLayout';
import UserLayout from './UserLayout';
import ManagementLayout from './ManagementLayout';
import { SidebarProvider } from '../ui/sidebar';
import AdminLayout from './AdminLayout';
import HeadAdminLayout from './HeadAdminLayout';



const AuthenticatedLayout = async ({ children }: ILayoutProps) => {
    const user = await currentUser();

    if (!user) redirect(`/auth/error?message=Unauthenticated User`);

    if (!user.isOnboarded) return (
        <>{children}</>
    );

    if (user.role === "USER") {
        return (
            <SidebarProvider>
                <UserLayout>{children}</UserLayout>
            </SidebarProvider>
        )
    } else if (user.role === "MANAGEMENT") {
        return (
            <SidebarProvider>
                <ManagementLayout>
                    {children}
                </ManagementLayout>
            </SidebarProvider>
        )
    } else if (user.role === "HEAD_ADMIN") {
        return (
            <SidebarProvider>
                <HeadAdminLayout>
                    {children}
                </HeadAdminLayout>
            </SidebarProvider>
        )
    }else if (user.role === "ADMIN") {
        return (
            <SidebarProvider>
                <AdminLayout>
                    {children}
                </AdminLayout>
            </SidebarProvider>
        )
    }


    return (
        <div>no role</div>
    )
}

export default AuthenticatedLayout