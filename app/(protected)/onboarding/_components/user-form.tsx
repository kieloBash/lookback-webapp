'use client'
import { FormInput } from '@/components/forms/form-input'
import FormSelect from '@/components/forms/form-select';
import FormTextArea from '@/components/forms/form-textarea';
import BarangayCodeSelect from '@/components/ui-project/barangay-code-select';
import CityCodeSelect from '@/components/ui-project/city-code-select';
import ProvinceCodeSelect from '@/components/ui-project/prov-code-select';
import RegionCodeSelect from '@/components/ui-project/reg-code-select';
import { Label } from '@/components/ui/label';
import { OnboardingSchema } from '@/schemas/auth.schema';
import React from 'react'
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

interface IProps {
    form: UseFormReturn<z.infer<typeof OnboardingSchema>, any, undefined>;
    isLoading: boolean;
}

const UserForm = ({ form, isLoading }: IProps) => {
    return (
        <div className="grid gap-3 w-full max-w-md">
            <FormInput
                label="First Name"
                name="user.fname"
                placeholder="Enter your first name"
                control={form.control}
                disabled={isLoading}
            />
            <FormInput
                label="Last Name"
                name="user.lname"
                placeholder="Enter your last name"
                control={form.control}
                disabled={isLoading}
            />
            <FormSelect
                value={form.watch("user.gender")}
                label='Gender'
                name='user.gender'
                array={["Male", "Female", "Other"].map((d) => ({ id: d, value: d, label: d }))}
                control={form.control}
                disabled={isLoading}
            />
            <FormInput
                type='date'
                label="Date of Birth"
                name="user.birthDate"
                placeholder="Enter your date of Birth"
                control={form.control}
                disabled={isLoading}
            />
            <div className="grid gap-3">
                <Label>Region</Label>
                <RegionCodeSelect
                    form={form}
                    formName='user.regCode'
                />
            </div>
            <div className="grid gap-3">
                <Label>Province</Label>
                <ProvinceCodeSelect
                    form={form}
                    formName='user.provCode'
                    regCode={form.watch("user.regCode") ?? ""}
                />
            </div>
            <div className="grid gap-3">
                <Label>City/Municipality</Label>
                <CityCodeSelect
                    form={form}
                    formName='user.citymunCode'
                    provCode={form.watch("user.provCode") ?? ""}
                />
            </div>
            <div className="grid gap-3">
                <Label>Barangay</Label>
                <BarangayCodeSelect
                    form={form}
                    formName='user.brgyCode'
                    citymunCode={form.watch("user.citymunCode") ?? ""}
                />
            </div>
        </div>
    )
}

export default UserForm