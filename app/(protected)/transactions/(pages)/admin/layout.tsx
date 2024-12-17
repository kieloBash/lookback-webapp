import RoleGateLayout from '@/components/layouts/RoleGateLayout'
import { ILayoutProps } from '@/types/global'
import { UserRole } from '@prisma/client'
import React from 'react'

const AdminLayout = ({ children }: ILayoutProps) => {
    return (
        <RoleGateLayout roles={[UserRole.ADMIN]}>{children}</RoleGateLayout>
    )
}

export default AdminLayout