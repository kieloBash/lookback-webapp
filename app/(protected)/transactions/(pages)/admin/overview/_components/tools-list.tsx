"use client"
import { Button } from '@/components/ui/button'
import { DownloadIcon, ShareIcon } from 'lucide-react'
import React from 'react'

const ToolsList = () => {
    function handleDownload() {

    }

    function handleShare() {

    }

    return (
        <ul className='flex justify-center items-center gap-1'>
            <li>
                <Button variant={"outline"} className='size-7 p-1 rounded-full' type='button' onClick={handleDownload}><DownloadIcon /></Button>
            </li>
            <li>
                <Button variant={"outline"} className='size-7 p-1 rounded-full' type='button' onClick={handleShare}><ShareIcon /></Button>
            </li>
        </ul>
    )
}

export default ToolsList