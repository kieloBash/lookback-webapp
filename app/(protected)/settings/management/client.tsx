'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from '@/components/ui/form';
import { handleAxios } from '@/lib/utils';
import { FormInput } from '@/components/forms/form-input';

import { SettingsManagementSchema } from '@/schemas/auth.schema';

import { FullManagementUserType, FullUserType } from '@/types/user.type';
import FormSubmit from '@/components/forms/submit-button';
import { USERS_ROUTES } from '@/routes/users.routes';
import { toast } from '@/hooks/use-toast';
import AddressForm from '../user/_components/address-form';

interface IProps {
    data: FullManagementUserType;
}

const SettingsManagementClient = ({ data: { managementProfile: profile, ...data } }: IProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const { regCode, provCode, citymunCode, brgyCode } = profile;

    const queryClient = useQueryClient()
    const router = useRouter();
    const Schema = SettingsManagementSchema;

    const form = useForm<z.infer<typeof Schema>>({
        resolver: zodResolver(Schema),
        defaultValues: {
            name: data.name, regCode, provCode, citymunCode, brgyCode,
            email: data.email,
        },
    });

    async function onSubmit(values: z.infer<typeof Schema>) {
        setIsLoading(true);
        await handleAxios({ values: { id: data.id, profileId: profile.id, ...values }, url: USERS_ROUTES.MANAGEMENT.UPDATE.URL })
            .then(() => {
                window.location.reload();
            })
            .catch((e) => {
                toast({ description: e.response.data, variant: 'destructive' })
            })
        setIsLoading(false);
    }

    return (
        <section className="w-full lg:max-w-none max-w-sm p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
                    <FormInput
                        control={form.control}
                        name="email"
                        type='email'
                        label="Email Address"
                        placeholder='Enter email'
                        disabled={true}
                    />
                    <FormInput
                        control={form.control}
                        name="name"
                        label="Name"
                        placeholder='Enter name'
                        disabled={isLoading}
                    />
                    <AddressForm form={form} isLoading={isLoading} />
                    <FormSubmit
                        className='w-full'
                        disabled={isLoading}
                        // isDirty={!form.formState.isDirty}
                    >
                        <span>Save Changes</span>
                    </FormSubmit>
                </form>
            </Form>
        </section>
    )
}

export default SettingsManagementClient