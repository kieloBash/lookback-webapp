import React from 'react'
import { ILayoutProps } from '@/types/global'

import HeaderLayout from '@/components/layouts/HeaderLayout';
import { Metadata } from 'next';
import { APP_NAME } from '@/lib/utils';
import RoleGateLayout from '@/components/layouts/RoleGateLayout';
import { UserRole } from '@prisma/client';

const TITLE = 'Requests';
const DESCRIPTION = 'View and manage user requests in the system';
const LIST = [
    {
        type: "page",
        href: "",
        label: "Requests"
    },
]

export const metadata: Metadata = {
    title: `${TITLE} - ${APP_NAME}`,
    description: DESCRIPTION,
};


const Layout = ({ children }: ILayoutProps) => {
    return (
        <RoleGateLayout roles={[UserRole.HEAD_ADMIN]}>
            <HeaderLayout list={LIST} title={TITLE} description={DESCRIPTION}>
                {children}
            </HeaderLayout>
        </RoleGateLayout>
    )
}

export default Layout