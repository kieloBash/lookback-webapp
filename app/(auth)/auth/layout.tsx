import { ILayoutProps } from '@/types/global'
import { Metadata } from 'next';
import React from 'react'

const Layout = ({ children }: ILayoutProps) => {
    return (
        <div className="w-full min-h-screen relative">
            {children}
        </div>
    )
}

export default Layout