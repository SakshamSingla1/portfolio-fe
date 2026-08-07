import React from 'react';
import { useColors } from '../../../utils/types';

// MUI's default Chip palette isn't wired to the app's dark-mode colors, so its
// 'default'/plain variants render near-invisible on a dark background — these
// two render with the same theme-aware token pattern as the rest of the admin.

export const StatusPill: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const colors = useColors();
    return (
        <span
            style={{
                background: isActive ? `${colors.success500}18` : `${colors.error500}18`,
                color: isActive ? (colors.success700 ?? colors.success500) : (colors.error700 ?? colors.error500),
                padding: '2px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'inline-block',
            }}
        >
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );
};

export const IndexBadge: React.FC<{ value: React.ReactNode }> = ({ value }) => {
    const colors = useColors();
    return (
        <span
            className="inline-flex items-center justify-center rounded-full font-semibold"
            style={{
                minWidth: 22,
                height: 22,
                padding: '0 6px',
                fontSize: 12,
                background: `${colors.primary500}18`,
                color: colors.primary700 ?? colors.primary500,
            }}
        >
            {value}
        </span>
    );
};

export const ColorSwatch: React.FC<{ colorKey?: string }> = ({ colorKey }) => {
    const colors = useColors();
    const swatch = colorKey === 'primary' ? colors.primary500
        : colorKey === 'secondary' ? colors.secondary500
        : colorKey === 'accent' ? colors.accent500
        : colors.neutral400;

    if (!colorKey) return <span style={{ color: colors.neutral400 }}>—</span>;

    return (
        <span className="inline-flex items-center gap-1.5">
            <span
                className="inline-block rounded-full shrink-0"
                style={{ width: 10, height: 10, background: swatch, border: `1px solid ${colors.neutral0}30` }}
            />
            <span style={{ color: colors.neutral700 }}>{colorKey}</span>
        </span>
    );
};
