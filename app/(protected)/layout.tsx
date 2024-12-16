import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout'
import { ILayoutProps } from '@/types/global'
import React from 'react'

const MainLayout = ({ children }: ILayoutProps) => {
    return (
        <AuthenticatedLayout>{children}</AuthenticatedLayout>
    )
}

export default MainLayout