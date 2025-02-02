"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WormIcon as Virus, ShieldCheck, NotebookPen, ScanHeartIcon, AmbulanceIcon, CrossIcon, BandageIcon, HandHelpingIcon, SprayCanIcon, SpeechIcon, ComputerIcon } from 'lucide-react'
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
                <CardTitle className="text-2xl font-bold text-center">
                    {status === "PENDING" && <span>Waiting for Approval</span>}
                    {status === "NEGATIVE" && <span>SAFE</span>}
                    {status === "POSITIVE" && <span>DIAGNOSED</span>}
                    {status === "EXPOSED" && <span>EXPOSED</span>}
                </CardTitle>
                <CardDescription className="text-center">
                    {status === "PENDING" && <span>Please wait while the admin checks your request! Thank you!</span>}
                    {status === "NEGATIVE" && <span>You were not exposed to anyone who reported a COVID-19 positive via the Lookback web app.</span>}
                    {status === "POSITIVE" && <span>You have been diagnosed to have COVID-19. Please practice caution and quarantine for 14 days.</span>}
                    {status === "EXPOSED" && <span>You were exposed during the previous 14 days.</span>}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
                <h2 className="text-center text-sm font-normal">
                    {status === "NEGATIVE" && <span>You were not exposed to anyone who reported a COVID-19 positive via the Lookback web app.</span>}
                    {status === "POSITIVE" && <span>You have been diagnosed with COVID-19. Please follow the guidelines below to ensure your safety and the safety of others. Stay safe and take care of your health.</span>}
                    {status === "EXPOSED" && <span>Someone has used the app to report a COVID-19 diagnosis. You were close to them for 15 minutes or more in one of your recent history logs.</span>}
                </h2>

                <div className="space-y-4 mt-4">
                    <ul>
                        {status === "NEGATIVE" && (
                            <>
                                <span className="text-xs text-muted-foreground">Kindly observe the following when going to public places: </span>
                                <li className="flex justify-start items-center px-1 py-2 gap-2">
                                    <div className="size-10 relative p-2 rounded bg-primary">
                                        <SpeechIcon className="size-full" />
                                    </div>
                                    <h3 className="text-left text-sm w-full">Social Distancing</h3>
                                </li>
                                <li className="flex justify-start items-center px-1 py-2 gap-2">
                                    <div className="size-10 relative p-2 rounded bg-primary">
                                        <BandageIcon className="size-full" />
                                    </div>
                                    <h3 className="text-left text-sm w-full">Facemask</h3>
                                </li>
                                <li className="flex justify-start items-center px-1 py-2 gap-2">
                                    <div className="size-10 relative p-2 rounded bg-primary">
                                        <SprayCanIcon className="size-full" />
                                    </div>
                                    <h3 className="text-left text-sm w-full">Alcohol</h3>
                                </li>
                                <li className="flex justify-start items-center px-1 py-2 gap-2">
                                    <div className="size-10 relative p-2 rounded bg-primary">
                                        <HandHelpingIcon className="size-full" />
                                    </div>
                                    <h3 className="text-left text-sm w-full">Wash hands</h3>
                                </li>
                            </>
                        )}
                        {status === "EXPOSED" && (
                            <>
                                <span className="text-xs text-muted-foreground">Kindly do the following for COVID-19 exposure procedures:</span>
                                <li className="flex justify-start items-center px-1 py-2 gap-2">
                                    <div className="size-10 relative p-2 rounded bg-primary">
                                        <ScanHeartIcon className="size-full" />
                                    </div>
                                    <h3 className="text-left text-sm w-full">Self quarantine for 7-14 days</h3>
                                </li>
                                <li className="flex justify-start items-center px-1 py-2 gap-2">
                                    <div className="size-10 relative p-2 rounded bg-primary">
                                        <BandageIcon className="size-full" />
                                    </div>
                                    <h3 className="text-left text-sm w-full">Wear face mask</h3>
                                </li>
                                <li className="flex justify-start items-center px-1 py-2 gap-2">
                                    <div className="size-10 relative p-2 rounded bg-primary">
                                        <CrossIcon className="size-full" />
                                    </div>
                                    <h3 className="text-left text-sm w-full">Follow the safety protocols regarding covid-19</h3>
                                </li>
                                <li className="flex justify-start items-center px-1 py-2 gap-2">
                                    <div className="size-10 relative p-2 rounded bg-primary">
                                        <ComputerIcon className="size-full" />
                                    </div>
                                    <h3 className="text-left text-sm w-full">Monitor and inform the LGU and the medical team about your everyday status.</h3>
                                </li>
                            </>
                        )}
                        {status === "POSITIVE" && (
                            <>
                                <span className="text-xs text-muted-foreground">Kindly do the following for COVID-19 exposure procedures:</span>
                                <li className="flex justify-start items-center px-1 py-2 gap-2">
                                    <div className="size-10 relative p-2 rounded bg-primary">
                                        <ScanHeartIcon className="size-full" />
                                    </div>
                                    <h3 className="text-left text-sm w-full">Self quarantine for 7-14 days</h3>
                                </li>
                                <li className="flex justify-start items-center px-1 py-2 gap-2">
                                    <div className="size-10 relative p-2 rounded bg-primary">
                                        <BandageIcon className="size-full" />
                                    </div>
                                    <h3 className="text-left text-sm w-full">Wear face mask</h3>
                                </li>
                                <li className="flex justify-start items-center px-1 py-2 gap-2">
                                    <div className="size-10 relative p-2 rounded bg-primary">
                                        <CrossIcon className="size-full" />
                                    </div>
                                    <h3 className="text-left text-sm w-full">Test yourself using a covid kit if available</h3>
                                </li>
                                <li className="flex justify-start items-center px-1 py-2 gap-2">
                                    <div className="size-10 relative p-2 rounded bg-primary">
                                        <AmbulanceIcon className="size-full" />
                                    </div>
                                    <h3 className="text-left text-sm w-full">If symptoms occur, contact any LGU or medical team for assistance.</h3>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </CardContent>
            <CardFooter className="w-full flex justify-center items-center">
                <Button
                    disabled={status !== "NEGATIVE" && status !== "EXPOSED"}
                    onClick={() => router.push("/requests")}
                    type="button"
                    className="w-full lg:max-w-none max-w-xs"
                >
                    {status === "PENDING" && <span>Pending Request</span>}
                    {status === "NEGATIVE" && <span>I have been diagnosed</span>}
                    {status === "POSITIVE" && <span>Please Stay Safe and Quarantine</span>}
                    {status === "EXPOSED" && <span>Please Conduct a COVID Test</span>}
                </Button>
            </CardFooter>
        </Card>
    )
}

