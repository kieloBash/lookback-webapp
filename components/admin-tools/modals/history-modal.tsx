'use client'
import React from 'react'
import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput } from '@/components/forms/form-input';
import FormSubmit from '@/components/forms/submit-button';
import { handleCreateHistory } from '../actions';

interface IProps {
    open: boolean;
    setOpen: (e: boolean) => void;
}

const Schema = z.object({
    date: z.string(),
    user: z.string(),
    management: z.string(),
});

export default function HistoryModal({ open, setOpen }: IProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof Schema>>({
        resolver: zodResolver(Schema),
        defaultValues: {
            user: "user_test@gmail.com",
            management: "management_test@gmail.com",
            date: new Date().toISOString().split('T')[0],
        },
    });

    async function onSubmit(values: z.infer<typeof Schema>) {
        setIsLoading(true);
        const { user, management, date } = values;
        await handleCreateHistory({ user, management, date: new Date(date) })
        setIsLoading(false);
        setOpen(false);
    }

    if (open)
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Admin Util</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form className='w-full space-y-2' onSubmit={form.handleSubmit(onSubmit)}>
                            <FormInput
                                label="User Email"
                                type='email'
                                name="user"
                                placeholder="Enter user"
                                control={form.control}
                                disabled={isLoading}
                            />
                            <FormInput
                                label="Management Email"
                                type='email'
                                name="management"
                                placeholder="Enter management"
                                control={form.control}
                                disabled={isLoading}
                            />
                            <FormInput
                                label="Date"
                                type="date"
                                name="date"
                                placeholder="Enter date"
                                control={form.control}
                                disabled={isLoading}
                            />
                            <FormSubmit disabled={isLoading}>
                                <span className="">Submit</span>
                            </FormSubmit>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        )
}
