import React, { useMemo } from 'react';
import { LuGlobe } from 'react-icons/lu';
import ActionButtons from '../../atoms/TableUtils/ActionButtons';
import TableV1 from '../../organisms/Table/TableV1';
import type { ColumnType } from '../../organisms/Table/TableV1';
import ListingShell from '../Shared/ListingShell.template';
import { StatusPill, ColorSwatch } from './LandingBadges';
import type { LandingAudienceCard } from '../../../services/useLandingPageService';

interface LandingAudienceTableProps {
    audience: LandingAudienceCard[];
    onAdd: () => void;
    onEdit: (item: LandingAudienceCard) => void;
    onDelete: (id: number) => void;
}

const LandingAudienceTableTemplate: React.FC<LandingAudienceTableProps> = ({
    audience,
    onAdd,
    onEdit,
    onDelete,
}) => {
    const Action = (item: LandingAudienceCard) => (
        <ActionButtons
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item.id!)}
        />
    );

    const schema = useMemo(() => ({
        id: 1,
        hover: true,
        columns: [
            { label: 'Title', key: 'title', type: 'string' as ColumnType, props: {} },
            { label: 'Icon', key: 'iconName', type: 'custom' as ColumnType, props: {} },
            { label: 'Color', key: 'colorKey', type: 'custom' as ColumnType, props: {} },
            { label: 'Order', key: 'sortOrder', type: 'number' as ColumnType, props: {} },
            { label: 'Status', key: 'isActive', type: 'custom' as ColumnType, props: {} },
            { label: 'Actions', key: 'actions', type: 'custom' as ColumnType, props: {} },
        ],
        pagination: { limit: 50, isVisible: false, currentPage: 0, total: 0 },
    }), []);

    const records = useMemo(() => audience.map(a => [
        a.title,
        <code key={`icon-${a.id}`}>{a.iconName}</code>,
        <ColorSwatch key={`color-${a.id}`} colorKey={a.colorKey} />,
        a.sortOrder,
        <StatusPill key={`status-${a.id}`} isActive={a.isActive} />,
        Action(a),
    ]), [audience, onEdit, onDelete]);

    return (
        <ListingShell
            title="Audience Cards"
            description="Who this portfolio builder is for, shown on the landing page"
            icon={<LuGlobe />}
            count={audience.length}
            addButtonLabel="Add Audience Card"
            addButtonOnClick={onAdd}
        >
            <TableV1 schema={schema} records={records} />
        </ListingShell>
    );
};

export default LandingAudienceTableTemplate;
