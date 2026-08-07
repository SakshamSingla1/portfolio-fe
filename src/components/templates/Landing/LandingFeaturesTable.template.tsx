import React, { useMemo } from 'react';
import { LuZap } from 'react-icons/lu';
import ActionButtons from '../../atoms/TableUtils/ActionButtons';
import TableV1 from '../../organisms/Table/TableV1';
import type { ColumnType } from '../../organisms/Table/TableV1';
import ListingShell from '../Shared/ListingShell.template';
import { StatusPill, ColorSwatch } from './LandingBadges';
import type { LandingFeature } from '../../../services/useLandingPageService';

interface LandingFeaturesTableProps {
    features: LandingFeature[];
    onAdd: () => void;
    onEdit: (item: LandingFeature) => void;
    onDelete: (id: number) => void;
}

const LandingFeaturesTableTemplate: React.FC<LandingFeaturesTableProps> = ({
    features,
    onAdd,
    onEdit,
    onDelete,
}) => {
    const Action = (item: LandingFeature) => (
        <ActionButtons
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item.id!)}
        />
    );

    const schema = useMemo(() => ({
        id: 3,
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

    const records = useMemo(() => features.map(f => [
        f.title,
        <code key={`icon-${f.id}`}>{f.iconName}</code>,
        <ColorSwatch key={`color-${f.id}`} colorKey={f.colorKey} />,
        f.sortOrder,
        <StatusPill key={`status-${f.id}`} isActive={f.isActive} />,
        Action(f),
    ]), [features, onEdit, onDelete]);

    return (
        <ListingShell
            title="Features"
            description="Highlight cards shown in the landing page's features section"
            icon={<LuZap />}
            count={features.length}
            addButtonLabel="Add Feature"
            addButtonOnClick={onAdd}
        >
            <TableV1 schema={schema} records={records} />
        </ListingShell>
    );
};

export default LandingFeaturesTableTemplate;
