import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { HTTP_STATUS, type IPagination } from "../../../utils/types";
import { initialPaginationValues } from "../../../utils/constant";
import { useServiceService, type ServiceOffering } from "../../../services/useServiceService";
import { useSnackbar } from "../../../hooks/useSnackBar";
import ServiceTableTemplate from "../../templates/Services/ServiceTable.template";
import { DeleteConfirmation } from "../../molecules/DeleteConfirmation/DeleteConfirmation";

const ListingServicesPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const serviceService = useServiceService();
    const { showSnackbar } = useSnackbar();

    const [filters, setFilters] = useState({ search: searchParams.get("search") || "" });
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });

    const { data: pageResponse, isLoading, refetch } = useQuery({
        queryKey: ['services', pagination.currentPage, pagination.pageSize, filters.search],
        queryFn: () => serviceService.getAll({
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            sortDir: "ASC",
            sortBy: "sortOrder",
            search: filters.search || undefined,
        }),
        refetchOnMount: 'always',
    });

    const pageData = pageResponse?.data?.data;
    const services: ServiceOffering[] = pageData?.content ?? [];
    const paginationWithTotal: IPagination = {
        ...pagination,
        totalRecords: pageData?.totalElements ?? 0,
        totalPages: pageData?.totalPages ?? 0,
    };

    const [idPendingDelete, setIdPendingDelete] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (idPendingDelete == null) return;
        setDeleting(true);
        try {
            const res = await serviceService.remove(idPendingDelete);
            if (res?.status === HTTP_STATUS.OK) {
                showSnackbar("success", "Service deleted");
                refetch();
            } else {
                showSnackbar("error", res?.data?.message);
            }
        } catch {
            showSnackbar("error", "Failed to delete service");
        } finally {
            setDeleting(false);
            setIdPendingDelete(null);
        }
    };

    useEffect(() => {
        setSearchParams({ page: pagination.currentPage.toString(), size: pagination.pageSize.toString(), search: filters.search });
    }, [filters.search, pagination.currentPage, pagination.pageSize]);

    return (
        <>
            <ServiceTableTemplate
                services={services}
                pagination={paginationWithTotal}
                handlePaginationChange={(_, newPage) => setPagination((p) => ({ ...p, currentPage: newPage }))}
                handleRowsPerPageChange={(e) => setPagination((p) => ({ ...p, pageSize: parseInt(e.target.value, 10) }))}
                searchValue={filters.search}
                onSearchChange={(val) => { setFilters({ search: val ?? "" }); setPagination((p) => ({ ...p, currentPage: 0 })); }}
                onDelete={(id) => setIdPendingDelete(id)}
                isLoading={isLoading}
            />
            <DeleteConfirmation
                open={idPendingDelete != null}
                title="Delete this service?"
                description="This action cannot be undone."
                onDelete={handleDelete}
                onCancel={() => setIdPendingDelete(null)}
                deleteButtonText={deleting ? "Deleting..." : "Delete"}
            />
        </>
    );
};

export default ListingServicesPage;
