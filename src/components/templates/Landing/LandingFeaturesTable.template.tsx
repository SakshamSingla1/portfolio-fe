import React from 'react';
import { Chip } from '@mui/material';
import { LuPlus } from 'react-icons/lu';
import Button from '../../atoms/Button/Button';
import ActionButtons from '../../atoms/TableUtils/ActionButtons';
import TableV1 from '../../organisms/Table/TableV1';
import type { ColumnType } from '../../organisms/Table/TableV1';
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

    const schema = {
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
    };

    const records = features.map(f => [
        f.title,
        <code key={`icon-${f.id}`}>{f.iconName}</code>,
        <Chip key={`color-${f.id}`} size="small" label={f.colorKey} />,
        f.sortOrder,
        <Chip
            key={`status-${f.id}`}
            size="small"
            label={f.isActive ? 'Active' : 'Inactive'}
            color={f.isActive ? 'success' : 'default'}
        />,
        Action(f),
    ]);

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center px-5 py-4">
                <h2 className="text-base font-semibold text-gray-800">Features</h2>
                <Button
                    variant="primaryContained"
                    label="Add"
                    iconButton={<LuPlus size={14} />}
                    buttonWithImg
                    onClick={onAdd}
                />
            </div>
            <TableV1 schema={schema} records={records} />
        </div>
    );
};

export default LandingFeaturesTableTemplate;
