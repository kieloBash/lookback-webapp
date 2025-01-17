import React from 'react'
import RoleGateLayout from '@/components/layouts/RoleGateLayout'
import { ILayoutProps } from '@/types/global'
import { UserRole } from '@prisma/client'

import HeaderLayout from '@/components/layouts/HeaderLayout';
import { Metadata } from 'next';
import { APP_NAME } from '@/lib/utils';

const TITLE = 'QR Code';
const DESCRIPTION = 'Use the scanner to scan qr codes';
const LIST = [
    {
        type: "page",
        href: "",
        label: "QR"
    },
]

export const metadata: Metadata = {
    title: `${TITLE} - ${APP_NAME}`,
    description: DESCRIPTION,
};


const Layout = ({ children }: ILayoutProps) => {
    return (
        <RoleGateLayout roles={[UserRole.MANAGEMENT]}>
            <HeaderLayout list={LIST} title={TITLE} description={DESCRIPTION}>
                {children}
            </HeaderLayout>
        </RoleGateLayout>
    )
}

export default Layout