"use client"
import { GalleryVerticalEnd } from "lucide-react"

import { APP_EMAIL, APP_NAME, cn, handleAxios } from "@/lib/utils"
import Link from "next/link"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ForgotPasswordSchema } from "@/schemas/auth.schema"

import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { useState } from "react";
import { USERS_ROUTES } from "@/routes/users.routes"
import FormSubmit from "@/components/forms/submit-button";
import emailjs from "emailjs-com";
import { toast } from "@/hooks/use-toast";


const QUERY_KEY = "";
const URL = "/api/auth/forgot-password";

const domain = process.env.NEXT_PUBLIC_APP_URL;
const template_id = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_RESET ?? "";
const service_id = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const public_key = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

export function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof ForgotPasswordSchema>) {
        setIsLoading(true);
        const res = await handleAxios({ values, url: URL });
        setIsLoading(false);
        if (res.token) {
            const confirmLink = `${domain}/auth/new-password?token=${res.token}`;
            const templateParams = {
                app_name: APP_NAME,
                app_email: APP_EMAIL,
                to_email: values.email,
                to_name: res.name,
                link: confirmLink
            }
            await emailjs.send(service_id, template_id, templateParams, public_key)
                .then(() => {
                    toast({
                        title: "Success!",
                        description: "We have sent you an email to reset your password!",
                    });
                    form.reset();
                })
                .catch((error) => {
                    console.error("Failed to send email:", error);
                    throw new Error("Could not send reset password email.");
                })
        } else {
            toast({
                title: "An error occured!",
                variant: "destructive",
                description: "an error occured!",
            });
        }
    }

    return (
        <div className="flex flex-col gap-6 w-full h-full p-4 justify-center items-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-6 w-full">
                        <div className="flex flex-col items-center gap-2">
                            <Link
                                href="/"
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-md">
                                    <GalleryVerticalEnd className="size-6" />
                                </div>
                                <span className="sr-only">{APP_NAME}</span>
                            </Link>
                            <h1 className="text-xl font-bold">Forgot your password?</h1>

                        </div>
                        <div className="flex flex-col gap-6">
                            <FormInput
                                label="Email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                control={form.control}
                                disabled={isLoading}
                            />
                            <FormSubmit disabled={isLoading}>
                                <span>Submit</span>
                            </FormSubmit>
                        </div>
                    </div>
                </form>
            </Form>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
                We will send you an email with instructions on how to reset your password.
            </div>
        </div>
    )
}