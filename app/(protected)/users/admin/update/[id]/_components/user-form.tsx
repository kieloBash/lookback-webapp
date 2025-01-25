'use client'
import FormComboBox from '@/components/forms/form-combobox';
import { FormInput } from '@/components/forms/form-input'
import FormSelect from '@/components/forms/form-select';

import useDataBarangays from '@/hooks/data/use-barangays';
import useDataCities from '@/hooks/data/use-cities';
import useDataProvinces from '@/hooks/data/use-provinces';
import useDataRegions from '@/hooks/data/use-regions';
import React, { useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form';

interface IProps {
    form: UseFormReturn<any, any, undefined>;
    isLoading: boolean;
}

const UserForm = ({ form, isLoading }: IProps) => {
    const regions = useDataRegions({});
    const provinces = useDataProvinces({});
    const cities = useDataCities({});
    const barangays = useDataBarangays({});

    const formattedRegions = useMemo(() => {
        if (regions.isLoading || !regions?.payload) return [];

        return regions.payload.map((d) => ({ value: d.regCode, label: d.regDesc }))
    },
        [regions.isLoading, regions.payload]);

    const formattedProvinces = useMemo(() => {
        if (provinces.isLoading || !provinces?.payload) return [];

        const val = form.watch("user.regCode");

        return provinces.payload?.filter((d) => d.regCode === val).map((d) => ({ value: d.provCode, label: d.provDesc }))
    },
        [provinces.isLoading, provinces.payload, form.watch("user.regCode")]);

    const formattedCities = useMemo(() => {
        if (cities.isLoading || !cities?.payload) return [];

        const val = form.watch("user.provCode");

        return cities.payload?.filter((d) => d.provCode === val).map((d) => ({ value: d.citymunCode, label: d.citymunDesc }))
    },
        [cities.isLoading,
        cities.payload,
        form.watch("user.regCode"),
        form.watch("user.provCode"),
        ]);

    const formattedBarangays = useMemo(() => {
        if (barangays.isLoading || !barangays?.payload) return [];

        const val = form.watch("user.citymunCode");

        return barangays.payload?.filter((d) => d.citymunCode === val).map((d) => ({ value: d.brgyCode, label: d.brgyDesc }))
    },
        [barangays.isLoading,
        barangays.payload,
        form.watch("user.regCode"),
        form.watch("user.provCode"),
        form.watch("user.citymunCode"),
        ]);

    //reset from regcode
    const handleResetProvince = () => {
        form.setValue("user.provCode", "");
        form.setValue("user.citymunCode", "");
        form.setValue("user.brgyCode", "");
    }

    const handleResetCity = () => {
        form.setValue("user.citymunCode", "");
        form.setValue("user.brgyCode", "");
    }

    const handleResetBarangay = () => {
        form.setValue("user.brgyCode", "");
    }


    return (
        <div className="grid gap-3 w-full max-w-md">
            <div className="grid grid-cols-2 gap-4">
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
                <FormInput
                    label="Date of Birth"
                    type='date'
                    name="user.birthDate"
                    placeholder="Enter your date of birth"
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
                <FormSelect
                    value={form.watch("user.status")}
                    label='COVID Status'
                    name='user.status'
                    array={["NEGATIVE", "POSITIVE","EXPOSED"].map((d) => ({ id: d, value: d, label: d }))}
                    control={form.control}
                    disabled={isLoading}
                />
            </div>
            <FormComboBox
                label="Region"
                name="user.regCode"
                form={form}
                disabled={isLoading}
                items={formattedRegions}
                onChange={() => {
                    handleResetProvince();
                }}
            />
            <FormComboBox
                label="Province"
                name="user.provCode"
                form={form}
                disabled={isLoading}
                items={formattedProvinces}
                onChange={() => {
                    handleResetCity();
                }}
            />
            <FormComboBox
                label="City/Municipality"
                name="user.citymunCode"
                form={form}
                disabled={isLoading}
                items={formattedCities}
                onChange={() => {
                    handleResetBarangay();
                }}
            />
            <FormComboBox
                label="Barangay"
                name="user.brgyCode"
                form={form}
                disabled={isLoading}
                items={formattedBarangays}
                onChange={() => {
                }}
            />
        </div>
    )
}

export default UserForm