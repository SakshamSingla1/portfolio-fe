import React, { useMemo } from 'react';
import { LuStar } from 'react-icons/lu';
import ActionButtons from '../../atoms/TableUtils/ActionButtons';
import TableV1 from '../../organisms/Table/TableV1';
import type { ColumnType } from '../../organisms/Table/TableV1';
import ListingShell from '../Shared/ListingShell.template';
import { StatusPill } from './LandingBadges';
import type { LandingTestimonial } from '../../../services/useLandingPageService';

interface LandingTestimonialsTableProps {
    testimonials: LandingTestimonial[];
    onAdd: () => void;
    onEdit: (item: LandingTestimonial) => void;
    onDelete: (id: number) => void;
}

const LandingTestimonialsTableTemplate: React.FC<LandingTestimonialsTableProps> = ({
    testimonials,
    onAdd,
    onEdit,
    onDelete,
}) => {
    const Action = (item: LandingTestimonial) => (
        <ActionButtons
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item.id!)}
        />
    );

    const schema = useMemo(() => ({
        id: 5,
        hover: true,
        columns: [
            { label: 'Author', key: 'authorName', type: 'string' as ColumnType, props: {} },
            { label: 'Role', key: 'authorRole', type: 'string' as ColumnType, props: {} },
            { label: 'Company', key: 'authorCompany', type: 'string' as ColumnType, props: {} },
            { label: 'Order', key: 'sortOrder', type: 'number' as ColumnType, props: {} },
            { label: 'Status', key: 'isActive', type: 'custom' as ColumnType, props: {} },
            { label: 'Actions', key: 'actions', type: 'custom' as ColumnType, props: {} },
        ],
        pagination: { limit: 50, isVisible: false, currentPage: 0, total: 0 },
    }), []);

    const records = useMemo(() => testimonials.map(t => [
        t.authorName,
        t.authorRole,
        t.authorCompany,
        t.sortOrder,
        <StatusPill key={`status-${t.id}`} isActive={t.isActive} />,
        Action(t),
    ]), [testimonials, onEdit, onDelete]);

    return (
        <ListingShell
            title="Testimonials"
            description="Quotes from clients shown on the landing page"
            icon={<LuStar />}
            count={testimonials.length}
            addButtonLabel="Add Testimonial"
            addButtonOnClick={onAdd}
        >
            <TableV1 schema={schema} records={records} />
        </ListingShell>
    );
};

export default LandingTestimonialsTableTemplate;
