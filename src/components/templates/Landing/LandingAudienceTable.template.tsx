import React from 'react';
import { Chip } from '@mui/material';
import { LuPlus } from 'react-icons/lu';
import Button from '../../atoms/Button/Button';
import ActionButtons from '../../atoms/TableUtils/ActionButtons';
import TableV1 from '../../organisms/Table/TableV1';
import type { ColumnType } from '../../organisms/Table/TableV1';
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

    const schema = {
        id: 'audience-table',
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

    const records = audience.map(a => [
        a.title,
        <code key={`icon-${a.id}`}>{a.iconName}</code>,
        <Chip key={`color-${a.id}`} size="small" label={a.colorKey} />,
        a.sortOrder,
        <Chip
            key={`status-${a.id}`}
            size="small"
            label={a.isActive ? 'Active' : 'Inactive'}
            color={a.isActive ? 'success' : 'default'}
        />,
        Action(a),
    ]);

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center px-5 py-4">
                <h2 className="text-base font-semibold text-gray-800">Audience Cards</h2>
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

export default LandingAudienceTableTemplate;
