'use client'
import useManagementProfileId from '@/hooks/management/use-management-profile';
import { handleAxios } from '@/lib/utils';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { ShieldQuestionIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import React, { useCallback, useEffect, useState } from 'react'
import HistoryLogModal from './_components/log-modal';
import { useQueryClient } from '@tanstack/react-query';
import { HISTORY_ROUTES } from '@/routes/history.routes';

const UserScannerPage = () => {
    const [scanned, setScanned] = useState<boolean>(false);
    const [updatingHistory, setUpdatingHistory] = useState<boolean>(false);
    const [token, setToken] = useState("")
    const profile = useManagementProfileId({ id: token });
    const router = useRouter();
    const queryClient = useQueryClient();

    const handleCheckQR = (res: IDetectedBarcode[]) => {
        if (res.length === 0) return null;
        setScanned(true);

        const rawValue = res[0].rawValue;
        const url = new URL(rawValue);
        const token = url.searchParams.get('token');
        if (token) {
            setToken(token);
        }
    }

    const handleLogHistory = useCallback(() => {
        if (token && profile.payload) {
            setUpdatingHistory(true);

            handleAxios({ values: { token }, url: "/api/log/create" })
                .then((res) => {
                    setScanned(false);
                    setToken("");
                    queryClient.invalidateQueries({ queryKey: [HISTORY_ROUTES.USER.FETCH_ALL.KEY], exact: false })
                    // router.push("/scanner");
                })
                .finally(() => { setUpdatingHistory(false) })
        }
    }, [profile.payload, token]);

    useEffect(() => {
        handleLogHistory();
    }, [handleLogHistory])

    return (
        <section className="w-full h-full flex flex-col justify-center items-center gap-4 p-4">
            <div className="w-full max-w-sm overflow-hidden aspect-square">
                <Scanner allowMultiple scanDelay={10} onScan={(result) => {
                    handleCheckQR(result)
                }} formats={["qr_code", "rm_qr_code"]} />
            </div>
            {updatingHistory && (
                <HistoryLogModal open={updatingHistory} setOpen={setUpdatingHistory} />
            )}
            {scanned ? <>
                {profile?.payload ? <p className="text-lg text-muted-foreground text-center bg-muted p-1 rounded">{profile.payload.user.name}</p> :
                    <>
                        {profile.isLoading || profile.isFetching ? <p className="text-lg text-muted-foreground text-center bg-muted p-1 rounded">Please wait while check the qr code!</p> :
                            <p className="text-lg text-muted-foreground text-center bg-muted p-1 rounded">Invalid QR. Please try again!</p>}
                    </>}
            </> :
                <p className="text-lg text-muted-foreground text-center">Please scan a QR Code from a management service!</p>
            }
            <ShieldQuestionIcon className='size-32 text-primary' />
        </section>
    )
}

export default UserScannerPage