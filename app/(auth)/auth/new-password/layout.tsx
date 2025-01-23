import { ILayoutProps } from '@/types/global';
import { Metadata } from 'next';
import React from 'react'

const APP_NAME = process.env.APP_NAME;

export const metadata: Metadata = {
    title: `New Password - ${APP_NAME}`,
    description: "",
};


const Layout = ({ children }: ILayoutProps) => {
    return (
        <>{children}</>
    )
}

export default Layout