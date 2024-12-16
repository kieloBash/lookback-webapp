'use client'
import React, { useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RegisterSchema } from '@/schemas/auth.schema';
import { Card } from '@/components/ui/card';
import { UserRole } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { handleRegisterAccount } from '../../../_actions/register';
import Link from 'next/link';
import { FormTemplate } from '@/components/forms/form-template';
import { FormInput } from '@/components/forms/form-input';

const Form = () => {

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: UserRole.STAFF
        },
    });

    const handleSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        toast({
            title: "Please wait",
            description: "Please wait while we process your request!",
        });
        setIsLoading(true)
        const res = await handleRegisterAccount(values)
        if (res.success) {
            toast({
                title: "Success!",
                description: res.success,
            });
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

    const rolesArr = [{ value: UserRole.STAFF, label: "Are you a pet owner?" }, { value: UserRole.STAFF, label: "Are you a clinic staff?" }]

    return (
        <Card className="w-full max-w-md px-6 py-8">
            <FormTemplate
                form={form}
                FormSchema={RegisterSchema}
                handleSubmit={handleSubmit}
                submit_label="Join"
                disabled={isLoading}
            >
                <h1 className='text-center text-2xl font-bold'>REGISTER</h1>
                <div className="grid grid-cols-2 gap-2 pt-4 pb-2">
                    {rolesArr.map((item) => {
                        const active = form.watch("role") === item.value;
                        return (
                            <Button disabled={isLoading} variant={active ? "default" : "outline"} type='button' key={item.value} onClick={() => form.setValue('role', item.value)}>{item.label}</Button>
                        )
                    })}
                </div>
                <FormInput
                    control={form.control}
                    name="fullName"
                    label={form.watch("role") === UserRole.STAFF ? "Full Name" : "Name of Staff"}
                    type="text"
                    required={true}
                    disabled={isLoading}
                    placeholder="Full Name"
                />
                <FormInput
                    control={form.control}
                    name="email"
                    label={form.watch("role") === UserRole.STAFF ? "Email Address" : "Emaill Address of clinic staff"}
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
                <FormInput
                    control={form.control}
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    required={true}
                    disabled={isLoading}
                    placeholder="Password"
                />
            </FormTemplate>
            <Link className="pt-4 flex justify-center items-center" href={"/auth/sign-in"}>
                <Button type='button' variant={"link"}>
                    <p className="text-center">Already have an account?</p>
                </Button>
            </Link>
        </Card>
    )
}

export default Form