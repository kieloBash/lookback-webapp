import React from 'react'
import { Button } from '../ui/button'
import LoadingIcon from '../ui/loading-icon'

interface IProps {
    disabled: boolean;
    children: React.ReactNode;
}
const SubmitButton = ({ disabled, children }: IProps) => {
    return (
        <Button disabled={disabled} type='submit' className='flex justify-center items-center gap-2'>
            {children}
            {disabled && <LoadingIcon />}
        </Button>
    )
}

export default SubmitButton