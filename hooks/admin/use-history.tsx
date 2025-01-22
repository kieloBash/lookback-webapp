"use client";

import { FETCH_INTERVAL, FORMAT } from "@/lib/utils";
import { HISTORY_ROUTES } from "@/routes/history.routes";
import { FullHistoryType } from "@/types/user.type";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { endOfMonth, format, startOfMonth } from "date-fns";

const ROUTE = HISTORY_ROUTES.ADMIN.FETCH_ALL.URL;
const KEY = HISTORY_ROUTES.ADMIN.FETCH_ALL.KEY;
const INTERVAL = FETCH_INTERVAL

const default_limit = 10;
const default_filter = "all";

export type ApiResponse = {
    payload: FullHistoryType[];
    totalPages: number;
    totalData: number;
    currentPage: number;
};

export type FetchParams = {
    page?: number;
    limit?: number;
    filter?: string;
    searchTerm?: string;

    startDate?: Date;
    endDate?: Date;
};

const fetchData = async ({
    page = 1,
    limit = default_limit,
    filter = default_filter,
    searchTerm = "",

    startDate = startOfMonth(new Date()),
    endDate = endOfMonth(new Date()),

}: FetchParams): Promise<ApiResponse> => {
    const response = await fetch(
        `${ROUTE}?page=${page}&limit=${limit}&filter=${filter}&searchTerm=${searchTerm}&startDate=${format(startDate, FORMAT)}&endDate=${format(endDate, FORMAT)}`
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

    startDate?: Date;
    endDate?: Date;
}

const useAdminHistory = (
    { page = 1, limit = default_limit, filter = default_filter, searchTerm = "", select, startDate = startOfMonth(new Date()), endDate = endOfMonth(new Date()) }: IProps
) => {

    const { data, error, isLoading, isFetching, isError } = useQuery<ApiResponse>({
        queryKey: [KEY, page, limit, filter, searchTerm, format(startDate, FORMAT), format(endDate, FORMAT)],
        queryFn: () =>
            fetchData({ page, limit, filter, searchTerm, startDate, endDate }),
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

export default useAdminHistory;