'use client'
import React from 'react'
import { useState } from "react";

import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { APP_NAME, handleAxios } from '@/lib/utils'

import UserRolesForm from './_components/user-roles'


import { useRouter } from 'next/navigation';
import FormSubmit from '@/components/forms/submit-button';
import { OnboardingSchema } from '@/schemas/auth.schema';
import { MapPinCheckIcon } from 'lucide-react';
import UserForm from './_components/user-form';
import { Button } from '@/components/ui/button';
import ManagementForm from './_components/management-form';
import { AUTH_ROUTES } from '@/routes/auth.routes';

const url = AUTH_ROUTES.ONBOARDING.URL;
const key = "";

const OnboardingPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const form = useForm<z.infer<typeof OnboardingSchema>>({
        resolver: zodResolver(OnboardingSchema),
        defaultValues: {
            user: undefined,
            management: undefined,
            role: "USER",
        },
    });

    async function onSubmit(values: z.infer<typeof OnboardingSchema>) {
        // console.log(values)
        setIsLoading(true);
        await handleAxios({ values, url })
            .then(async () => {
                // form.reset();
                window.location.reload();
            })
            .catch(() => {
                console.log("Error");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const errorMsg = form.formState.errors;

    return (
        <section className="w-full min-h-svh">
            <Form {...form}>
                <form className='w-full flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10' onSubmit={form.handleSubmit(onSubmit)}>

                    {
                        page === 1 && (
                            <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
                                <div className="w-full max-w-sm">
                                    <div className="flex flex-col items-center gap-2">
                                        <div
                                            className="flex flex-col items-center gap-2 font-medium"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-md">
                                                <MapPinCheckIcon className="size-6" />
                                            </div>
                                            <span className="sr-only">{APP_NAME}</span>
                                        </div>
                                        <h1 className="text-xl font-bold">Welcome to {APP_NAME}</h1>
                                        <div className="text-center text-sm">
                                            Before you start, we need to know a few things about you.
                                        </div>
                                    </div>
                                </div>
                                <UserRolesForm form={form} />
                                <div className="w-full max-w-sm mt-10">
                                    <Button className='w-full' type='button' onClick={() => setPage(2)}>Next</Button>
                                </div>
                            </div>
                        )
                    }

                    {
                        page === 2 && (
                            <div className="size-full flex flex-col gap-4 justify-center items-center">
                                <div className="w-full max-w-sm">
                                    <div className="flex flex-col items-center gap-2">
                                        <h1 className="text-xl font-bold">{form.watch("role")}</h1>
                                        <div className="text-center text-sm">
                                            {form.watch("role") === "USER" ? "Please fill up your personal details." : "Please fill up the management details."}
                                        </div>
                                    </div>
                                </div>
                                {form.watch('role') === 'USER' ? <UserForm form={form} isLoading={isLoading} /> : <ManagementForm form={form} isLoading={isLoading} />}

                                {Object.keys(errorMsg).length > 0 && (
                                    <p className="text-center text-red-500 text-sm">
                                        Please fill up all the fields.
                                    </p>
                                )}

                                <div className="w-full max-w-md flex justify-center items-center gap-2 mttt-6">
                                    <Button className='w-full' type='button' onClick={() => setPage(1)} variant={"outline"}>Back</Button>
                                    <FormSubmit
                                        className='w-full'
                                        disabled={isLoading}
                                    >
                                        <span>Submit</span>
                                    </FormSubmit>
                                </div>
                            </div>
                        )
                    }

                </form>
            </Form>
        </section>
    )
}

export default OnboardingPage