import React, { useState } from 'react';
import { Chip, Divider, TextField as MuiTextField } from '@mui/material';
import { LuSave } from 'react-icons/lu';
import Button from '../../atoms/Button/Button';
import TextField from '../../atoms/TextField/TextField';
import type { LandingConfig } from '../../../services/useLandingPageService';

interface TagsInputProps {
    label: string;
    value: string[];
    onChange: (v: string[]) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({ label, value, onChange }) => {
    const [inputVal, setInputVal] = useState('');
    const safe = value ?? [];

    const handleAdd = () => {
        const trimmed = inputVal.trim();
        if (!trimmed) return;
        onChange([...safe, trimmed]);
        setInputVal('');
    };

    const handleDelete = (idx: number) => {
        onChange(safe.filter((_, i) => i !== idx));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <div className="flex gap-2 items-center">
                <MuiTextField
                    size="small"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type and press Enter or Add"
                    sx={{ flex: 1 }}
                />
                <Button
                    variant="secondaryContained"
                    label="Add"
                    onClick={handleAdd}
                />
            </div>
            {safe.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {safe.map((tag, i) => (
                        <Chip
                            key={i}
                            size="small"
                            label={tag}
                            onDelete={() => handleDelete(i)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

interface LandingConfigFormProps {
    config: LandingConfig;
    saving: boolean;
    onChange: (updates: Partial<LandingConfig>) => void;
    onSave: () => void;
}

const LandingConfigFormTemplate: React.FC<LandingConfigFormProps> = ({
    config,
    saving,
    onChange,
    onSave,
}) => {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hero Section */}
                <TextField
                    label="Hero Eyebrow"
                    value={config.heroEyebrow ?? ''}
                    onChange={e => onChange({ heroEyebrow: e.target.value })}
                />
                <TextField
                    label="Hero Headline 1"
                    value={config.heroHeadline1 ?? ''}
                    onChange={e => onChange({ heroHeadline1: e.target.value })}
                />
                <TextField
                    label="Hero Headline 2"
                    value={config.heroHeadline2 ?? ''}
                    onChange={e => onChange({ heroHeadline2: e.target.value })}
                />
                <TextField
                    label="Primary CTA Text"
                    value={config.heroPrimaryCtaText ?? ''}
                    onChange={e => onChange({ heroPrimaryCtaText: e.target.value })}
                />
                <TextField
                    label="Secondary CTA Text"
                    value={config.heroSecondaryCtaText ?? ''}
                    onChange={e => onChange({ heroSecondaryCtaText: e.target.value })}
                />
                <div className="md:col-span-2">
                    <TextField
                        label="Hero Description"
                        value={config.heroDescription ?? ''}
                        onChange={e => onChange({ heroDescription: e.target.value })}
                        multiline
                        rows={3}
                    />
                </div>
                <div className="md:col-span-2">
                    <TagsInput
                        label="Hero Trust Badges"
                        value={config.heroTrustBadges}
                        onChange={v => onChange({ heroTrustBadges: v })}
                    />
                </div>
            </div>

            <Divider />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CTA Section */}
                <TextField
                    label="CTA Badge Text"
                    value={config.ctaBadgeText ?? ''}
                    onChange={e => onChange({ ctaBadgeText: e.target.value })}
                />
                <TextField
                    label="CTA Headline"
                    value={config.ctaHeadline ?? ''}
                    onChange={e => onChange({ ctaHeadline: e.target.value })}
                />
                <TextField
                    label="CTA Button Text"
                    value={config.ctaButtonText ?? ''}
                    onChange={e => onChange({ ctaButtonText: e.target.value })}
                />
                <div className="md:col-span-2">
                    <TextField
                        label="CTA Description"
                        value={config.ctaDescription ?? ''}
                        onChange={e => onChange({ ctaDescription: e.target.value })}
                        multiline
                        rows={3}
                    />
                </div>
                <div className="md:col-span-2">
                    <TagsInput
                        label="CTA Trust Points"
                        value={config.ctaTrustPoints}
                        onChange={v => onChange({ ctaTrustPoints: v })}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    variant="primaryContained"
                    label="Save Config"
                    iconButton={<LuSave size={14} />}
                    buttonWithImg
                    isLoading={saving}
                    onClick={onSave}
                />
            </div>
        </div>
    );
};

export default LandingConfigFormTemplate;
