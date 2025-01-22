'use client'
import FormComboBox from '@/components/forms/form-combobox';
import { FormInput } from '@/components/forms/form-input'

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

const ManagementForm = ({ form, isLoading }: IProps) => {
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

        const val = form.watch("management.regCode");

        return provinces.payload?.filter((d) => d.regCode === val).map((d) => ({ value: d.provCode, label: d.provDesc }))
    },
        [provinces.isLoading, provinces.payload, form.watch("management.regCode")]);

    const formattedCities = useMemo(() => {
        if (cities.isLoading || !cities?.payload) return [];

        const val = form.watch("management.provCode");

        return cities.payload?.filter((d) => d.provCode === val).map((d) => ({ value: d.citymunCode, label: d.citymunDesc }))
    },
        [cities.isLoading,
        cities.payload,
        form.watch("management.regCode"),
        form.watch("management.provCode"),
        ]);

    const formattedBarangays = useMemo(() => {
        if (barangays.isLoading || !barangays?.payload) return [];

        const val = form.watch("management.citymunCode");

        return barangays.payload?.filter((d) => d.citymunCode === val).map((d) => ({ value: d.brgyCode, label: d.brgyDesc }))
    },
        [barangays.isLoading,
        barangays.payload,
        form.watch("management.regCode"),
        form.watch("management.provCode"),
        form.watch("management.citymunCode"),
        ]);

    //reset from regcode
    const handleResetProvince = () => {
        form.setValue("management.provCode", "");
        form.setValue("management.citymunCode", "");
        form.setValue("management.brgyCode", "");
    }

    const handleResetCity = () => {
        form.setValue("management.citymunCode", "");
        form.setValue("management.brgyCode", "");
    }

    const handleResetBarangay = () => {
        form.setValue("management.brgyCode", "");
    }


    return (
        <div className="grid gap-3 w-full max-w-md">
            <FormInput
                label="Name"
                name="management.name"
                placeholder="Enter your management's name"
                control={form.control}
                disabled={isLoading}
            />
            <FormComboBox
                label="Region"
                name="management.regCode"
                form={form}
                disabled={isLoading}
                items={formattedRegions}
                onChange={() => {
                    handleResetProvince();
                }}
            />
            <FormComboBox
                label="Province"
                name="management.provCode"
                form={form}
                disabled={isLoading}
                items={formattedProvinces}
                onChange={() => {
                    handleResetCity();
                }}
            />
            <FormComboBox
                label="City/Municipality"
                name="management.citymunCode"
                form={form}
                disabled={isLoading}
                items={formattedCities}
                onChange={() => {
                    handleResetBarangay();
                }}
            />
            <FormComboBox
                label="Barangay"
                name="management.brgyCode"
                form={form}
                disabled={isLoading}
                items={formattedBarangays}
                onChange={() => {
                }}
            />
        </div>
    )
}

export default ManagementForm