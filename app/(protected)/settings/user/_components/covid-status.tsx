"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WormIcon as Virus, ShieldCheck } from 'lucide-react'
import { handleAxios } from "@/lib/utils"

export default function CovidStatusCard() {
    const [isLoading, setIsLoading] = useState(false);
    const [isPositive, setIsPositive] = useState(false)

    const toggleStatus = async () => {

        const newStatus = isPositive ? "NEGATIVE" : "POSITIVE";
        if (!isPositive) {
            //prev status is negative so will be positive
            setIsLoading(true);
            await handleAxios({ values: { newStatus }, url: "/api/covid/status/update" })
                .then(async () => {

                })
                .catch(() => {
                    console.log("Error");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }


        setIsPositive(!isPositive)
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">COVID-19 Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
                {isPositive ? (
                    <Virus className="w-24 h-24 text-red-500" />
                ) : (
                    <ShieldCheck className="w-24 h-24 text-green-500" />
                )}
                <p className="text-xl font-semibold">
                    {isPositive ? "Positive" : "Negative"}
                </p>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button
                    disabled={isLoading}
                    type="button"
                    onClick={toggleStatus}
                    variant={isPositive ? "destructive" : "default"}
                    className="w-full max-w-xs"
                >
                    {isPositive ? "Mark as Negative" : "Mark as Positive"}
                </Button>
            </CardFooter>
        </Card>
    )
}

