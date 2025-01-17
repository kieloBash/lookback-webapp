import React from 'react'
import OnboardedLayout from '@/components/layouts/OnboardedLayout'
import { ILayoutProps } from '@/types/global'

const Layout = ({ children }: ILayoutProps) => {
    return (
        <OnboardedLayout>
            {children}
        </OnboardedLayout>
    )
}

export default Layout