"use client";

import { FETCH_INTERVAL } from "@/lib/utils";
import { Province, Region } from "@/types/lib.type";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

const ROUTE = "/api/lookback/provinces";
const KEY = "PROVINCES";
const INTERVAL = FETCH_INTERVAL

const default_limit = 10;
const default_filter = "all";

export type ApiResponse = {
    payload: Province[];
};

export type FetchParams = {
    page?: number;
    limit?: number;
    filter?: string;
    searchTerm?: string;

    regCode?: string;
};

const fetchData = async ({
    page = 1,
    limit = default_limit,
    filter = default_filter,
    searchTerm = "",
    regCode,
}: FetchParams): Promise<ApiResponse> => {

    const url = regCode ? `${ROUTE}/${regCode}?page=${page}&limit=${limit}&filter=${filter}&searchTerm=${searchTerm}` : `${ROUTE}?page=${page}&limit=${limit}&filter=${filter}&searchTerm=${searchTerm}`

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

    regCode?: string,
}

const useDataProvinces = (
    { page = 1, limit = default_limit, filter = default_filter, searchTerm = "", select, regCode = "" }: IProps
) => {

    const { data, error, isLoading, isFetching, isError } = useQuery<ApiResponse>({
        queryKey: [KEY, page, limit, filter, searchTerm, regCode],
        queryFn: () =>
            fetchData({ page, limit, filter, searchTerm, regCode }),
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

export default useDataProvinces;