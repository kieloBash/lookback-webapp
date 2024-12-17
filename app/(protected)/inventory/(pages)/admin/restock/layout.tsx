import HeaderLayout from '@/components/layouts/HeaderLayout';
import { ILayoutProps } from '@/types/global'
import { Metadata } from 'next';
import React from 'react'

const TITLE = 'Restock Inventory';
const DESCRIPTION = 'Restock items in your inventory.';
const LIST = [
    {
        type: "link",
        href: "/inventory/admin/overview",
        label: "Inventory"
    },
    {
        type: "page",
        href: "",
        label: "Restock"
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