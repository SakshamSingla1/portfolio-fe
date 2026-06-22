import React from 'react';
import { Chip } from '@mui/material';
import { LuPlus } from 'react-icons/lu';
import Button from '../../atoms/Button/Button';
import ActionButtons from '../../atoms/TableUtils/ActionButtons';
import TableV1 from '../../organisms/Table/TableV1';
import type { ColumnType } from '../../organisms/Table/TableV1';
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

    const schema = {
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
    };

    const records = testimonials.map(t => [
        t.authorName,
        t.authorRole,
        t.authorCompany,
        t.sortOrder,
        <Chip
            key={`status-${t.id}`}
            size="small"
            label={t.isActive ? 'Active' : 'Inactive'}
            color={t.isActive ? 'success' : 'default'}
        />,
        Action(t),
    ]);

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center px-5 py-4">
                <h2 className="text-base font-semibold text-gray-800">Testimonials</h2>
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

export default LandingTestimonialsTableTemplate;
