import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiMail, FiMessageSquare, FiMessageCircle, FiFileText } from "react-icons/fi";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { HTTP_STATUS, SORT_ENUM } from "../../../utils/types";
import type { IPagination } from "../../../utils/types";
import { initialPaginationValues } from "../../../utils/constant";
import { useTemplateService } from "../../../services/useTemplateService";
import type { INotificationTemplate, ITemplateFilterRequest } from "../../../services/useTemplateService";
import TemplateListTableTemplate from "../../templates/Templates/TemplateList.template";

export type ChannelFilter = "all" | "email" | "sms" | "whatsapp";

const TemplatesListingPage: React.FC = () => {
    const { showSnackbar } = useSnackbar();
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
    const [templates, setTemplatesTo] = useState<INotificationTemplate[]>([]);
    const [loading, setLoading] = useState(false);
    const [channelFilter, setChannelFilter] = useState<ChannelFilter>("all");
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(filters.search), 500);
        return () => clearTimeout(timer);
    }, [filters.search]);

    const refreshTemplates = async (page: number, size: number) => {
        setLoading(true);
        const params: ITemplateFilterRequest = {
            page,
            size,
            sort: SORT_ENUM.CREATED_AT_DESC,
            search: filters.search,
        };
        await templateService.getAllTemplates(params)
            .then((res) => {
                if (res?.status === HTTP_STATUS.OK) {
                    const { totalElements, totalPages } = res.data.data;
                    setPagination(prev => ({ ...prev, totalPages, totalRecords: totalElements }));
                    setTemplatesTo(res.data.data.content);
                }
            })
            .catch(() => {
                showSnackbar("error", "Failed to load notification templates");
                setTemplatesTo([]);
            })
            .finally(() => setLoading(false));
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
        refreshTemplates(pagination.currentPage, pagination.pageSize);
    }, [debouncedSearch, pagination.currentPage, pagination.pageSize]);

    useEffect(() => {
        setSearchParams({
            page: String(pagination.currentPage),
            size: String(pagination.pageSize),
            search: filters.search ?? "",
        });
    }, [filters, pagination.currentPage, pagination.pageSize]);

    const emailCount    = templates.filter(t => t.isEmail    === 1).length;
    const smsCount      = templates.filter(t => t.isSms      === 1).length;
    const whatsappCount = templates.filter(t => t.isWhatsapp === 1).length;

    const stats = [
        { label: "Total",     value: pagination.totalRecords, icon: <FiFileText size={14} /> },
        { label: "Email",     value: emailCount,              icon: <FiMail size={14} /> },
        { label: "SMS",       value: smsCount,                icon: <FiMessageSquare size={14} /> },
        { label: "WhatsApp",  value: whatsappCount,           icon: <FiMessageCircle size={14} /> },
    ];

    return (
        <TemplateListTableTemplate
            templates={templates}
            pagination={pagination}
            handleFiltersChange={handleFiltersChange}
            handlePaginationChange={handlePaginationChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            filters={filters}
            loading={loading}
            channelFilter={channelFilter}
            setChannelFilter={setChannelFilter}
            stats={stats}
        />
    );
};

export default TemplatesListingPage;
