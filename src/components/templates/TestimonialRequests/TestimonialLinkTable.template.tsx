import React, { useMemo, useState } from "react";
import { FiCopy, FiCheck, FiTrash2 } from "react-icons/fi";
import { TbLink } from "react-icons/tb";
import { type ColumnType } from "../../organisms/Table/TableV1";
import TableV1 from "../../organisms/Table/TableV1";
import ListingShell from "../Shared/ListingShell.template";
import { useColors } from "../../../utils/types";
import { DateUtils } from "../../../utils/helper";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useSnackbar } from "../../../hooks/useSnackBar";
import { usePermissionHelper } from "../../../hooks/usePermissionHelper";
import type { TestimonialLink } from "../../../services/useTestimonialLinkService";

type LinkStatus = "ACTIVE" | "USED" | "EXPIRED";

const getLinkStatus = (link: TestimonialLink): LinkStatus => {
    if (link.usedAt) return "USED";
    if (new Date(link.expiresAt) < new Date()) return "EXPIRED";
    return "ACTIVE";
};

const StatusBadge: React.FC<{ status: LinkStatus }> = ({ status }) => {
    const colors = useColors();
    const config: Record<LinkStatus, { bg: string; text: string; dot: string }> = {
        ACTIVE: { bg: `${colors.success500}18`, text: colors.success700 ?? colors.success500, dot: colors.success500 },
        USED: { bg: `${colors.neutral400}18`, text: colors.neutral600 ?? colors.neutral500, dot: colors.neutral500 },
        EXPIRED: { bg: `${colors.error500}18`, text: colors.error700 ?? colors.error500, dot: colors.error500 },
    };
    const c = config[status];
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 9px", borderRadius: 999,
            fontSize: 11, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase" as const,
            background: c.bg, color: c.text, whiteSpace: "nowrap" as const,
        }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
            {status}
        </span>
    );
};

const RecipientCell: React.FC<{ link: TestimonialLink }> = ({ link }) => {
    const colors = useColors();
    return (
        <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: colors.neutral800 }}>
                {link.requesterName?.trim() || "Anyone with the link"}
            </div>
            {link.requesterEmail && (
                <div style={{ fontSize: 12, color: colors.neutral500, marginTop: 2 }}>
                    {link.requesterEmail}
                </div>
            )}
        </div>
    );
};

const LinkCell: React.FC<{ url: string }> = ({ url }) => {
    const colors = useColors();
    const { showSnackbar } = useSnackbar();
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            showSnackbar("success", "Link copied to clipboard");
            setTimeout(() => setCopied(false), 1500);
        });
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, maxWidth: 320, minWidth: 0 }}>
            <span style={{
                fontSize: 12, color: colors.primary600, fontFamily: "monospace",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0,
            }}>
                {url.replace(/^https?:\/\//, "")}
            </span>
            <button
                onClick={handleCopy}
                title="Copy link"
                style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                    border: `1.5px solid ${colors.neutral300}`,
                    background: copied ? colors.success50 : "transparent",
                    color: copied ? colors.success600 : colors.neutral500,
                    cursor: "pointer", transition: "all .15s ease",
                }}
            >
                {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
            </button>
        </div>
    );
};

const ExpiryCell: React.FC<{ link: TestimonialLink }> = ({ link }) => {
    const colors = useColors();
    return (
        <div>
            <div style={{ fontSize: 13, color: colors.neutral700 }}>
                {DateUtils.dateTimeSecondToDate(link.expiresAt)}
            </div>
            {link.usedAt && (
                <div style={{ fontSize: 11, color: colors.neutral400, marginTop: 2 }}>
                    Used {DateUtils.dateTimeSecondToDate(link.usedAt)}
                </div>
            )}
        </div>
    );
};

const RevokeButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const colors = useColors();
    const { canDelete } = usePermissionHelper();
    if (!canDelete) return null;
    return (
        <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            title="Revoke"
            style={{
                width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 8, border: `1.5px solid ${colors.neutral300}`, background: "transparent",
                color: colors.error500, cursor: "pointer", transition: "all .18s ease", flexShrink: 0,
            }}
            onMouseEnter={(e) => {
                const b = e.currentTarget;
                b.style.background = colors.error50;
                b.style.borderColor = colors.error300;
            }}
            onMouseLeave={(e) => {
                const b = e.currentTarget;
                b.style.background = "transparent";
                b.style.borderColor = colors.neutral300;
            }}
        >
            <FiTrash2 size={13} />
        </button>
    );
};

interface ITestimonialLinkTableTemplateProps {
    links: TestimonialLink[];
    onGenerateClick: () => void;
    onRevoke: (link: TestimonialLink) => void;
}

const TestimonialLinkTableTemplate: React.FC<ITestimonialLinkTableTemplateProps> = ({
    links,
    onGenerateClick,
    onRevoke,
}) => {
    const isMobile = useIsMobile();

    const records = useMemo(() => links.map((link, index) => [
        index + 1,
        <RecipientCell key={`r-${link.id}`} link={link} />,
        <LinkCell key={`l-${link.id}`} url={link.shareUrl} />,
        <StatusBadge key={`s-${link.id}`} status={getLinkStatus(link)} />,
        <ExpiryCell key={`e-${link.id}`} link={link} />,
        <RevokeButton key={`a-${link.id}`} onClick={() => onRevoke(link)} />,
    ]), [links, onRevoke]);

    const schema = useMemo(() => ({
        id: 1,
        mobileView: isMobile ? "cards" as const : "responsive" as const,
        pagination: {
            limit: Math.max(links.length, 1),
            currentPage: 0,
            total: links.length,
            isVisible: false,
        },
        columns: [
            { label: "#", key: "sr", type: "number" as ColumnType, props: { className: "" }, priority: "low" as const, hideOnMobile: true },
            { label: "Recipient", key: "recipient", type: "custom" as ColumnType, props: { className: "" }, priority: "high" as const },
            { label: "Link", key: "link", type: "custom" as ColumnType, props: { className: "" }, priority: "high" as const },
            { label: "Status", key: "status", type: "custom" as ColumnType, props: { className: "" }, priority: "high" as const },
            { label: "Expires", key: "expires", type: "custom" as ColumnType, props: { className: "" }, priority: "medium" as const, hideOnMobile: true },
            { label: "", key: "actions", type: "custom" as ColumnType, props: { className: "" }, priority: "high" as const },
        ],
        hover: true,
        striped: true,
    }), [isMobile, links.length]);

    return (
        <ListingShell
            title="Testimonial Requests"
            icon={<TbLink />}
            description="Generate shareable links to collect testimonials from clients and colleagues"
            count={links.length}
            isAddButtonVisible
            addButtonLabel="Generate Link"
            addButtonOnClick={onGenerateClick}
        >
            <TableV1 schema={schema} records={records} />
        </ListingShell>
    );
};

export default TestimonialLinkTableTemplate;
