import React from 'react'
import RoleGateLayout from '@/components/layouts/RoleGateLayout'
import { ILayoutProps } from '@/types/global'
import { UserRole } from '@prisma/client'

import HeaderLayout from '@/components/layouts/HeaderLayout';
import { Metadata } from 'next';
import { APP_NAME } from '@/lib/utils';

const TITLE = 'Create User';
const DESCRIPTION = 'Create new user in the system';
const LIST = [
    {
        type: "link",
        href: "/users/admin/overview",
        label: "Overview"
    },
    {
        type: "page",
        href: "",
        label: "Create"
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