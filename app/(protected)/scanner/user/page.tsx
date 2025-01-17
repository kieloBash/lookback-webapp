'use client'
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { ShieldQuestionIcon } from 'lucide-react';

import React, { useState } from 'react'

const UserScannerPage = () => {
    const [scanned, setScanned] = useState<IDetectedBarcode[]>([])
    return (
        <section className="w-full h-full flex flex-col justify-center items-center gap-4 p-4">
            <div className="w-full max-w-sm overflow-hidden aspect-square">
                <Scanner onScan={(result) => {
                    setScanned(result);
                }} formats={["qr_code", "rm_qr_code"]} />
            </div>
            {scanned.length ? <>
                <p className="text-lg text-muted-foreground text-center bg-muted p-1 rounded">{JSON.stringify(scanned)}</p>
            </> :
                <p className="text-lg text-muted-foreground text-center">Please scan a QR Code from a management service!</p>
            }
            <ShieldQuestionIcon className='size-32 text-primary' />
        </section>
    )
}

export default UserScannerPage