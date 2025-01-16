"use client";

import { FETCH_INTERVAL } from "@/lib/utils";
import { CATEGORIES_ROUTES } from "@/routes/auth.routes";
import { FullCategoryType } from "@/types/category.type";
import { Category } from "@prisma/client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

const ROUTE = CATEGORIES_ROUTES.ADMIN.FETCH_ALL.URL;
const KEY = CATEGORIES_ROUTES.ADMIN.FETCH_ALL.KEY;
const INTERVAL = FETCH_INTERVAL

const default_limit = 10;
const default_filter = "all";

export type ApiResponse = {
    payload: FullCategoryType[];
    totalPages: number;
    totalData: number;
    currentPage: number;
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

const useAdminCategories = (
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

export default useAdminCategories;

export const useAdminCategoriesList = ({ limit = default_limit }: { limit?: number } = {}) => {
    const res = useAdminCategories({ limit, select: (data: ApiResponse) => { return data } })

    return {
        payload: res.payload?.map(({ id, name }) => {
            return { id, label: name }
        }) ?? [],
        isLoading: res.isLoading,
        isFetching: res.isFetching
    }
}