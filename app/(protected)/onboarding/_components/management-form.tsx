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

const ManagementForm = ({ form, isLoading }: IProps) => {
    return (
        <div className="grid gap-3 w-full max-w-md">
            <FormInput
                label="First Name"
                name="management.name"
                placeholder="Enter your management's name"
                control={form.control}
                disabled={isLoading}
            />
            <div className="grid gap-3">
                <Label>Region</Label>
                <RegionCodeSelect
                    form={form}
                    formName='management.regCode'
                />
            </div>
            <div className="grid gap-3">
                <Label>Province</Label>
                <ProvinceCodeSelect
                    form={form}
                    formName='management.provCode'
                    regCode={form.watch("management.regCode") ?? ""}
                />
            </div>
            <div className="grid gap-3">
                <Label>City/Municipality</Label>
                <CityCodeSelect
                    form={form}
                    formName='management.citymunCode'
                    provCode={form.watch("management.provCode") ?? ""}
                />
            </div>
            <div className="grid gap-3">
                <Label>Barangay</Label>
                <BarangayCodeSelect
                    form={form}
                    formName='management.brgyCode'
                    citymunCode={form.watch("management.citymunCode") ?? ""}
                />
            </div>
        </div>
    )
}

export default ManagementForm