'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from '@/components/ui/form';
import { handlePostAxios } from '@/lib/utils';
import { FormInput } from '@/components/forms/form-input';

import { SettingsUserSchema } from '@/schemas/auth.schema';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import UiLoading from '@/components/ui-project/loading-page';
import { Label } from '@/components/ui/label';

import BarangayCodeSelect from '@/components/ui-project/barangay-code-select';
import CityCodeSelect from '@/components/ui-project/city-code-select';
import ProvinceCodeSelect from '@/components/ui-project/prov-code-select';
import RegionCodeSelect from '@/components/ui-project/reg-code-select';
import FormSelect from '@/components/forms/form-select';

import { FullUserType } from '@/types/user.type';
import FormSubmit from '@/components/forms/submit-button';
import CovidStatusCard from './_components/covid-status';

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
        },
    });

    async function onSubmit(values: z.infer<typeof SettingsUserSchema>) {
        console.log(values);
    }

    return (
        <section className="w-full lg:max-w-none max-w-sm p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
                    <CovidStatusCard covidStatus={status} hasRequest={data.requests.length > 0} />
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
                    <FormSubmit
                        className='w-full'
                        disabled={isLoading}
                    >
                        <span>Save Changes</span>
                    </FormSubmit>
                </form>
            </Form>
        </section>
    )
}

export default SettingsUserClient