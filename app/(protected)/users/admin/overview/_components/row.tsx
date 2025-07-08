import React, { useState } from 'react'

import {
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { CovidStatus, User } from '@prisma/client';

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IActionType } from '@/types/global';
import Link from 'next/link';
import { formatDate } from 'date-fns';
import { FORMAT } from '@/lib/utils';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import UiLoading from '@/components/ui/loading-page';
import { useQueryClient } from '@tanstack/react-query';
import { USERS_ROUTES } from '@/routes/users.routes';

interface IProps {
    data: User;
    handleAction: (data: any, action: IActionType) => void
}

const url = `/api/covid/auto-update`


const Row = ({ data: d, handleAction }: IProps) => {
    const data = d as any

    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState("");
    const queryClient = useQueryClient();

    async function handleUpdateNegative() {
        setIsLoading(true)
        try {
            setLoadingMessage(`Updating request...`)
            const res5 = await axios.post(`${url}/own`, { userId: data.id, status: "NEGATIVE" });
            console.log(res5);

            setLoadingMessage(`Success!`)
            toast({ description: "Success!" });

            await queryClient.invalidateQueries({ queryKey: [USERS_ROUTES.ADMIN.FETCH_ALL.KEY], exact: false })

        } catch (error) {
            console.log({ error })
            toast({ description: `Something went wrong` });
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <UiLoading type='page' message={loadingMessage} />
    }

    return (
        <TableRow>
            <TableCell>{data.role}</TableCell>
            <TableCell className='flex gap-2 justify-start items-center'>
                <span>
                    {data.name}
                </span>
                {data?.userProfile && (
                    <>
                        <div className="px-2 py-1 text-xs rounded-full border">{data.userProfile.status}</div>
                        {/* {data.userProfile?.dateTestedPositive && (
                            <span className="">{formatDate(data.userProfile?.dateTestedPositive, FORMAT)}</span>
                        )} */}
                    </>
                )}
            </TableCell>
            <TableCell>{data.email}</TableCell>
            <TableCell className='flex justify-end items-center'>
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild onClick={() => setOpen(true)}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Link href={`/users/admin/update/${data.id}`}>
                            <DropdownMenuItem
                                onClick={() => {
                                    setOpen(false)
                                    handleAction(data, "update")
                                }}
                            >
                                Edit
                            </DropdownMenuItem>
                        </Link>
                        {data?.userProfile?.status === CovidStatus.NEGATIVE && (
                            <DropdownMenuItem
                                onClick={() => {
                                    setOpen(false)
                                    handleAction(data, "change-status-positive")
                                }}
                            >
                                Update to positive
                            </DropdownMenuItem>
                        )}
                        {data?.userProfile?.status === CovidStatus.POSITIVE && (
                            <DropdownMenuItem
                                onClick={() => {
                                    setOpen(false)
                                    handleAction(data, "change-status-negative")
                                    handleUpdateNegative()
                                }}
                            >
                                Update to negative
                            </DropdownMenuItem>
                        )}
                        {data?.userProfile?.status === CovidStatus.EXPOSED && (
                            <>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setOpen(false)
                                        handleAction(data, "change-status-positive")
                                    }}
                                >
                                    Update to positive
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setOpen(false)
                                        handleAction(data, "change-status-negative")
                                        handleUpdateNegative()
                                    }}
                                >
                                    Update to negative
                                </DropdownMenuItem>
                            </>
                        )}
                        <DropdownMenuItem
                            onClick={() => {
                                setOpen(false)
                                handleAction(data, "delete")
                            }}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow >
    )
}

export default Row