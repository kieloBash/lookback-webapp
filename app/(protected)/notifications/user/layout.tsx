import React from 'react'
import RoleGateLayout from '@/components/layouts/RoleGateLayout'
import { ILayoutProps } from '@/types/global'
import { UserRole } from '@prisma/client'

import HeaderLayout from '@/components/layouts/HeaderLayout';
import { Metadata } from 'next';
import { APP_NAME } from '@/lib/utils';

const TITLE = 'Notifications';
const DESCRIPTION = 'View and manage user notifications in the system';
const LIST = [
    {
        type: "page",
        href: "",
        label: "Notifications"
    },
]

export const metadata: Metadata = {
    title: `${TITLE} - ${APP_NAME}`,
    description: DESCRIPTION,
};


const Layout = ({ children }: ILayoutProps) => {
    return (
        <RoleGateLayout roles={[UserRole.USER]}>
            <HeaderLayout list={LIST} title={TITLE} description={DESCRIPTION}>
                {children}
            </HeaderLayout>
        </RoleGateLayout>
    )
}

export default Layout