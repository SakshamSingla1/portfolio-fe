import React, { useEffect, useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useColors } from "../../../utils/types";
import useSearchService, { type SearchResult } from "../../../services/useSearchService";
import AutoCompleteInput, { type AutoCompleteOption } from "../../atoms/AutoCompleteInput/AutoCompleteInput";

interface SearchPanelProps {
    onClose: () => void;
}

const MODULE_LABELS: Record<string, string> = {
    skill: "Skills",
    project: "Projects",
    experience: "Experience",
    education: "Education",
    certification: "Certifications",
    publication: "Publications",
    achievement: "Achievements",
    service: "Services",
    testimonial: "Testimonials",
    blogPost: "Blog Posts",
};

const resultKey = (r: SearchResult) => `${r.module}-${r.id}`;

const SearchPanel: React.FC<SearchPanelProps> = ({ onClose }) => {
    const colors = useColors();
    const navigate = useNavigate();
    const searchService = useSearchService();

    const [searchTerm, setSearchTerm] = useState("");

    const { data: results = [], isFetching } = useQuery({
        queryKey: ["content-search", searchTerm],
        queryFn: async () => {
            const res = await searchService.search(searchTerm.trim());
            return (res?.data?.data ?? []) as SearchResult[];
        },
        enabled: searchTerm.trim().length > 0,
        placeholderData: keepPreviousData,
        staleTime: 60_000,
    });

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    const options: AutoCompleteOption[] = useMemo(
        () =>
            results.map((r) => ({
                value: resultKey(r),
                title: r.title,
                icon: (
                    <span
                        className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: colors.primary50, color: colors.primary600 }}
                    >
                        {MODULE_LABELS[r.module] ?? r.module}
                    </span>
                ),
                label: (
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold truncate" style={{ color: colors.neutral800 }}>
                            {r.title}
                        </span>
                        {r.snippet && (
                            <span className="text-xs truncate" style={{ color: colors.neutral500 }}>
                                {r.snippet}
                            </span>
                        )}
                    </div>
                ),
            })),
        [results, colors]
    );

    const handleSelect = (option: AutoCompleteOption | null) => {
        if (!option) return;
        const match = results.find((r) => resultKey(r) === option.value);
        if (!match) return;
        onClose();
        navigate(match.path);
    };

    return (
        <div
            className="fixed inset-0 flex items-start justify-center z-[1000] bg-black/60 backdrop-blur-md px-4 pt-24"
            onClick={onClose}
        >
            <div
                className="w-full max-w-xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] flex flex-col overflow-visible p-5"
                style={{ backgroundColor: colors.neutral50 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <AutoCompleteInput
                            options={options}
                            onSearch={setSearchTerm}
                            onChange={handleSelect}
                            loading={isFetching}
                            placeHolder="Search skills, projects, experience, blog posts…"
                            noOptionsText={
                                searchTerm.trim()
                                    ? `No results for "${searchTerm.trim()}"`
                                    : "Start typing to search across your portfolio content"
                            }
                        />
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-xl transition-all"
                        style={{ color: colors.neutral600, backgroundColor: colors.neutral100 }}
                    >
                        <FiX size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchPanel;
