"use client"

import { useMemo } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WormIcon as Virus, ShieldCheck, NotebookPen } from 'lucide-react'
import { CovidStatus, RequestStatus } from "@prisma/client"
import { useRouter } from "next/navigation"

interface IProps {
    hasRequest: boolean;
    covidStatus: CovidStatus;
}

export default function CovidStatusCard({ hasRequest, covidStatus }: IProps) {
    const router = useRouter();

    const status = useMemo(() => {
        if (hasRequest) {
            return "PENDING";
        }

        return covidStatus;
    }, [hasRequest, covidStatus]);


    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">COVID-19 Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
                {status === "PENDING" && <NotebookPen className="size-24" />}
                {status === "NEGATIVE" && <ShieldCheck className="size-24" />}
                {status === "POSITIVE" && <Virus className="size-24" />}
                <p className="text-center">
                    {status}
                </p>
            </CardContent>
            <CardFooter className="w-full flex justify-center items-center">
                <Button
                    disabled={status !== "NEGATIVE"}
                    onClick={() => router.push("/requests")}
                    type="button"
                    className="w-full lg:max-w-none max-w-xs"
                >
                    {status === "PENDING" && <span>Pending Request</span>}
                    {status === "NEGATIVE" && <span>Mark as Positive</span>}
                    {status === "POSITIVE" && <span>Please Stay Safe and Quarantine</span>}
                </Button>
            </CardFooter>
        </Card>
    )
}

