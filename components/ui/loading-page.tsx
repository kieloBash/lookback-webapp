import { cn } from '@/lib/utils'
import { Loader2Icon } from 'lucide-react'
import React from 'react'
import MainLoadingPage from '../main-loading'

const LoadingIcon = ({ className }: { className?: string }) => {
    const CLASS_NAME = cn("size-5 animate-spin", className)
    return <Loader2Icon className={CLASS_NAME} />
}

const LoadingPage = ({ className, message }: { className?: string, message?: string }) => {
    const CLASS_NAME = cn("fixed w-screen h-screen z-[150] bg-white top-0 left-0 flex justify-center items-center", className)
    return (
        <article className={CLASS_NAME}>
            {/* <LoadingIcon className={className} /> */}
            <MainLoadingPage message={message} />
        </article>
    )
}

interface IProps {
    className?: string;
    message?: string;
    type?: "page" | "icon";
}

const UiLoading = ({ type = "page", className, message }: IProps) => {

    if (type === "icon")
        return <LoadingIcon className={className} />

    if (type === "page")
        return <LoadingPage className={className} message={message} />
}

export default UiLoading