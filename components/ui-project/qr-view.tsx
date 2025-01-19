'use client'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { QRCodeCanvas } from 'qrcode.react';

interface IProps {
    value: string
}
const URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

const UiQRView = ({ value }: IProps) => {

    const qrCodeUrl = useMemo(() => {
        if (value) {
            return `${URL}/qr?token=${value}`;
        }
        return ""
    }, [value])

    if (qrCodeUrl)
        return (
            <div className='p-2 bg-white rounded'>
                {qrCodeUrl && (
                    <Link href={qrCodeUrl} target="_blank">
                        <QRCodeCanvas value={qrCodeUrl} size={256} />
                    </Link>
                )}
            </div>
        )

    return null;
}

export default UiQRView