import React from 'react'
import Form from './_components/form'
import { Metadata } from 'next';

const SignInPage = () => {
    return (
        <div className="w-full min-h-screen flex flex-col py-10 px-20 gap-14 bg-gradient-to-br from-primary/40 via-primary/70 to-primary/40">
            <div className="flex-1 container flex justify-center items-center">
                <Form />
            </div>
        </div>
    )
}

export default SignInPage