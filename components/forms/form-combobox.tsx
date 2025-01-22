"use client"

import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { UseFormReturn } from 'react-hook-form';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface IProps {
    form: UseFormReturn<any, any, undefined>;
    name: string;
    label?: string;
    description?: string;
    disabled?: boolean;
    className?: string;
    items?: { value: string, label: string }[];
    onChange: (value: string) => void;

    messages?: {
        empty?: string,
        placeholder?: string
        search?: string
    }
}

const DEFAULT_MESSAGES = {
    empty: "No items found",
    placeholder: "Select item",
    search: "Search item..."
}

export default function FormComboBox({
    form,
    name,
    label,
    description,
    disabled = false,
    className = "",
    messages,
    items = [],
    onChange
}: IProps) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    {label && <FormLabel>{label}</FormLabel>}
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    disabled={disabled}
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        className,
                                        "w-full justify-between",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value
                                        ? items.find(
                                            (item) => item.value === field.value
                                        )?.label
                                        : messages?.placeholder ?? DEFAULT_MESSAGES.placeholder}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput placeholder={messages?.search ?? DEFAULT_MESSAGES.search} />
                                <CommandList>
                                    <CommandEmpty>{messages?.empty ?? DEFAULT_MESSAGES.empty}</CommandEmpty>
                                    <CommandGroup>
                                        {items.map((item) => (
                                            <CommandItem
                                                value={item.label}
                                                key={item.value}
                                                onSelect={() => {
                                                    form.setValue(name, item.value);
                                                    onChange(item.value);
                                                }}
                                            >
                                                {item.label}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        item.value === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {description && (
                        <FormDescription>
                            {description}
                        </FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
