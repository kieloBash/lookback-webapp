"use client";

import { FETCH_INTERVAL, FORMAT } from "@/lib/utils";
import { ANALYTICS_ROUTES } from "@/routes/analytics.routes";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { format } from "date-fns";

const ROUTE = ANALYTICS_ROUTES.REVENUE.URL;
const KEY = ANALYTICS_ROUTES.REVENUE.KEY;
const SUB_KEY = ANALYTICS_ROUTES.REVENUE.SUBKEY;

const INTERVAL = FETCH_INTERVAL

const default_limit = 10;
const default_filter = "all";

export type ApiResponse = {
    currentTotalRevenue: number,
    previousTotalRevenue: number,
    totalDifference: number,
    percentageDifference: number,
    status: "positive" | "negative"
    revenueByDay: { date: string; revenue: number }[]
};

export type FetchParams = {
    page?: number;
    limit?: number;
    filter?: string;
    searchTerm?: string;
    startDate: string,
    endDate: string,
};

const fetchData = async ({
    page = 1,
    limit = default_limit,
    filter = default_filter,
    searchTerm = "",
    startDate,
    endDate
}: FetchParams): Promise<ApiResponse> => {
    const response = await fetch(
        `${ROUTE}?page=${page}&limit=${limit}&filter=${filter}&searchTerm=${searchTerm}&startDate=${startDate}&endDate=${endDate}`
    );
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

interface IProps {
    page?: number,
    limit?: number,
    filter?: string,
    searchTerm?: string,
    select?: any
    startDate: Date,
    endDate: Date,
}

const useRevenue = (
    { page = 1, limit = default_limit, filter = default_filter, searchTerm = "", select, startDate, endDate }: IProps
) => {

    const formatStart = format(startDate, FORMAT);
    const formatEnd = format(endDate, FORMAT);

    const { data, error, isLoading, isFetching, isError } = useQuery<ApiResponse>({
        queryKey: [SUB_KEY, KEY, page, limit, filter, searchTerm, formatStart, formatEnd],
        queryFn: () =>
            fetchData({ page, limit, filter, searchTerm, startDate: formatStart, endDate: formatEnd }),
        staleTime: INTERVAL,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
        select
    });

    return {
        ...data,
        error,
        isLoading,
        isFetching,
        isError,
    };
};

export default useRevenue;