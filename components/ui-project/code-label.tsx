'use client'
import useDataBarangays from '@/hooks/data/use-barangays'
import useDataCities from '@/hooks/data/use-cities'
import useDataProvinces from '@/hooks/data/use-provinces'
import useDataRegions from '@/hooks/data/use-regions'
import { cn } from '@/lib/utils'
import React from 'react'

interface IProps {
    value: string,
    type: "region" | "province" | "city" | "barangay"
}

const className = cn("px-2 py-1 text-sm rounded-full")

const RegionLabel = (value: string) => {
    const d = useDataRegions({});
    const item = d?.payload?.find(item => item.regCode === value);

    if (item) return (
        <div className={className}>{item.regDesc}</div>
    )
}

const ProvinceLabel = (value: string) => {
    const d = useDataProvinces({});
    const item = d?.payload?.find(item => item.provCode === value);

    if (item) return (
        <div className={className}>{item.provDesc}</div>
    )
}

const CityLabel = (value: string) => {
    const d = useDataCities({});
    const item = d?.payload?.find(item => item.citymunCode === value);

    if (item) return (
        <div className={className}>{item.citymunDesc}</div>
    )
}

const BarangayLabel = (value: string) => {
    const d = useDataBarangays({});
    const item = d?.payload?.find(item => item.brgyCode === value);

    if (item) return (
        <div className={className}>{item.brgyDesc}</div>
    )
}

const UiCodeLabel = ({ value, type }: IProps) => {

    if (type === "region") return RegionLabel(value);
    else if (type === "province") return ProvinceLabel(value);
    else if (type === "city") return CityLabel(value);
    else if (type === "barangay") return BarangayLabel(value);

    return (
        <div>UiCodeLabel</div>
    )
}

export default UiCodeLabel