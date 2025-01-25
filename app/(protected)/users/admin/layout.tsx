import React from 'react'
import OnboardedLayout from '@/components/layouts/OnboardedLayout'
import { ILayoutProps } from '@/types/global'

import RoleGateLayout from '@/components/layouts/RoleGateLayout';
import { UserRole } from '@prisma/client';


const Layout = ({ children }: ILayoutProps) => {
    return (
        <OnboardedLayout>
            <RoleGateLayout roles={[UserRole.HEAD_ADMIN]}>
                {children}
            </RoleGateLayout>
        </OnboardedLayout>
    )
}

export default Layout