"use client";

import { FETCH_INTERVAL } from "@/lib/utils";
import { Barangay } from "@/types/lib.type";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

const ROUTE = "/api/lookback/barangays";
const KEY = "BARANGAYS";
const INTERVAL = FETCH_INTERVAL

const default_limit = 10;
const default_filter = "all";

export type ApiResponse = {
    payload: Barangay[];
};

export type FetchParams = {
    page?: number;
    limit?: number;
    filter?: string;
    searchTerm?: string;

    citymunCode?: string;
};

const fetchData = async ({
    page = 1,
    limit = default_limit,
    filter = default_filter,
    searchTerm = "",
    citymunCode
}: FetchParams): Promise<ApiResponse> => {

    // if (!citymunCode) return { payload: [] };

    const url = citymunCode ? `${ROUTE}/${citymunCode}?page=${page}&limit=${limit}&filter=${filter}&searchTerm=${searchTerm}` : `${ROUTE}?page=${page}&limit=${limit}&filter=${filter}&searchTerm=${searchTerm}`

    const response = await fetch(url);
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
    select?: any,

    citymunCode?: string,
}

const useDataBarangays = (
    { page = 1, limit = default_limit, filter = default_filter, searchTerm = "", select, citymunCode = "" }: IProps
) => {

    const { data, error, isLoading, isFetching, isError } = useQuery<ApiResponse>({
        queryKey: [KEY, page, limit, filter, searchTerm, citymunCode],
        queryFn: () =>
            fetchData({ page, limit, filter, searchTerm, citymunCode }),
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

export default useDataBarangays;