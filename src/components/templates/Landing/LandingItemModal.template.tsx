import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Switch, TextField as MuiTextField, IconButton, Chip, Box,
} from '@mui/material';
import {
    LuX, LuZap, LuMessageSquare, LuLayers, LuGlobe, LuStar,
} from 'react-icons/lu';
import Button from '../../atoms/Button/Button';
import TextField from '../../atoms/TextField/TextField';
import { useColors } from '../../../utils/types';
import { useTheme } from '../../../contexts/ThemeContext';

// ── TagsInput ────────────────────────────────────────────────────────────────

interface TagsInputProps {
    label: string;
    value: string[];
    onChange: (v: string[]) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({ label, value, onChange }) => {
    const colors = useColors();
    const [inputVal, setInputVal] = useState('');
    const safe = value ?? [];

    const handleAdd = () => {
        const trimmed = inputVal.trim();
        if (!trimmed) return;
        onChange([...safe, trimmed]);
        setInputVal('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.neutral700 }}>{label}</span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <MuiTextField
                    size="small"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type and press Enter or click Add"
                    sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                            background: colors.neutral0,
                            '& fieldset': { borderColor: colors.neutral200 },
                            '&:hover fieldset': { borderColor: colors.neutral300 },
                        },
                        '& input': { color: colors.neutral900 },
                    }}
                />
                <Button variant="secondaryContained" label="Add" onClick={handleAdd} />
            </div>
            {safe.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {safe.map((tag, i) => (
                        <Chip
                            key={i}
                            size="small"
                            label={tag}
                            onDelete={() => onChange(safe.filter((_, j) => j !== i))}
                            sx={{
                                background: colors.neutral100,
                                color: colors.neutral700,
                                border: `1px solid ${colors.neutral200}`,
                                '& .MuiChip-deleteIcon': { color: colors.neutral400 },
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// ── Field layout helpers ─────────────────────────────────────────────────────

const HintText = ({ text, colors }: { text: string; colors: ReturnType<typeof useColors> }) => (
    <p style={{ fontSize: 11, color: colors.neutral400, marginTop: 4, marginLeft: 2 }}>{text}</p>
);

const TwoCol = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {children}
    </div>
);

// ── Modal ────────────────────────────────────────────────────────────────────

interface LandingItemModalProps {
    open: boolean;
    type: string;
    isEdit: boolean;
    formData: any;
    saving: boolean;
    onFieldChange: (key: string, value: any) => void;
    onSave: () => void;
    onClose: () => void;
}

const LandingItemModalTemplate: React.FC<LandingItemModalProps> = ({
    open,
    type,
    isEdit,
    formData,
    saving,
    onFieldChange,
    onSave,
    onClose,
}) => {
    const colors = useColors();
    const { isDark } = useTheme();

    const typeMap: Record<string, { icon: React.ReactNode; accent: string; label: string; sub: string }> = {
        feature:     { icon: <LuZap size={15} />,          accent: colors.primary500,   label: 'Feature',       sub: 'A capability highlight shown on the landing page' },
        faq:         { icon: <LuMessageSquare size={15} />, accent: colors.accent500,    label: 'FAQ',           sub: 'A frequently asked question and its answer' },
        step:        { icon: <LuLayers size={15} />,        accent: colors.secondary500, label: 'Step',          sub: 'A step in the how-to-use section' },
        audience:    { icon: <LuGlobe size={15} />,         accent: colors.warning500,   label: 'Audience Card', sub: 'A target audience segment card' },
        testimonial: { icon: <LuStar size={15} />,          accent: colors.success500,   label: 'Testimonial',   sub: 'A customer or client testimonial' },
    };

    const meta = typeMap[type] ?? { icon: null, accent: colors.primary500, label: type, sub: '' };
    const accentColor = meta.accent;

    const sectionLabel = (text: string) => (
        <p style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
            color: colors.neutral400, textTransform: 'uppercase', marginBottom: 2,
        }}>
            {text}
        </p>
    );

    const activeToggle = (
        <div
            style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px',
                background: colors.neutral0,
                border: `1px solid ${colors.neutral200}`,
                borderRadius: 10,
            }}
        >
            <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: colors.neutral800, marginBottom: 2 }}>Active</p>
                <p style={{ fontSize: 11, color: colors.neutral400 }}>Display this item on the public site</p>
            </div>
            <Switch
                checked={!!formData.isActive}
                onChange={e => onFieldChange('isActive', e.target.checked)}
                sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                        color: accentColor,
                        '& + .MuiSwitch-track': { backgroundColor: accentColor, opacity: 0.5 },
                    },
                }}
            />
        </div>
    );

    const sortOrderField = (
        <div style={{ maxWidth: '50%' }}>
            <TextField
                label="Sort Order"
                type="number"
                value={formData.sortOrder ?? ''}
                onChange={e => onFieldChange('sortOrder', Number(e.target.value))}
            />
        </div>
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    background: colors.neutral0,
                    border: `1px solid ${colors.neutral200}`,
                    borderRadius: '16px',
                    boxShadow: isDark
                        ? `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)`
                        : `0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)`,
                    overflow: 'hidden',
                }
            }}
        >
            {/* ── Accent line ───────────────────────────────────────────────── */}
            <Box sx={{ height: 3, background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}28 100%)`, flexShrink: 0 }} />

            {/* ── Title ─────────────────────────────────────────────────────── */}
            <DialogTitle
                sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    py: 2, px: 3,
                    background: colors.neutral0,
                    borderBottom: `1px solid ${colors.neutral100}`,
                }}
            >
                <Box
                    sx={{
                        width: 32, height: 32, flexShrink: 0,
                        borderRadius: '8px',
                        background: `${accentColor}14`,
                        border: `1px solid ${accentColor}28`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: accentColor,
                    }}
                >
                    {meta.icon}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: colors.neutral900, lineHeight: 1.2 }}>
                        {isEdit ? 'Edit' : 'Add'} {meta.label}
                    </p>
                    <p style={{ fontSize: 11, color: colors.neutral400, marginTop: 2, lineHeight: 1.3 }}>
                        {meta.sub}
                    </p>
                </Box>

                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                        color: colors.neutral400,
                        '&:hover': { background: colors.neutral100, color: colors.neutral700 },
                    }}
                >
                    <LuX size={16} />
                </IconButton>
            </DialogTitle>

            {/* ── Content ───────────────────────────────────────────────────── */}
            <DialogContent
                sx={{
                    padding: 0,
                    background: colors.neutral50,
                    overflowX: 'hidden',
                }}
            >
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* ── Feature ─────────────────────────────────────────── */}
                    {type === 'feature' && (
                        <>
                            {sectionLabel('Basic Information')}
                            <TextField
                                label="Title"
                                value={formData.title ?? ''}
                                onChange={e => onFieldChange('title', e.target.value)}
                            />
                            <TwoCol>
                                <div>
                                    <TextField
                                        label="Icon Name"
                                        value={formData.iconName ?? ''}
                                        onChange={e => onFieldChange('iconName', e.target.value)}
                                    />
                                    <HintText text='e.g. "LuEdit3"' colors={colors} />
                                </div>
                                <div>
                                    <TextField
                                        label="Color Key"
                                        value={formData.colorKey ?? ''}
                                        onChange={e => onFieldChange('colorKey', e.target.value)}
                                    />
                                    <HintText text='e.g. "teal"' colors={colors} />
                                </div>
                            </TwoCol>
                            <TextField
                                label="Description"
                                value={formData.description ?? ''}
                                onChange={e => onFieldChange('description', e.target.value)}
                                multiline
                                rows={3}
                            />
                        </>
                    )}

                    {/* ── FAQ ─────────────────────────────────────────────── */}
                    {type === 'faq' && (
                        <>
                            {sectionLabel('Content')}
                            <TextField
                                label="Question"
                                value={formData.question ?? ''}
                                onChange={e => onFieldChange('question', e.target.value)}
                                multiline
                                rows={2}
                            />
                            <TextField
                                label="Answer"
                                value={formData.answer ?? ''}
                                onChange={e => onFieldChange('answer', e.target.value)}
                                multiline
                                rows={4}
                            />
                        </>
                    )}

                    {/* ── Step ────────────────────────────────────────────── */}
                    {type === 'step' && (
                        <>
                            {sectionLabel('Basic Information')}
                            <TwoCol>
                                <div>
                                    <TextField
                                        label="Step Number"
                                        value={formData.stepNumber ?? ''}
                                        onChange={e => onFieldChange('stepNumber', e.target.value)}
                                    />
                                    <HintText text='e.g. "01"' colors={colors} />
                                </div>
                                <TextField
                                    label="Title"
                                    value={formData.title ?? ''}
                                    onChange={e => onFieldChange('title', e.target.value)}
                                />
                            </TwoCol>
                            <TwoCol>
                                <div>
                                    <TextField
                                        label="Icon Name"
                                        value={formData.iconName ?? ''}
                                        onChange={e => onFieldChange('iconName', e.target.value)}
                                    />
                                    <HintText text='e.g. "LuEdit3"' colors={colors} />
                                </div>
                                <div>
                                    <TextField
                                        label="Color Key"
                                        value={formData.colorKey ?? ''}
                                        onChange={e => onFieldChange('colorKey', e.target.value)}
                                    />
                                    <HintText text='e.g. "teal"' colors={colors} />
                                </div>
                            </TwoCol>
                            <TagsInput
                                label="Bullet Points"
                                value={formData.bullets ?? []}
                                onChange={v => onFieldChange('bullets', v)}
                            />
                        </>
                    )}

                    {/* ── Audience ─────────────────────────────────────────── */}
                    {type === 'audience' && (
                        <>
                            {sectionLabel('Basic Information')}
                            <TextField
                                label="Title"
                                value={formData.title ?? ''}
                                onChange={e => onFieldChange('title', e.target.value)}
                            />
                            <TwoCol>
                                <div>
                                    <TextField
                                        label="Icon Name"
                                        value={formData.iconName ?? ''}
                                        onChange={e => onFieldChange('iconName', e.target.value)}
                                    />
                                    <HintText text='e.g. "LuEdit3"' colors={colors} />
                                </div>
                                <div>
                                    <TextField
                                        label="Color Key"
                                        value={formData.colorKey ?? ''}
                                        onChange={e => onFieldChange('colorKey', e.target.value)}
                                    />
                                    <HintText text='e.g. "teal"' colors={colors} />
                                </div>
                            </TwoCol>
                            <TextField
                                label="Description"
                                value={formData.description ?? ''}
                                onChange={e => onFieldChange('description', e.target.value)}
                                multiline
                                rows={3}
                            />
                        </>
                    )}

                    {/* ── Testimonial ──────────────────────────────────────── */}
                    {type === 'testimonial' && (
                        <>
                            {sectionLabel('Author')}
                            <TwoCol>
                                <TextField
                                    label="Author Name"
                                    value={formData.authorName ?? ''}
                                    onChange={e => onFieldChange('authorName', e.target.value)}
                                />
                                <TextField
                                    label="Author Role"
                                    value={formData.authorRole ?? ''}
                                    onChange={e => onFieldChange('authorRole', e.target.value)}
                                />
                            </TwoCol>
                            <TextField
                                label="Author Company"
                                value={formData.authorCompany ?? ''}
                                onChange={e => onFieldChange('authorCompany', e.target.value)}
                            />
                            <TextField
                                label="Avatar URL"
                                value={formData.avatarUrl ?? ''}
                                onChange={e => onFieldChange('avatarUrl', e.target.value)}
                            />
                            <TextField
                                label="LinkedIn URL"
                                value={formData.linkedinUrl ?? ''}
                                onChange={e => onFieldChange('linkedinUrl', e.target.value)}
                            />
                            {sectionLabel('Content')}
                            <TextField
                                label="Testimonial"
                                value={formData.content ?? ''}
                                onChange={e => onFieldChange('content', e.target.value)}
                                multiline
                                rows={4}
                            />
                        </>
                    )}

                    {/* ── Settings (all types) ─────────────────────────────── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                        {sectionLabel('Settings')}
                        {sortOrderField}
                        {activeToggle}
                    </div>
                </div>
            </DialogContent>

            {/* ── Actions ───────────────────────────────────────────────────── */}
            <DialogActions
                sx={{
                    px: 3, py: 2, gap: 1,
                    background: colors.neutral0,
                    borderTop: `1px solid ${colors.neutral100}`,
                }}
            >
                <Button variant="tertiaryContained" label="Cancel" onClick={onClose} />
                <Button
                    variant="primaryContained"
                    label={isEdit ? 'Update' : 'Create'}
                    isLoading={saving}
                    onClick={onSave}
                />
            </DialogActions>
        </Dialog>
    );
};

export default LandingItemModalTemplate;
