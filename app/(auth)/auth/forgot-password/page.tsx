import React from 'react'
import { ForgotPasswordForm } from './form'

const ForgotPasswordPage = () => {
    return (
        <div className="flex size-full min-h-screen flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="size-full max-w-sm flex justify-center items-center">
                <ForgotPasswordForm />
            </div>
        </div>
    )
}

export default ForgotPasswordPage