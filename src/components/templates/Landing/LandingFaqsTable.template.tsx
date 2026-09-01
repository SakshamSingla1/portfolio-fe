import React, { useMemo } from 'react';
import { LuMessageSquare } from 'react-icons/lu';
import ActionButtons from '../../atoms/TableUtils/ActionButtons';
import TableV1 from '../../organisms/Table/TableV1';
import type { ColumnType } from '../../organisms/Table/TableV1';
import ListingShell from '../Shared/ListingShell.template';
import { StatusPill } from './LandingBadges';
import type { LandingFaq } from '../../../services/useLandingPageService';

interface LandingFaqsTableProps {
    faqs: LandingFaq[];
    onAdd: () => void;
    onEdit: (item: LandingFaq) => void;
    onDelete: (id: number) => void;
}

const LandingFaqsTableTemplate: React.FC<LandingFaqsTableProps> = ({
    faqs,
    onAdd,
    onEdit,
    onDelete,
}) => {
    const schema = useMemo(() => ({
        id: 2,
        hover: true,
        columns: [
            { label: 'Question', key: 'question', type: 'string' as ColumnType, props: {} },
            { label: 'Order', key: 'sortOrder', type: 'number' as ColumnType, props: {} },
            { label: 'Status', key: 'isActive', type: 'custom' as ColumnType, props: {} },
            { label: 'Actions', key: 'actions', type: 'custom' as ColumnType, props: {} },
        ],
        pagination: { limit: 50, isVisible: false, currentPage: 0, total: 0 },
    }), []);

    const records = useMemo(() => faqs.map(f => [
        f.question,
        f.sortOrder,
        <StatusPill key={`status-${f.id}`} isActive={f.isActive} />,
        <ActionButtons
            key={`actions-${f.id}`}
            onEdit={() => onEdit(f)}
            onDelete={() => onDelete(f.id!)}
        />,
    ]), [faqs, onEdit, onDelete]);

    return (
        <ListingShell
            title="FAQs"
            description="Common questions answered on the landing page"
            icon={<LuMessageSquare />}
            count={faqs.length}
            addButtonLabel="Add FAQ"
            addButtonOnClick={onAdd}
        >
            <TableV1 schema={schema} records={records} />
        </ListingShell>
    );
};

export default LandingFaqsTableTemplate;
