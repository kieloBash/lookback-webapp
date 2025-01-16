import RoleGateLayout from '@/components/layouts/RoleGateLayout';
import { currentUser } from '@/lib/auth';
import { APP_NAME } from '@/lib/utils';
import { ILayoutProps } from '@/types/global'
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'

const TITLE = 'Onboarding';
const DESCRIPTION = 'Fill up all the necessesary details';
const LIST = [
    {
        type: "page",
        href: "",
        label: "Onboarding"
    },
]

export const metadata: Metadata = {
    title: `${TITLE} - ${APP_NAME}`,
    description: DESCRIPTION,
};

const layout = async ({ children }: ILayoutProps) => {
    const user = await currentUser();
    if (user?.isOnboarded) redirect("/history");

    return (
        <RoleGateLayout roles={["ANY"]}>
            {children}
        </RoleGateLayout>
    )
}

export default layout