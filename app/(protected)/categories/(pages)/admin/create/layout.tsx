import HeaderLayout from '@/components/layouts/HeaderLayout';
import { ILayoutProps } from '@/types/global'
import { Metadata } from 'next';
import React from 'react'

const TITLE = 'Create Category';
const DESCRIPTION = 'Create a new category to have in your system';
const LIST = [
    {
        type: "link",
        href: "/categories/admin/overview",
        label: "Categories"
    },
    {
        type: "page",
        href: "",
        label: "Create"
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