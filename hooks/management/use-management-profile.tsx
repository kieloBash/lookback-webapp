"use client";

import { FETCH_INTERVAL } from "@/lib/utils";
import { FullManagementProfile } from "@/types/user.type";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

const ROUTE = "/api/profile/management/single";
const KEY = "";
const INTERVAL = FETCH_INTERVAL

const default_limit = 10;
const default_filter = "all";

export type ApiResponse = {
    payload: FullManagementProfile | undefined;
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
    if (!id) return { payload: undefined };

    const response = await fetch(
        `${ROUTE}?page=${page}&limit=${limit}&filter=${filter}&searchTerm=${searchTerm}&managementId=${id}`
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

const useManagementProfileId = (
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

export default useManagementProfileId;