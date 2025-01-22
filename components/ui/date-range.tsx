"use client"

import * as React from "react"
import { format, subDays } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn, FORMAT } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface Extended {
    defaultStartDate?: Date;
    defaultEndDate?: Date;
}
export function UiDatePickerRange({
    className,
    defaultStartDate,
    defaultEndDate,
}: React.HTMLAttributes<HTMLDivElement> & Extended) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: defaultStartDate ? defaultStartDate : subDays(new Date(), 7),
        to: defaultEndDate ? defaultEndDate : new Date(),
    })

    React.useEffect(() => {
        if (date && date.from && date.to) {
            const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
            currentParams.set("startDate", format(date.from, FORMAT));
            currentParams.set("endDate", format(date.to, FORMAT));

            router.push(`${pathname}?${currentParams.toString()}`);
        }
    }, [date]);

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full max-w-xs justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
