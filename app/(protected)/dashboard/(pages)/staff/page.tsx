import HeaderLayout from '@/components/layouts/HeaderLayout'
import { Metadata } from 'next';
import React from 'react'

const TITLE = 'My Dashboard';
const DESCRIPTION = 'View all shortcuts and summaries';
const LIST = [
    {
        type: "page",
        href: "",
        label: "My Dashboard"
    },
]

const APP_NAME = process.env.APP_NAME;

export const metadata: Metadata = {
    title: `${TITLE} - ${APP_NAME}`,
    description: DESCRIPTION,
};

const StaffMainDashboard = () => {
    return (
        <HeaderLayout list={LIST} title={TITLE} description={DESCRIPTION}>
            <section className="">Dashboard Staff</section>
        </HeaderLayout>
    )
}

export default StaffMainDashboard