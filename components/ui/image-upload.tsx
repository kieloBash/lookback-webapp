'use client'
import clsx from 'clsx'
import { UploadIcon } from 'lucide-react'
import { CldUploadButton } from 'next-cloudinary'
import Image from 'next/image'
import React from 'react'
import UiToolTip from './tooltip-ui'

interface IProps {
    handleUpload: (d: any) => void
    preset: string
    className?: string
    tipLabel?: string
    imageSrc?: string
    hasImage?: boolean
}

const UiImageUpload = (
    { handleUpload, preset, className, tipLabel = "Click to add picture", hasImage = false, imageSrc = "" }
        : IProps) => {

    const CLASSNAME = clsx("flex size-full items-center justify-center rounded-md border border-dashed", className)

    return (
        <div className="flex justify-center items-center size-full">
            <UiToolTip label={tipLabel}>
                <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onSuccess={handleUpload}
                    uploadPreset={preset}
                    className={CLASSNAME}
                >
                    {hasImage ? <>
                        <div className="rounded-lg shadow overflow-hidden relative size-full">
                            <Image
                                src={imageSrc || ""}
                                alt="Image"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </> : <>
                        <UploadIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                    </>}
                </CldUploadButton>
            </UiToolTip>
        </div>
    )
}

export default UiImageUpload;