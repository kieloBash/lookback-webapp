"use client"

import * as React from "react"
import { Check, ChevronsUpDown, XIcon } from "lucide-react"

import { cn, sortByProperty } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { UseFormReturn } from "react-hook-form"
import useDataCities from "@/hooks/data/use-cities"
import { CommandLoading } from "cmdk"

interface IProps {
    form: UseFormReturn<any, any, undefined>;
    formName: string;
    provCode: string;
    defaultValue?: string
}

type DataType = { id: string, value: string, label: string };

export default function CityCodeSelect({ form, formName, provCode, defaultValue = "" }: IProps) {
    const cities = useDataCities({ provCode });

    const data = React.useMemo(() => {
        if (cities.isLoading || cities.isFetching || !cities?.payload || provCode === "") {
            return [];
        }
        return sortByProperty(cities.payload, "citymunDesc", "asc").map((d) => ({ id: d.citymunCode, label: d.citymunDesc, value: d.citymunCode }));
    }, [cities, provCode, cities.isLoading, cities.isFetching])

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(defaultValue);
    const [searchTerm, setSearchTerm] = React.useState("");

    const filteredData = React.useMemo(() => {
        const normalizedSearchTerm = searchTerm.trim().toLowerCase();
        return data.filter((d) =>
            d.label.toLowerCase().includes(normalizedSearchTerm)
        );
    }, [data, searchTerm]);

    const handleOnSelect = (currentValue: string) => {
        setValue(currentValue === value ? "" : currentValue)
        setOpen(false)

        let selected: DataType | undefined;
        if (currentValue) {
            selected = data.find((d) => d.value === currentValue);
        }

        form.setValue(formName, selected?.value ?? "");
    }

    React.useEffect(() => {
        form.setValue(formName, defaultValue);
        setValue(defaultValue);
    }, [provCode, defaultValue])

    return (
        <div className="w-full flex justify-between items-center gap-1">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between h-10 max-w-md"
                    >
                        {value
                            ? data.find((d) => d.value === value)?.label
                            : "Select city/municipality code..."}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command value={value} defaultValue={defaultValue} className="w-full" shouldFilter={false}>
                        <CommandInput
                            placeholder="Search city/municipality..."
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                        />
                        <CommandList>
                            {!cities.isLoading && !cities.isFetching &&
                                <CommandEmpty>No cities/municipalities found.</CommandEmpty>
                            }
                            <CommandGroup>
                                {filteredData
                                    .map((d) => (
                                        <CommandItem
                                            key={d.value}
                                            value={d.value}
                                            onSelect={(currentValue) => handleOnSelect(currentValue)}
                                        >
                                            {d.label}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    value === d.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
