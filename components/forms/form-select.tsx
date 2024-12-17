"use client";
import React from "react";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
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
    control: any;
    name: string;
    label?: string;
    disabled?: boolean;
    placeholder?: string;
    description?: string;
    className?: string;
    array: { id: string, label: string }[];
    value?: string
    children?: React.ReactNode
}

const FormSelect = ({
    control,
    name,
    label = "",
    disabled = false,
    placeholder = "Please select one...",
    className = "",
    array,
    value = "",
    children,
    description = "",
}: IProps) => {
    return (
        <FormField
            disabled={disabled}
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label &&
                        <FormLabel>{label}</FormLabel>
                    }
                    <Select disabled={disabled} onValueChange={field.onChange} value={value}>
                        <FormControl>
                            <SelectTrigger className={className}>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectGroup>
                                {children ? children : <>
                                    {array.length > 0 ? <>
                                        {array.map(({ id, label }) => {
                                            return (
                                                <SelectItem className="capitalize" key={id} value={id}>
                                                    {label}
                                                </SelectItem>
                                            );
                                        })}
                                    </> : <>
                                        <SelectLabel>No Options Available</SelectLabel></>}
                                </>}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {description && description !== "" &&
                        <FormDescription>{description}</FormDescription>
                    }
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormSelect;
