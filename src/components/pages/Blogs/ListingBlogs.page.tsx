import React, { useEffect, useState } from "react";
import { HTTP_STATUS, SORT_ENUM, type IPagination } from "../../../utils/types";
import { initialPaginationValues } from "../../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useSnackbar } from "../../../hooks/useSnackBar";
import {
    useBlogPostService,
    type BlogPostSummary,
    type BlogPostFilterParams,
    BlogStatusOptions,
} from "../../../services/useBlogPostService";
import BlogPostTableTemplate from "../../templates/Blogs/BlogPostTable.template";
import AutoCompleteInput from "../../atoms/AutoCompleteInput/AutoCompleteInput";
import { useIsMobile } from "../../../hooks/useIsMobile";

const ListingBlogsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const blogPostService = useBlogPostService();
    const { showSnackbar } = useSnackbar();
    const isMobile = useIsMobile();

    const initialFilters = {
        search: searchParams.get("search") || "",
        status: searchParams.get("status") || "",
    };

    const [filters, setFilters] = useState<any>(initialFilters);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });
    const [posts, setPosts] = useState<BlogPostSummary[]>([]);

    const statusFilterOptions = [
        { label: "All Statuses", value: "" },
        ...BlogStatusOptions,
    ];

    const refreshPosts = async (page: string, size: string) => {
        const params: BlogPostFilterParams = {
            page: Number(page),
            size: Number(size),
            sortDir: SORT_ENUM.DESC,
            sortBy: "createdAt",
            search: filters.search || undefined,
            status: filters.status || undefined,
        };
        await blogPostService.getAll(params)
            .then((res) => {
                if (res?.status === HTTP_STATUS.OK) {
                    const { totalElements, totalPages } = res?.data?.data;
                    setPagination((prev) => ({
                        ...prev,
                        totalPages,
                        totalRecords: totalElements,
                    }));
                    setPosts(res?.data?.data?.content ?? []);
                }
            })
            .catch(() => {
                setPosts([]);
                showSnackbar("error", "Failed to load blog posts");
            });
    };

    const handleFiltersChange = (name: string, value: any) => {
        setFilters((prev: any) => ({ ...prev, [name]: value ?? "" }));
        setPagination((prev) => ({ ...prev, currentPage: 0 }));
    };

    const handlePaginationChange = (
        _event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPagination((prev) => ({
            ...prev,
            pageSize: parseInt(event.target.value, 10),
            currentPage: 0,
        }));
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await blogPostService.remove(id);
            if (res?.status === HTTP_STATUS.OK) {
                showSnackbar("success", res?.data?.message || "Blog post deleted");
                refreshPosts(pagination.currentPage.toString(), pagination.pageSize.toString());
            } else {
                showSnackbar("error", res?.data?.message || "Failed to delete blog post");
            }
        } catch {
            showSnackbar("error", "Failed to delete blog post");
        }
    };

    useEffect(() => {
        refreshPosts(pagination.currentPage.toString(), pagination.pageSize.toString());
    }, [filters, pagination.currentPage, pagination.pageSize]);

    useEffect(() => {
        const params: Record<string, string> = {
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            search: filters.search ?? "",
            status: filters.status ?? "",
        };
        setSearchParams(params);
    }, [filters.search, filters.status, pagination.currentPage, pagination.pageSize]);

    return (
        <BlogPostTableTemplate
            posts={posts}
            pagination={pagination}
            handlePaginationChange={handlePaginationChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            searchValue={filters.search}
            onSearchChange={(val) => handleFiltersChange("search", val)}
            onDelete={handleDelete}
            filterContent={
                <div className="w-full sm:w-64">
                    <AutoCompleteInput
                        label={isMobile ? "Status" : ""}
                        placeHolder="Filter by status"
                        options={statusFilterOptions}
                        value={
                            filters.status
                                ? statusFilterOptions.find((o) => o.value === filters.status) ?? null
                                : null
                        }
                        onChange={(option: any) =>
                            handleFiltersChange("status", option?.value ?? "")
                        }
                        onSearch={() => {}}
                    />
                </div>
            }
        />
    );
};

export default ListingBlogsPage;
