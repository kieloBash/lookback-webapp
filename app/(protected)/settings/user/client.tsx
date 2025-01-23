'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from '@/components/ui/form';
import { handleAxios, handlePostAxios } from '@/lib/utils';
import { FormInput } from '@/components/forms/form-input';

import { SettingsUserSchema } from '@/schemas/auth.schema';

import FormSelect from '@/components/forms/form-select';

import { FullUserType } from '@/types/user.type';
import FormSubmit from '@/components/forms/submit-button';
import CovidStatusCard from './_components/covid-status';
import AddressForm from './_components/address-form';
import { USERS_ROUTES } from '@/routes/users.routes';
import { toast } from '@/hooks/use-toast';

interface IProps {
    data: FullUserType;
}

const SettingsUserClient = ({ data: { userProfile: profile, ...data } }: IProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const { fname, lname, gender, regCode, provCode, citymunCode, brgyCode, status } = profile;

    const queryClient = useQueryClient()
    const router = useRouter()

    const form = useForm<z.infer<typeof SettingsUserSchema>>({
        resolver: zodResolver(SettingsUserSchema),
        defaultValues: {
            fname, lname, gender, regCode, provCode, citymunCode, brgyCode,
            email: data.email,
            birthDate: new Date(profile.birthDate).toISOString().split('T')[0],
        },
    });

    async function onSubmit(values: z.infer<typeof SettingsUserSchema>) {
        setIsLoading(true);
        await handleAxios({ values: { id: data.id, profileId: profile.id, ...values }, url: USERS_ROUTES.USER.UPDATE.URL })
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
                    <CovidStatusCard covidStatus={status} hasRequest={data.requests.length > 0} />
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
                        name="fname"
                        label="First Name"
                        placeholder='Enter first name'
                        disabled={isLoading}
                    />
                    <FormInput
                        control={form.control}
                        name="lname"
                        label="Last Name"
                        placeholder='Enter last name'
                        disabled={isLoading}
                    />
                    <FormSelect
                        value={form.watch("gender")}
                        label='Gender'
                        name='gender'
                        array={["Male", "Female", "Other"].map((d) => ({ id: d, value: d, label: d }))}
                        control={form.control}
                        disabled={isLoading}
                    />
                    <FormInput
                        label="Date of Birth"
                        type='date'
                        name="birthDate"
                        placeholder="Enter your date of birth"
                        control={form.control}
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

export default SettingsUserClient