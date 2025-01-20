'use client'
import React from 'react'

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import useUserNotifications from '@/hooks/user/use-notifications'
import UiDataLoader from '@/components/ui/data-loader'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/lib/utils'

const UserHistoryPage = () => {
    const data = useUserNotifications({});
    return (
        <article className="w-full h-full p-4 flex justify-start items-center flex-col">
            <div className="w-full lg:max-w-none max-w-xs">
                <UiDataLoader

                    columns={0}
                    isLoading={data.isLoading}
                    length={data.payload?.length}
                >
                    <ul className="space-y-2">
                        {data.payload?.map((d) => {
                            return (
                                <li className="w-full" key={d.id}>
                                    <Card className='w-full py-1 px-2'>
                                        <CardHeader className='pb-2'>
                                            <CardTitle>{d.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground text-sm">
                                                {d.message}
                                            </p>
                                        </CardContent>
                                        <CardFooter className='flex-row justify-end items-center'>
                                            <p className="text-right text-muted-foreground text-xs">{formatDateTime(d.createdAt)}</p>
                                        </CardFooter>
                                    </Card>
                                </li>
                            )
                        })}
                    </ul>
                </UiDataLoader>
            </div>
        </article>
    )
}

export default UserHistoryPage