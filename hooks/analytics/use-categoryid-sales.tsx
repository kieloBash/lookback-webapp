"use client";

import { FETCH_INTERVAL, FORMAT } from "@/lib/utils";
import { ANALYTICS_ROUTES } from "@/routes/analytics.routes";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { format } from "date-fns";

const ROUTE = ANALYTICS_ROUTES.CATEGORY_ID_SALES.URL;
const KEY = ANALYTICS_ROUTES.CATEGORY_ID_SALES.KEY;
const SUB_KEY = ANALYTICS_ROUTES.CATEGORY_ID_SALES.SUBKEY;

const INTERVAL = FETCH_INTERVAL

const default_limit = 10;
const default_filter = "all";

export type ApiResponse = {
    salesByDay: { date: string; sales: number; prevSales: number }[]
};

export type FetchParams = {
    page?: number;
    limit?: number;
    filter?: string;
    searchTerm?: string;
    startDate: string;
    endDate: string;
    id: string;
};

const fetchData = async ({
    page = 1,
    limit = default_limit,
    filter = default_filter,
    searchTerm = "",
    startDate,
    endDate,
    id
}: FetchParams): Promise<ApiResponse> => {
    const response = await fetch(
        `${ROUTE}?page=${page}&limit=${limit}&filter=${filter}&searchTerm=${searchTerm}&startDate=${startDate}&endDate=${endDate}&id=${id}`
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
    id: string
}

const useCategoryIdSales = (
    { page = 1, limit = default_limit, filter = default_filter, searchTerm = "", select, startDate, endDate, id }: IProps
) => {

    const formatStart = format(startDate, FORMAT);
    const formatEnd = format(endDate, FORMAT);

    const { data, error, isLoading, isFetching, isError } = useQuery<ApiResponse>({
        queryKey: [SUB_KEY, KEY, page, limit, filter, searchTerm, formatStart, formatEnd, id],
        queryFn: () =>
            fetchData({ page, limit, filter, searchTerm, startDate: formatStart, endDate: formatEnd, id }),
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

export default useCategoryIdSales;