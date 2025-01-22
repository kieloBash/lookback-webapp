"use client";

import { FETCH_INTERVAL } from "@/lib/utils";
import { CityMunicipality } from "@/types/lib.type";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

const ROUTE = "/api/lookback/cities";
const KEY = "CITIES";
const INTERVAL = FETCH_INTERVAL

const default_limit = 10;
const default_filter = "all";

export type ApiResponse = {
    payload: CityMunicipality[];
};

export type FetchParams = {
    page?: number;
    limit?: number;
    filter?: string;
    searchTerm?: string;

    provCode?: string;
};

const fetchData = async ({
    page = 1,
    limit = default_limit,
    filter = default_filter,
    searchTerm = "",
    provCode
}: FetchParams): Promise<ApiResponse> => {

    // if (!provCode) return { payload: [] };

    const url = provCode ? `${ROUTE}/${provCode}?page=${page}&limit=${limit}&filter=${filter}&searchTerm=${searchTerm}` : `${ROUTE}?page=${page}&limit=${limit}&filter=${filter}&searchTerm=${searchTerm}`

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

    provCode?: string,
}

const useDataCities = (
    { page = 1, limit = default_limit, filter = default_filter, searchTerm = "", select, provCode = "" }: IProps
) => {

    const { data, error, isLoading, isFetching, isError } = useQuery<ApiResponse>({
        queryKey: [KEY, page, limit, filter, searchTerm, provCode],
        queryFn: () =>
            fetchData({ page, limit, filter, searchTerm, provCode }),
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

export default useDataCities;