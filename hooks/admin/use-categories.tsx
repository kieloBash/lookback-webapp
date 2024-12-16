"use client";

import { FETCH_INTERVAL } from "@/lib/utils";
import { CATEGORIES_ROUTES } from "@/routes/categories.routes";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

const ROUTE = CATEGORIES_ROUTES.ADMIN.FETCH_ALL.URL;
const KEY = CATEGORIES_ROUTES.ADMIN.FETCH_ALL.KEY;
const INTERVAL = FETCH_INTERVAL

const default_limit = 10;


export type ApiResponse = {
    payload: any[];
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
    filter = "all",
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

const useAdminCategories = (
    { page = 1, limit = default_limit, filter = "", searchTerm = "", select }: IProps
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

export default useAdminCategories;