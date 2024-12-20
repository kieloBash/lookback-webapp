import HeaderLayout from '@/components/layouts/HeaderLayout';
import { getCategoryById } from '@/lib/category';
import { ILayoutProps } from '@/types/global'
import { Metadata } from 'next';
import React from 'react'

const APP_NAME = process.env.APP_NAME;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const data = await getCategoryById(params.id);
    const TITLE = data?.name ? `${data.name}` : "Category"
    const DESCRIPTION = data?.description ?? 'View and update specific category';

    return {
        title: `${TITLE} - ${APP_NAME}`,
        description: DESCRIPTION,
    };
}


const layout = async ({ children, params }: ILayoutProps & { params: { id: string } }) => {
    const data = await getCategoryById(params.id);

    const TITLE = data?.name ? `${data.name}` : "Category"
    const DESCRIPTION = data?.description ?? 'View and update specific category';
    const LIST = [
        {
            type: "link",
            href: "/categories/admin/overview",
            label: "Categories"
        },
        {
            type: "page",
            href: "",
            label: "View"
        },
        {
            type: "page",
            href: "",
            label: data?.name ?? "Category"
        },
    ]

    return (
        <HeaderLayout list={LIST} title={TITLE} description={DESCRIPTION}>
            {children}
        </HeaderLayout>
    )
}

export default layout