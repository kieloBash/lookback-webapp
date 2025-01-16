'use client'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { QRCodeCanvas } from 'qrcode.react';

interface IProps {
    value: string
}
const UiQRView = ({ value }: IProps) => {

    const qrCodeUrl = useMemo(() => {
        if (value) {
            return `${window.location.origin}/qr?token=${value}`;
        }
        return undefined
    }, [value])

    return (
        <div className='p-2 bg-white rounded'>
            {qrCodeUrl && (
                <Link href={qrCodeUrl} target="_blank">
                    <QRCodeCanvas value={qrCodeUrl} size={256} />
                </Link>
            )}
        </div>
    )
}

export default UiQRView