import React, { useMemo } from 'react';
import { LuLayers } from 'react-icons/lu';
import ActionButtons from '../../atoms/TableUtils/ActionButtons';
import TableV1 from '../../organisms/Table/TableV1';
import type { ColumnType } from '../../organisms/Table/TableV1';
import ListingShell from '../Shared/ListingShell.template';
import { StatusPill, IndexBadge } from './LandingBadges';
import type { LandingStep } from '../../../services/useLandingPageService';

interface LandingStepsTableProps {
    steps: LandingStep[];
    onAdd: () => void;
    onEdit: (item: LandingStep) => void;
    onDelete: (id: number) => void;
}

const LandingStepsTableTemplate: React.FC<LandingStepsTableProps> = ({
    steps,
    onAdd,
    onEdit,
    onDelete,
}) => {
    const Action = (item: LandingStep) => (
        <ActionButtons
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item.id!)}
        />
    );

    const schema = useMemo(() => ({
        id: 4,
        hover: true,
        columns: [
            { label: 'Step #', key: 'stepNumber', type: 'custom' as ColumnType, props: {} },
            { label: 'Title', key: 'title', type: 'string' as ColumnType, props: {} },
            { label: 'Icon', key: 'iconName', type: 'custom' as ColumnType, props: {} },
            { label: 'Order', key: 'sortOrder', type: 'number' as ColumnType, props: {} },
            { label: 'Status', key: 'isActive', type: 'custom' as ColumnType, props: {} },
            { label: 'Actions', key: 'actions', type: 'custom' as ColumnType, props: {} },
        ],
        pagination: { limit: 50, isVisible: false, currentPage: 0, total: 0 },
    }), []);

    const records = useMemo(() => steps.map(s => [
        <IndexBadge key={`step-${s.id}`} value={s.stepNumber} />,
        s.title,
        <code key={`icon-${s.id}`}>{s.iconName}</code>,
        s.sortOrder,
        <StatusPill key={`status-${s.id}`} isActive={s.isActive} />,
        Action(s),
    ]), [steps, onEdit, onDelete]);

    return (
        <ListingShell
            title="How To Use"
            description="Ordered steps shown in the landing page's how-it-works section"
            icon={<LuLayers />}
            count={steps.length}
            addButtonLabel="Add Step"
            addButtonOnClick={onAdd}
        >
            <TableV1 schema={schema} records={records} />
        </ListingShell>
    );
};

export default LandingStepsTableTemplate;
