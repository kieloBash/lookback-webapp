'use client'
import FormComboBox from '@/components/forms/form-combobox';

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

const AddressForm = ({ form, isLoading }: IProps) => {
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

        const val = form.watch("regCode");

        return provinces.payload?.filter((d) => d.regCode === val).map((d) => ({ value: d.provCode, label: d.provDesc }))
    },
        [provinces.isLoading, provinces.payload, form.watch("regCode")]);

    const formattedCities = useMemo(() => {
        if (cities.isLoading || !cities?.payload) return [];

        const val = form.watch("provCode");

        return cities.payload?.filter((d) => d.provCode === val).map((d) => ({ value: d.citymunCode, label: d.citymunDesc }))
    },
        [cities.isLoading,
        cities.payload,
        form.watch("regCode"),
        form.watch("provCode"),
        ]);

    const formattedBarangays = useMemo(() => {
        if (barangays.isLoading || !barangays?.payload) return [];

        const val = form.watch("citymunCode");

        return barangays.payload?.filter((d) => d.citymunCode === val).map((d) => ({ value: d.brgyCode, label: d.brgyDesc }))
    },
        [barangays.isLoading,
        barangays.payload,
        form.watch("regCode"),
        form.watch("provCode"),
        form.watch("citymunCode"),
        ]);

    //reset from regcode
    const handleResetProvince = () => {
        form.setValue("provCode", "");
        form.setValue("citymunCode", "");
        form.setValue("brgyCode", "");
    }

    const handleResetCity = () => {
        form.setValue("citymunCode", "");
        form.setValue("brgyCode", "");
    }

    const handleResetBarangay = () => {
        form.setValue("brgyCode", "");
    }


    return (
        <div className="grid gap-3 w-full max-w-md">
            <FormComboBox
                label="Region"
                name="regCode"
                form={form}
                disabled={isLoading}
                items={formattedRegions}
                onChange={() => {
                    handleResetProvince();
                }}
            />
            <FormComboBox
                label="Province"
                name="provCode"
                form={form}
                disabled={isLoading}
                items={formattedProvinces}
                onChange={() => {
                    handleResetCity();
                }}
            />
            <FormComboBox
                label="City/Municipality"
                name="citymunCode"
                form={form}
                disabled={isLoading}
                items={formattedCities}
                onChange={() => {
                    handleResetBarangay();
                }}
            />
            <FormComboBox
                label="Barangay"
                name="brgyCode"
                form={form}
                disabled={isLoading}
                items={formattedBarangays}
                onChange={() => {
                }}
            />
        </div>
    )
}

export default AddressForm;