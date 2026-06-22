import React from 'react';
import { Chip } from '@mui/material';
import { LuPlus } from 'react-icons/lu';
import Button from '../../atoms/Button/Button';
import ActionButtons from '../../atoms/TableUtils/ActionButtons';
import TableV1 from '../../organisms/Table/TableV1';
import type { ColumnType } from '../../organisms/Table/TableV1';
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

    const schema = {
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
    };

    const records = steps.map(s => [
        <Chip key={`step-${s.id}`} size="small" label={s.stepNumber} />,
        s.title,
        <code key={`icon-${s.id}`}>{s.iconName}</code>,
        s.sortOrder,
        <Chip
            key={`status-${s.id}`}
            size="small"
            label={s.isActive ? 'Active' : 'Inactive'}
            color={s.isActive ? 'success' : 'default'}
        />,
        Action(s),
    ]);

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center px-5 py-4">
                <h2 className="text-base font-semibold text-gray-800">Steps</h2>
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

export default LandingStepsTableTemplate;
