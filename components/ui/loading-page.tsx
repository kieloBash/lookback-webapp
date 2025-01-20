import { cn } from '@/lib/utils'
import { Loader2Icon } from 'lucide-react'
import React from 'react'

const LoadingIcon = ({ className }: { className?: string }) => {
    const CLASS_NAME = cn("size-5 animate-spin", className)
    return <Loader2Icon className={CLASS_NAME} />
}

const LoadingPage = ({ className }: { className?: string }) => {
    const CLASS_NAME = cn("w-full h-full flex justify-center items-center", className)
    return (
        <article className={CLASS_NAME}>
            <LoadingIcon className={className} />
        </article>
    )
}

interface IProps {
    className?: string;
    type?: "page" | "icon";
}

const UiLoading = ({ type = "page", className }: IProps) => {

    if (type === "icon")
        return <LoadingIcon className={className} />

    if (type === "page")
        return <LoadingPage className={className} />
}

export default UiLoading