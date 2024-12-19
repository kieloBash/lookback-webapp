"use client";

import { FETCH_INTERVAL } from "@/lib/utils";
import { CATEGORIES_ROUTES } from "@/routes/categories.routes";
import { FullCategoryType } from "@/types/category.type";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

const ROUTE = CATEGORIES_ROUTES.ADMIN.FETCH_SINGLE.URL;
const KEY = CATEGORIES_ROUTES.ADMIN.FETCH_SINGLE.KEY;
const INTERVAL = FETCH_INTERVAL

const default_limit = 10;
const default_filter = "all";

export type ApiResponse = {
    payload: FullCategoryType;
};

export type FetchParams = {
    page?: number;
    limit?: number;
    filter?: string;
    searchTerm?: string;

    id: string;
};

const fetchData = async ({
    page = 1,
    limit = default_limit,
    filter = default_filter,
    searchTerm = "",

    id
}: FetchParams): Promise<ApiResponse> => {
    const response = await fetch(
        `${ROUTE}?page=${page}&limit=${limit}&filter=${filter}&searchTerm=${searchTerm}&id=${id}`
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

    id: string;
}

const useAdminCategoryId = (
    { page = 1, limit = default_limit, filter = default_filter, searchTerm = "", select, id }: IProps
) => {

    const { data, error, isLoading, isFetching, isError } = useQuery<ApiResponse>({
        queryKey: [KEY, page, limit, filter, searchTerm, id],
        queryFn: () =>
            fetchData({ page, limit, filter, searchTerm, id }),
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

export default useAdminCategoryId;