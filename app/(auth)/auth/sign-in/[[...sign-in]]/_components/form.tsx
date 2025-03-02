'use client'
import React, { useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginSchema } from '@/schemas/auth.schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { toast } from '@/hooks/use-toast';
import { handleLoginAccount } from '../../../_actions/login';
import { signIn } from 'next-auth/react';
import { useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { APP_EMAIL, APP_NAME, cn } from '@/lib/utils';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/forms/form-input';
import Link from 'next/link';
import LoadingIcon from '@/components/ui/loading-icon';

import emailjs from "emailjs-com";
import { TermsModal } from './terms';
import axios from 'axios';

const domain = process.env.NEXT_PUBLIC_APP_URL;
const template_id = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const service_id = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const public_key = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

const LoginForm = () => {

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

    function handleSocialSignIn(provider: "google" | "github") {
        signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
    }

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        toast({
            title: "Please wait",
            description: "Please wait while we process your request!",
        });
        setIsLoading(true)

        try {

            const res = await axios.post("/api/auth/login", values);
            if (res.data.token) {
                const confirmLink = `${domain}/auth/new-verification?token=${res.data.token}`;
                const templateParams = {
                    app_name: APP_NAME,
                    app_email: APP_EMAIL,
                    to_email: values.email,
                    to_name: "",
                    link: confirmLink
                }
                await emailjs.send(service_id, template_id, templateParams, public_key)
                    .then(() => {
                        toast({
                            title: "Verify your Account!",
                            description: "An email verification has been sent to your account!",
                        });
                    })
                    .catch((error: any) => {
                        console.error("Failed to send email:", error);
                        throw new Error("Could not send verification email.");
                    })
                // 2025-02-03T07:07:59.387Z
            } else {
                await signIn("credentials", {
                    email: values.email,
                    password: values.password,
                    redirectTo: DEFAULT_LOGIN_REDIRECT,
                }).then(() => {
                    toast({
                        title: "Success!",
                        description: "Welcome to LookBack!",
                    });
                })
                form.reset();
            }


        } catch (error: any) {
            toast({
                title: "An error occured!",
                variant: "destructive",
                description: error.response.data,
            });
        }

        // if (res.success) {
        //     await signIn("credentials", {
        //         email: values.email,
        //         password: values.password,
        //         redirectTo: DEFAULT_LOGIN_REDIRECT,
        //     }).then(() => {
        //         toast({
        //             title: "Success!",
        //             description: res.success,
        //         });
        //     })
        //     form.reset();
        // } else if (res.error_verify && res.token) {
        //     const confirmLink = `${domain}/auth/new-verification?token=${res.token}`;
        //     const templateParams = {
        //         app_name: APP_NAME,
        //         app_email: APP_EMAIL,
        //         to_email: values.email,
        //         to_name: "",
        //         link: confirmLink
        //     }
        //     await emailjs.send(service_id, template_id, templateParams, public_key)
        //         .then(() => {
        //             toast({
        //                 title: "Verify your Account!",
        //                 description: res.error_verify,
        //             });
        //         })
        //         .catch((error: any) => {
        //             console.error("Failed to send email:", error);
        //             throw new Error("Could not send verification email.");
        //         })
        // }
        // else {
        //     toast({
        //         title: "An error occured!",
        //         variant: "destructive",
        //         description: res.error,
        //     });
        // }
        setIsLoading(false)
    };

    return (
        <div className={cn("flex flex-col gap-6")}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login with your Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    <Button variant="outline" className="w-full" type='button' onClick={() => handleSocialSignIn("google")}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path
                                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        Login with Google
                                    </Button>
                                </div>
                                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                                <div className="grid gap-4">
                                    <FormInput
                                        control={form.control}
                                        name="email"
                                        label="Email Address"
                                        type="email"
                                        required={true}
                                        disabled={isLoading}
                                        placeholder="Email Address"
                                    />
                                    <div className="grid">

                                        <FormInput
                                            control={form.control}
                                            name="password"
                                            label="Password"
                                            type="password"
                                            required={true}
                                            disabled={isLoading}
                                            placeholder="Password"
                                        />
                                        <div className="flex items-center">
                                            <Link
                                                href="/auth/forgot-password"
                                                className="ml-auto text-sm underline-offset-4 hover:underline"
                                            >
                                                Forgot your password?
                                            </Link>
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                                        <span className="">Login</span>
                                        {isLoading && <LoadingIcon />}
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link href={"/auth/sign-up"} className="underline underline-offset-4">
                                        Sign up
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <TermsModal />
        </div>
    )

    // return (
    //     <Card className="w-full max-w-md px-6 py-8">
    //         <FormTemplate
    //             form={form}
    //             FormSchema={LoginSchema}
    //             handleSubmit={handleSubmit}
    //             submit_label="Login"
    //             disabled={isLoading}
    //         >
    //             <h1 className='text-center text-2xl font-bold'>LOG IN</h1>
    // <FormInput
    //     control={form.control}
    //     name="email"
    //     label="Email Address"
    //     type="email"
    //     required={true}
    //     disabled={isLoading}
    //     placeholder="Email Address"
    // />
    // <FormInput
    //     control={form.control}
    //     name="password"
    //     label="Password"
    //     type="password"
    //     required={true}
    //     disabled={isLoading}
    //     placeholder="Password"
    // />
    //         </FormTemplate>
    //         <Link className="pt-4 flex justify-center items-center" href={"/auth/sign-up"}>
    //             <Button type='button' variant={"link"}>
    //                 <p className="text-center">Don&apos; have an account yet?</p>
    //             </Button>
    //         </Link>
    //     </Card>
    // )
}

export default LoginForm