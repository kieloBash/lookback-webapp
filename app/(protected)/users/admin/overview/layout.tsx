import React from 'react'
import RoleGateLayout from '@/components/layouts/RoleGateLayout'
import { ILayoutProps } from '@/types/global'
import { UserRole } from '@prisma/client'

import HeaderLayout from '@/components/layouts/HeaderLayout';
import { Metadata } from 'next';
import { APP_NAME } from '@/lib/utils';

const TITLE = 'Users';
const DESCRIPTION = 'View and manage users in the system';
const LIST = [
    {
        type: "page",
        href: "",
        label: "Overview"
    },
]

export const metadata: Metadata = {
    title: `${TITLE} - ${APP_NAME}`,
    description: DESCRIPTION,
};


const Layout = ({ children }: ILayoutProps) => {
    return (
        <HeaderLayout list={LIST} title={TITLE} description={DESCRIPTION}>
            {children}
        </HeaderLayout>
    )
}

export default Layout