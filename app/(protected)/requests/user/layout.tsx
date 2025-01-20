import HeaderLayout from '@/components/layouts/HeaderLayout';
import OnboardedLayout from '@/components/layouts/OnboardedLayout';
import RoleGateLayout from '@/components/layouts/RoleGateLayout';
import { APP_NAME } from '@/lib/utils';
import { ILayoutProps } from '@/types/global'
import { Metadata } from 'next';
import React from 'react'

const TITLE = 'Request';
const DESCRIPTION = 'Fill up all the necessesary details';
const LIST = [
    {
        type: "page",
        href: "",
        label: "Request"
    },
]


export const metadata: Metadata = {
    title: `${TITLE} - ${APP_NAME}`,
    description: DESCRIPTION,
};

const layout = async ({ children }: ILayoutProps) => {
    return (
        <OnboardedLayout>
            <RoleGateLayout roles={["USER"]}>
                <HeaderLayout title={TITLE} description={DESCRIPTION} list={[]}>
                    {children}
                </HeaderLayout>
            </RoleGateLayout>
        </OnboardedLayout>
    )
}

export default layout