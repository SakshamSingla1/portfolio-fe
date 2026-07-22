import React, { useEffect, useMemo, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useColors } from "../../../utils/types";
import { useDebounce } from "../../../utils/helper";
import useSearchService, { type SearchResult } from "../../../services/useSearchService";

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

const SearchPanel: React.FC<SearchPanelProps> = ({ onClose }) => {
    const colors = useColors();
    const navigate = useNavigate();
    const searchService = useSearchService();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const runSearch = useDebounce(async (q: string) => {
        if (!q.trim()) {
            setResults([]);
            setSearched(false);
            setLoading(false);
            return;
        }
        setLoading(true);
        const res = await searchService.search(q.trim());
        setResults(res?.data?.data ?? []);
        setLoading(false);
        setSearched(true);
    }, 300);

    useEffect(() => {
        runSearch(query);
    }, [query]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    const grouped = useMemo(() => {
        const map: Record<string, SearchResult[]> = {};
        results.forEach((r) => {
            if (!map[r.module]) map[r.module] = [];
            map[r.module].push(r);
        });
        return map;
    }, [results]);

    const handleResultClick = (r: SearchResult) => {
        onClose();
        navigate(r.path);
    };

    return (
        <div
            className="fixed inset-0 flex items-start justify-center z-[1000] bg-black/60 backdrop-blur-md px-4 pt-24"
            onClick={onClose}
        >
            <div
                className="w-full max-w-xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden"
                style={{ backgroundColor: colors.neutral50, maxHeight: "70vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="flex items-center gap-3 px-5 py-4 border-b"
                    style={{ borderColor: colors.neutral300 }}
                >
                    <FiSearch size={18} style={{ color: colors.neutral500 }} />
                    <input
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search skills, projects, experience, blog posts…"
                        className="flex-1 bg-transparent outline-none text-sm"
                        style={{ color: colors.neutral800 }}
                    />
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg transition-all"
                        style={{ color: colors.neutral600, backgroundColor: colors.neutral100 }}
                    >
                        <FiX size={16} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 px-2 py-2">
                    {loading && (
                        <div className="text-center text-sm py-8" style={{ color: colors.neutral400 }}>
                            Searching…
                        </div>
                    )}

                    {!loading && searched && results.length === 0 && (
                        <div className="text-center text-sm py-8" style={{ color: colors.neutral400 }}>
                            No results for "{query}"
                        </div>
                    )}

                    {!loading && !searched && (
                        <div className="text-center text-sm py-8" style={{ color: colors.neutral400 }}>
                            Start typing to search across your portfolio content
                        </div>
                    )}

                    {!loading && Object.entries(grouped).map(([module, items]) => (
                        <div key={module} className="mb-2">
                            <div
                                className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
                                style={{ color: colors.neutral500 }}
                            >
                                {MODULE_LABELS[module] ?? module}
                            </div>
                            {items.map((r) => (
                                <button
                                    key={`${module}-${r.id}`}
                                    onClick={() => handleResultClick(r)}
                                    className="w-full text-left px-3 py-2.5 rounded-xl transition-all"
                                    style={{ color: colors.neutral800 }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.neutral100)}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                >
                                    <div className="text-sm font-semibold">{r.title}</div>
                                    {r.snippet && (
                                        <div
                                            className="text-xs mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap"
                                            style={{ color: colors.neutral500 }}
                                        >
                                            {r.snippet}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchPanel;
