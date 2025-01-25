import React from 'react'

import {
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { User } from '@prisma/client';

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

interface IProps {
    data: User;
    handleAction: (data: any, action: IActionType) => void
}

const Row = ({ data: d, handleAction }: IProps) => {
    const data = d as any
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
                        {data.userProfile?.dateTestedPositive && (
                            <span className="">{formatDate(data.userProfile?.dateTestedPositive, FORMAT)}</span>
                        )}
                    </>
                )}
            </TableCell>
            <TableCell>{data.email}</TableCell>
            <TableCell className='flex justify-end items-center'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Link href={`/users/admin/update/${data.id}`}>
                            <DropdownMenuItem
                                onClick={() => handleAction(data, "update")}
                            >
                                Edit
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                            onClick={() => handleAction(data, "delete")}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}

export default Row