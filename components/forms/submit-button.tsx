import React from 'react'
import { Button } from '../ui/button'
import LoadingIcon from '../ui/loading-icon'
import { cn } from '@/lib/utils';

interface IProps {
    disabled: boolean;
    children: React.ReactNode;
    className?: string
}
const SubmitButton = ({ disabled, children, className }: IProps) => {
    return (
        <Button disabled={disabled} type='submit' className={cn('flex justify-center items-center gap-2', className)}>
            {children}
            {disabled && <LoadingIcon />}
        </Button>
    )
}

export default SubmitButton