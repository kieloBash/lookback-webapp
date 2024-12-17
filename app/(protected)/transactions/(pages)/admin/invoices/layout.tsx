import HeaderLayout from '@/components/layouts/HeaderLayout';
import { ILayoutProps } from '@/types/global'
import { Metadata } from 'next';
import React from 'react'

const TITLE = 'Transactions';
const DESCRIPTION = 'View and manage your transactions';
const LIST = [
    {
        type: "link",
        href: "/transactions/admin/overview",
        label: "Transactions"
    },
    {
        type: "page",
        href: "",
        label: "Invoices"
    },

]

const APP_NAME = process.env.APP_NAME;

export const metadata: Metadata = {
    title: `${TITLE} - ${APP_NAME}`,
    description: DESCRIPTION,
};

const layout = ({ children }: ILayoutProps) => {
    return (
        <HeaderLayout list={LIST} title={TITLE} description={DESCRIPTION}>
            {children}
        </HeaderLayout>
    )
}

export default layout