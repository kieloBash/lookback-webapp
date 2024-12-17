import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import clsx from 'clsx'
import { Label } from '../ui/label'

interface IProps {
    description?: string
    label?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    visible?: boolean
    className?: string
    type?: "text" | "file" | "number" | "email" | "password" | "date" | "time";

    value: any;
    onChange: (val: any) => void
}

const FormBaseInput = ({ value, onChange, label, placeholder = "Enter...", description, disabled = false, visible = false, required = false, className, type = "text" }: IProps) => {
    const [hidden, setHidden] = useState(!visible);
    const CLASS_NAME = clsx(className, type === "password" ? "pr-8" : "");

    useEffect(() => {
        setHidden(visible);
    }, [visible]);

    return (
        <div className="grid gap-3 w-full">
            {label && (
                <Label>{label}</Label>
            )}
            <div className="flex flex-col gap-2 justify-center items-center w-full relative">
                <Input
                    required={required}
                    disabled={disabled}
                    className={CLASS_NAME}
                    placeholder={placeholder}
                    type={
                        type === "password" ? (hidden ? "password" : "text") : type
                    }
                    value={type === "number" ? value ?? "" : value}
                    onChange={(e) => {
                        onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)
                    }}
                />
                {description && (
                    <p className="w-full text-xs text-muted-foreground">{description}</p>
                )}
            </div>
        </div>
    )
}

export default FormBaseInput