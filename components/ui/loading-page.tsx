import { Loader2Icon } from 'lucide-react'
import React from 'react'

const LoadingTemplate = () => {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Loader2Icon className='animate-spin size-5' />
        </div>
    )
}

export default LoadingTemplate