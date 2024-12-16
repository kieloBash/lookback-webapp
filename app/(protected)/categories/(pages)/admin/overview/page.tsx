import HeaderLayout from '@/components/layouts/HeaderLayout'
import { Metadata } from 'next';
import React from 'react'

const TITLE = 'Categories';
const DESCRIPTION = 'View all categories in your database';
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

const AdminOverviewCategories = () => {
    return (
        <HeaderLayout list={LIST} title={TITLE} description={DESCRIPTION}>
            <section className="">Categories Admin</section>
        </HeaderLayout>
    )
}

export default AdminOverviewCategories