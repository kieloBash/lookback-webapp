"use client";

import { FETCH_INTERVAL } from "@/lib/utils";
import { Region } from "@/types/lib.type";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

const ROUTE = "/api/lookback/regions";
const KEY = "REGIONS";
const INTERVAL = FETCH_INTERVAL

const default_limit = 10;
const default_filter = "all";

export type ApiResponse = {
    payload: Region[];
};

export type FetchParams = {
    page?: number;
    limit?: number;
    filter?: string;
    searchTerm?: string;
};

const fetchData = async ({
    page = 1,
    limit = default_limit,
    filter = default_filter,
    searchTerm = "",
}: FetchParams): Promise<ApiResponse> => {
    const response = await fetch(
        `${ROUTE}?page=${page}&limit=${limit}&filter=${filter}&searchTerm=${searchTerm}`
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
}

const useDataRegions = (
    { page = 1, limit = default_limit, filter = default_filter, searchTerm = "", select }: IProps
) => {

    const { data, error, isLoading, isFetching, isError } = useQuery<ApiResponse>({
        queryKey: [KEY, page, limit, filter, searchTerm],
        queryFn: () =>
            fetchData({ page, limit, filter, searchTerm }),
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

export default useDataRegions;