import React from 'react'

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface IProps {
    children: React.ReactNode
    label: string
    side?: "right" | "top" | "bottom" | "left" | undefined
}

const UiToolTip = ({ children, label, side = "right" }: IProps) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side}>{label}</TooltipContent>
        </Tooltip>
    )
}

export default UiToolTip