import React from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils';
import UiLoading from '../ui-project/loading-page';

interface IProps {
    disabled: boolean;
    children: React.ReactNode;
    className?: string;
    isDirty?: boolean;
}
const FormSubmit = ({ disabled, children, className, isDirty = false }: IProps) => {
    return (
        <Button disabled={disabled || isDirty} type='submit' className={cn('flex justify-center items-center gap-2', className)}>
            {children}
            {disabled && <UiLoading type='icon' />}
        </Button>
    )
}

export default FormSubmit