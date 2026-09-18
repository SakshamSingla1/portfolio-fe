import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HTTP_STATUS, type IPagination, Status } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import { useSubscriptionPlanService, type SubscriptionPlanResponseDTO } from '../../../services/useSubscriptionPlanService';
import { useSearchParams } from 'react-router-dom';
import SubscriptionPlanTableTemplate from '../../templates/SubscriptionPlans/SubscriptionPlanTable.template';
import AutoCompleteInput from '../../atoms/AutoCompleteInput/AutoCompleteInput';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useSnackbar } from '../../../hooks/useSnackBar';
import ConfirmDialog from '../../molecules/ConfirmDialog/ConfirmDialog';

const ListingSubscriptionPlanPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const subscriptionPlanService = useSubscriptionPlanService();
    const isMobile = useIsMobile();
    const { showSnackbar } = useSnackbar();

    const statusOptions = [
        { label: "All Status", value: "" },
        { label: "Active", value: Status.ACTIVE },
        { label: "Inactive", value: Status.INACTIVE }
    ];

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
        status: searchParams.get("status") || ""
    };

    const [filters, setFiltersTo] = useState<any>(initialFiltersValues);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });
    const [idPendingDelete, setIdPendingDelete] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    const { data: pageResponse, isLoading, refetch } = useQuery({
        queryKey: ['subscription-plans', pagination.currentPage, pagination.pageSize, filters.search, filters.status],
        queryFn: () => subscriptionPlanService.getAllPlans({
            page: pagination.currentPage,
            size: pagination.pageSize,
            status: filters.status,
            search: filters.search,
        }),
        refetchOnMount: 'always',
    });

    const pageData = pageResponse?.data?.data;
    const plans: SubscriptionPlanResponseDTO[] = pageData?.content ?? [];
    const paginationWithTotal: IPagination = {
        ...pagination,
        totalRecords: pageData?.totalElements ?? 0,
        totalPages: pageData?.totalPages ?? 0,
    };

    const handleFiltersChange = (name: string, value: any) => {
        setFiltersTo({ ...filters, [name]: value ?? "" });
        setPagination({ ...pagination, currentPage: 0 })
    }

    const handlePaginationChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPagination((prevPagination) => ({
            ...prevPagination,
            currentPage: newPage
        }));
    }

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setPagination((prevPagination) => ({
            ...prevPagination,
            pageSize: newRowsPerPage
        }));
    };

    const handleDelete = async () => {
        if (idPendingDelete == null) return;
        setDeleting(true);
        try {
            const res = await subscriptionPlanService.deletePlan(idPendingDelete);
            if (res?.status === HTTP_STATUS.OK) {
                showSnackbar("success", "Subscription plan deleted");
                refetch();
            } else {
                showSnackbar("error", res?.data?.message || "Failed to delete plan");
            }
        } catch {
            showSnackbar("error", "Failed to delete plan");
        } finally {
            setDeleting(false);
            setIdPendingDelete(null);
        }
    };

    useEffect(() => {
        const params: Record<string, string> = {
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            search: filters.search ?? "",
            status: filters.status ?? ""
        };
        setSearchParams(params);
    }, [filters.search, filters.status, pagination, setSearchParams]);

    return (
        <>
            <SubscriptionPlanTableTemplate
                plans={plans}
                pagination={paginationWithTotal}
                handlePaginationChange={handlePaginationChange}
                handleRowsPerPageChange={handleRowsPerPageChange}
                searchValue={filters.search}
                onSearchChange={(val) => handleFiltersChange("search", val)}
                onDelete={(id) => setIdPendingDelete(id)}
                isLoading={isLoading}
                filterContent={
                    <div className="w-full sm:w-72">
                        <AutoCompleteInput
                            label={isMobile ? 'Status' : ''}
                            placeHolder='Select status'
                            options={statusOptions}
                            value={statusOptions.find(option => option.value === filters.status) || null}
                            onChange={(value) => handleFiltersChange('status', value?.value || '')}
                            onSearch={() => { }}
                        />
                    </div>
                }
            />
            <ConfirmDialog
                open={idPendingDelete != null}
                title="Delete this subscription plan?"
                message="Profiles currently on this plan will need to be reassigned. This action cannot be undone."
                danger
                loading={deleting}
                onConfirm={handleDelete}
                onClose={() => setIdPendingDelete(null)}
            />
        </>
    )
}

export default ListingSubscriptionPlanPage;
