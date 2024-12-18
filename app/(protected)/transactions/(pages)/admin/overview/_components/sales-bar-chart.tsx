"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useSearchParams } from "next/navigation"
import { endOfMonth, format, startOfMonth } from "date-fns"
import useRevenue from "@/hooks/analytics/use-revenue"
import LoadingTemplate from "@/components/ui/loading-page"

const chartConfig = {
    revenue: {
        label: "Sales Revenue",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig

export function SalesBarChart() {
    const searchParams = useSearchParams();
    const startDate = searchParams.get("startDate") ? new Date((searchParams.get("startDate") as any)) : startOfMonth(new Date());
    const endDate = searchParams.get("endDate") ? new Date((searchParams.get("endDate") as any)) : endOfMonth(new Date());

    const revenue = useRevenue({ startDate, endDate });
    const chartDatas = React.useMemo(() => {
        if (revenue.revenueByDay) {
            return revenue.revenueByDay;
        } else {
            return []
        }
    }, [revenue])

    const total = React.useMemo(
        () => {
            return revenue?.currentTotalRevenue ?? 0
        },
        [revenue]
    )

    if (revenue.isLoading) return <LoadingTemplate />


    return (
        <Card className="col-span-3">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Daily Revenue</CardTitle>
                    <CardDescription>
                        Showing total of {format(startDate, "MMMM dd")} to {format(endDate, "MMMM dd")}
                    </CardDescription>
                </div>
                <div className="flex">
                    <div
                        key={"revenue"}
                        data-active={true}
                        className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                    >
                        <span className="text-xs text-muted-foreground">
                            {chartConfig["revenue"].label}
                        </span>
                        <span className="text-lg font-bold leading-none sm:text-3xl">
                            {total.toLocaleString()}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={chartDatas}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="revenue"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                />
                            }
                        />
                        <Bar dataKey={"revenue"} fill={`var(--color-revenue)`} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
