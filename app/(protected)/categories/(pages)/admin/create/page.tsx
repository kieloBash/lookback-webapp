import HeaderLayout from '@/components/layouts/HeaderLayout'
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

const AdminCreateCategories = () => {
    return (
        <HeaderLayout list={LIST} title={TITLE} description={DESCRIPTION}>
            <section className="">Categories Admin</section>
        </HeaderLayout>
    )
}

export default AdminCreateCategories