import HeaderLayout from '@/components/layouts/HeaderLayout';
import { ILayoutProps } from '@/types/global'
import { Metadata } from 'next';
import React from 'react'

const TITLE = 'Categories';
const DESCRIPTION = 'View and manage your categories';
const LIST = [
    {
        type: "page",
        href: "",
        label: "Categories"
    },
    {
        type: "page",
        href: "",
        label: "Overview"
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