import { ILayoutProps } from '@/types/global'
import React from 'react'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type IProps = ILayoutProps & {
    title: string;
    description: string;
    list: { type: string, href: string, label: string }[];
}
const HeaderLayout = ({ children, list, title, description }: IProps) => {
    return (
        <div className="h-full w-full flex flex-col">
            <div className="w-full h-20 border-b flex justify-between items-center px-10">
                <div className="grid">
                    <h1 className="text-xl font-bold">{title}</h1>
                    <p className='text-sm text-muted-foreground'>{description}</p>
                </div>
                <Breadcrumb>
                    <BreadcrumbList>
                        {list.map((item, idx) => {
                            return (
                                <React.Fragment key={`${idx}-${item.label}`}>
                                    <BreadcrumbItem>
                                        {item.type === "link" ? <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink> : <BreadcrumbPage>{item.label}</BreadcrumbPage>}
                                    </BreadcrumbItem>
                                    {idx < list.length - 1 && (
                                        <BreadcrumbSeparator />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>

            </div>
            <div className="w-full flex-1">{children}</div>
        </div>
    )
}

export default HeaderLayout