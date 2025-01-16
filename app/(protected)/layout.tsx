import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout'
import { ILayoutProps } from '@/types/global'
import React from 'react'

const ProtectedLayout = ({ children }: ILayoutProps) => {
    return (
        <AuthenticatedLayout>
            <div className="w-full h-full">
                {children}
            </div>
        </AuthenticatedLayout>)
}

export default ProtectedLayout