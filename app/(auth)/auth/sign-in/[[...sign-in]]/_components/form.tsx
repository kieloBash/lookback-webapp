'use client'
import React, { useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginSchema } from '@/schemas/auth.schema';
import { Card } from '@/components/ui/card';
import { UserRole } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { handleLoginAccount } from '../../../_actions/login';
import { signIn } from 'next-auth/react';
import { useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { FormTemplate } from '@/components/forms/form-template';
import { FormInput } from '@/components/forms/form-input';

const Form = () => {

    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleSubmit = async (values: z.infer<typeof LoginSchema>) => {
        toast({
            title: "Please wait",
            description: "Please wait while we process your request!",
        });
        setIsLoading(true)
        const res = await handleLoginAccount(values)
        if (res.success) {
            await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
            }).then(() => {
                toast({
                    title: "Success!",
                    description: res.success,
                });
            })
            form.reset();
        } else {
            toast({
                title: "An error occured!",
                variant: "destructive",
                description: res.error,
            });
        }
        setIsLoading(false)
    };

    return (
        <Card className="w-full max-w-md px-6 py-8">
            <FormTemplate
                form={form}
                FormSchema={LoginSchema}
                handleSubmit={handleSubmit}
                submit_label="Login"
                disabled={isLoading}
            >
                <h1 className='text-center text-2xl font-bold'>LOG IN</h1>
                <FormInput
                    control={form.control}
                    name="email"
                    label="Email Address"
                    type="email"
                    required={true}
                    disabled={isLoading}
                    placeholder="Email Address"
                />
                <FormInput
                    control={form.control}
                    name="password"
                    label="Password"
                    type="password"
                    required={true}
                    disabled={isLoading}
                    placeholder="Password"
                />
            </FormTemplate>
            <Link className="pt-4 flex justify-center items-center" href={"/auth/sign-up"}>
                <Button type='button' variant={"link"}>
                    <p className="text-center">Don&apos; have an account yet?</p>
                </Button>
            </Link>
        </Card>
    )
}

export default Form