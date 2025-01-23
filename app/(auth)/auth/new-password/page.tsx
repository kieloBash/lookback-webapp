"use client"
import { GalleryVerticalEnd } from "lucide-react"

import { APP_NAME, handleAxios } from "@/lib/utils"
import Link from "next/link"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { NewPasswordSchema } from "@/schemas/auth.schema"

import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { useState } from "react";
import { USERS_ROUTES } from "@/routes/users.routes"
import { IPageProps } from "@/types/global"
import { useRouter } from "next/navigation"
import FormSubmit from "@/components/forms/submit-button"

const QUERY_KEY = "";
const URL = "/api/auth/new-password";

export default function NewPasswordPage(props: IPageProps) {
    const { token } = props.searchParams as any;

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof NewPasswordSchema>) {
        setIsLoading(true);
        await handleAxios({ values: { ...values, token }, url: URL })
            .then(() => {
                form.reset();
                router.push("/auth/sign-in");
            })
            .catch(() => {
                console.log("Error");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <div className={"flex flex-col gap-6 w-full min-h-screen p-4 justify-center items-center"}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-6 w-full max-w-sm">
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
                                label="New Password"
                                name="password"
                                type="password"
                                placeholder="Enter new password"
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