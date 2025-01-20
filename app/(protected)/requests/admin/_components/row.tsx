'use client'
import { FullRequestType } from '@/types/user.type'
import React, { useState } from 'react'

import {
    TableCell,
    TableRow,
} from "@/components/ui/table"

import { FORMAT, handleAxios } from '@/lib/utils'
import { formatDate } from 'date-fns'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { RequestStatus } from '@prisma/client'
import { REQUESTS_ROUTES } from '@/routes/requests.routes'
import { useQueryClient } from '@tanstack/react-query'

interface IProps {
    data: FullRequestType;
}

const domain = process.env.NEXT_PUBLIC_APP_URL;

const Row = ({ data: d }: IProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleChangeStatus = async (newStatus: RequestStatus) => {
        setIsLoading(true);
        await handleAxios({ values: { newStatus, id: d.id }, url: REQUESTS_ROUTES.ADMIN.UPDATE.URL })
            .then((res) => {
                queryClient.invalidateQueries({ queryKey: [REQUESTS_ROUTES.ADMIN.FETCH_ALL.KEY], exact: false });
            })
            .catch((e) => {
                console.log(e)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <TableRow>
            <TableCell>{d.user.userProfile.fname}</TableCell>
            <TableCell className="font-medium">{formatDate(d.dateOfSymptoms, FORMAT)}</TableCell>
            <TableCell className="font-medium">{formatDate(d.dateOfTesting, FORMAT)}</TableCell>
            <TableCell>{d.user.userProfile.citymunCode}</TableCell>
            <TableCell>
                <Link href={`${domain}/_next/image?url=${d.medicalImages[0]}&w=1920&q=75`} target='_blank'>
                    <div className="size-16 overflow-hidden rounded relative">
                        <Image fill src={d.medicalImages[0]} alt='@medical' className='object-cover object-center size-full' />
                    </div>
                </Link>
            </TableCell>
            <TableCell>{d.symptoms}</TableCell>
            <TableCell className='text-right'>{d.status}</TableCell>
            <TableCell>
                {d.status === "PENDING" && (
                    <div className="flex justify-end items-center gap-2">
                        <Button disabled={isLoading} type='button' size={"sm"} variant={"outline"} onClick={() => handleChangeStatus("QUALIFIED")}>Accept</Button>
                        <Button disabled={isLoading} type='button' size={"sm"} variant={"destructive"} onClick={() => handleChangeStatus("DISQUALIFIED")}>Deny</Button>
                    </div>
                )}
            </TableCell>
        </TableRow>
    )
}

export default Row