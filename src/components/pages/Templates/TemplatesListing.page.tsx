import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { FiMail, FiMessageSquare, FiMessageCircle, FiFileText } from "react-icons/fi";
import { SORT_ENUM } from "../../../utils/types";
import type { IPagination } from "../../../utils/types";
import { initialPaginationValues } from "../../../utils/constant";
import { useTemplateService } from "../../../services/useTemplateService";
import TemplateListTableTemplate from "../../templates/Templates/TemplateList.template";

export type ChannelFilter = "all" | "email" | "sms" | "whatsapp";

const TemplatesListingPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const templateService = useTemplateService();

    const [filters, setFiltersTo] = useState<any>({
        search: searchParams.get("search") || "",
    });
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });
    const [channelFilter, setChannelFilter] = useState<ChannelFilter>("all");
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(filters.search), 500);
        return () => clearTimeout(timer);
    }, [filters.search]);

    const { data: pageResponse, isLoading } = useQuery({
        queryKey: ['templates', pagination.currentPage, pagination.pageSize, debouncedSearch],
        queryFn: () => templateService.getAllTemplates({
            page: pagination.currentPage,
            size: pagination.pageSize,
            sort: SORT_ENUM.DESC,
            search: filters.search,
        }),
    });

    const pageData = pageResponse?.data?.data;
    const templates = pageData?.content ?? [];
    const paginationWithTotal: IPagination = {
        ...pagination,
        totalRecords: pageData?.totalElements ?? 0,
        totalPages: pageData?.totalPages ?? 0,
    };

    const handleFiltersChange = (name: string, value: any) => {
        setFiltersTo((prev: any) => ({ ...prev, [name]: value ?? "" }));
        setPagination(prev => ({ ...prev, currentPage: 0 }));
    };

    const handlePaginationChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPagination(prev => ({ ...prev, pageSize: parseInt(event.target.value, 10) }));
    };

    useEffect(() => {
        setSearchParams({
            page: String(pagination.currentPage),
            size: String(pagination.pageSize),
            search: filters.search ?? "",
        });
    }, [filters, pagination.currentPage, pagination.pageSize, setSearchParams]);

    const emailCount    = templates.filter((t: any) => t.isEmail    === 1).length;
    const smsCount      = templates.filter((t: any) => t.isSms      === 1).length;
    const whatsappCount = templates.filter((t: any) => t.isWhatsapp === 1).length;

    const stats = [
        { label: "Total",     value: paginationWithTotal.totalRecords, icon: <FiFileText size={14} /> },
        { label: "Email",     value: emailCount,                       icon: <FiMail size={14} /> },
        { label: "SMS",       value: smsCount,                         icon: <FiMessageSquare size={14} /> },
        { label: "WhatsApp",  value: whatsappCount,                    icon: <FiMessageCircle size={14} /> },
    ];

    return (
        <TemplateListTableTemplate
            templates={templates}
            pagination={paginationWithTotal}
            handleFiltersChange={handleFiltersChange}
            handlePaginationChange={handlePaginationChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            filters={filters}
            loading={isLoading}
            channelFilter={channelFilter}
            setChannelFilter={setChannelFilter}
            stats={stats}
        />
    );
};

export default TemplatesListingPage;
