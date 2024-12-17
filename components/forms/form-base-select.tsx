import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Label } from '../ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface IProps {
    description?: string
    label?: string
    placeholder?: string
    disabled?: boolean
    className?: string

    value: any;
    onChange: (val: any) => void
    array: { id: string; label: string }[]
}

const FormBaseSelect = ({ array, value, onChange, label, placeholder = "Please select one...", description, disabled = false, className }: IProps) => {
    const CLASS_NAME = clsx(className);

    return (
        <div className="grid gap-3 w-full">
            {label && (
                <Label>{label}</Label>
            )}
            <div className="flex flex-col gap-2 justify-center items-center w-full relative">
                <Select disabled={disabled} onValueChange={(e) => onChange(e)} value={value}>
                    <SelectTrigger className={CLASS_NAME}>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {array.length > 0 ?
                                <>
                                    {array.map(({ id, label }) => {
                                        return (
                                            <SelectItem className="capitalize" key={id} value={id}>
                                                {label}
                                            </SelectItem>
                                        );
                                    })}
                                </>
                                :
                                <SelectLabel>No Options Available</SelectLabel>
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {description && (
                    <p className="w-full text-xs text-muted-foreground">{description}</p>
                )}
            </div>
        </div>
    )
}

export default FormBaseSelect