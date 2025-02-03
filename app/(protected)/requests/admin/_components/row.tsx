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
import UiCodeLabel from '@/components/ui-project/code-label'
import { toast } from '@/hooks/use-toast'
import axios from 'axios'

interface IProps {
    data: FullRequestType;
}

const domain = process.env.NEXT_PUBLIC_APP_URL;

const Row = ({ data: d }: IProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleChangeStatus = async (newStatus: RequestStatus) => {
        setIsLoading(true);
        const url = newStatus === "QUALIFIED" ? `${REQUESTS_ROUTES.ADMIN.UPDATE.URL}/accept` : `${REQUESTS_ROUTES.ADMIN.UPDATE.URL}/deny`;

        try {
            const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            toast({ title: "Please wait...", description: "We are currently processing your request." })
            sleep(2000);
            
            if (newStatus === "QUALIFIED") {
                toast({ description: `Finding histories and affected users...` });
                const res1 = await axios.post(`${url}/user-history`, { newStatus, id: d.id });
                console.log(res1.data);
                const user_histories = res1.data.values.histories;
                toast({ description: `We found ${user_histories.length} history of the user.` })

                // toast({ description: `Finding affected users...` });
                const res2 = await axios.post(`${url}/related-history`, { user_histories });
                console.log(res2.data);
                const affectedUsers = res2.data.values.affectedUsers


                const userIds: string[] = affectedUsers
                    .map((u: any) => {
                        if (u.userProfile.status === "NEGATIVE") {
                            console.log(u);
                            return u.id;
                        }
                    })
                    .filter((d: any) => d !== undefined);

                toast({ description: `We found ${userIds.length} affected users` });
                await sleep(1000);
                console.log(userIds)

                if (userIds.length > 0) {
                    toast({ description: `Sending notifications to affected users...` });
                    const res3 = await axios.post(`${url}/notify`, { userIds, diagnosedId: user_histories[0].userId });
                    console.log(res3);

                    toast({ description: `Making contact tracing record...` });
                    const res4 = await axios.post(`${url}/contact-tracing`, { userIds, diagnosedId: user_histories[0].userId, dateOfTesting: d.dateOfTesting });
                    console.log(res4); 
                } else {
                    toast({ title: "No Affected Users", description: `There were no affected users detected from the system.` });
                }

                await sleep(2000);

                toast({ description: `Updating request...` });
                const res5 = await axios.post(`${url}/last`, { requestId: d.id, userId: user_histories[0].userId, dateOfTesting: d.dateOfTesting });
                console.log(res5);
                toast({ description: "Success!" });
            } else {
                const res = await axios.post(`${url}`, { newStatus, id: d.id });
                console.log(res);
                toast({ description: "Success!" });
            }
            queryClient.invalidateQueries({ queryKey: [REQUESTS_ROUTES.ADMIN.FETCH_ALL.KEY], exact: false });

        } catch (error: any) {
            console.error(error.response.data);
            toast({ description: error.response.data, variant: "destructive" })
        } finally {
            setIsLoading(false)
        }

        // await handleAxios({ values: { newStatus, id: d.id }, url })
        //     .then((res) => {
        //         if (res.values) {
        //             toast({
        //                 title: "Contact List",
        //                 description: res.map((d: any) => d.email).join(", "),
        //             })
        //         }
        //         queryClient.invalidateQueries({ queryKey: [REQUESTS_ROUTES.ADMIN.FETCH_ALL.KEY], exact: false });
        //     })
        //     .catch((e) => {
        //         console.log(e)
        //         // toast({
        //         //     title: "Error",
        //         //     variant: "destructive",
        //         //     description: e.response,
        //         // })
        //     })
        //     .finally(() => {
        //         setIsLoading(false)
        //     })
    }

    return (
        <TableRow>
            <TableCell>{d.user.userProfile.fname}</TableCell>
            <TableCell className="font-medium">{formatDate(d.dateOfSymptoms, FORMAT)}</TableCell>
            <TableCell className="font-medium">{formatDate(d.dateOfTesting, FORMAT)}</TableCell>
            <TableCell>
                <UiCodeLabel value={d.user.userProfile.citymunCode} type="city" />
            </TableCell>
            <TableCell>
                {d.status === "PENDING" && (
                    <Link href={`${domain}/_next/image?url=${d.medicalImages[0]}&w=1920&q=75`} target='_blank'>
                        <div className="size-16 overflow-hidden rounded relative">
                            <Image fill src={d.medicalImages[0]} alt='@medical' className='object-cover object-center size-full' />
                        </div>
                    </Link>
                )}
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