import React, { useState, useEffect } from 'react';
import { Collapse, LinearProgress, InputAdornment } from '@mui/material';
import { LuSave } from 'react-icons/lu';
import { FiChevronDown, FiPlus, FiX, FiZap, FiTarget } from 'react-icons/fi';
import Button from '../../atoms/Button/Button';
import TextField from '../../atoms/TextField/TextField';
import { useColors } from '../../../utils/types';
import type { LandingConfig } from '../../../services/useLandingPageService';

// ── Char Counter ───────────────────────────────────────────────────────────────
const CharCounter: React.FC<{ value: string; max: number }> = ({ value, max }) => {
    const colors = useColors();
    const len = value?.length ?? 0;
    const pct = Math.min(len / max, 1);
    const over = len > max;
    const warn = !over && pct > 0.85;
    const barColor = over ? colors.error500 : warn ? colors.warning500 : colors.primary500;
    return (
        <div className="flex items-center justify-end gap-2 mt-1">
            <div className="w-16 h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.neutral200 }}>
                <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct * 100}%`, backgroundColor: barColor }}
                />
            </div>
            <span
                className="text-xs tabular-nums"
                style={{ color: over ? colors.error500 : colors.neutral400 }}
            >
                {len} / {max}
            </span>
        </div>
    );
};

// ── Enhanced Tags Input ────────────────────────────────────────────────────────
interface TagsInputProps {
    label: string;
    hint?: string;
    value: string[];
    onChange: (v: string[]) => void;
    placeholder?: string;
    max?: number;
}

const TagsInput: React.FC<TagsInputProps> = ({
    label, hint, value, onChange, placeholder = 'Type and press Enter or click Add…', max,
}) => {
    const colors = useColors();
    const [inputVal, setInputVal] = useState('');
    const safe = value ?? [];

    const handleAdd = () => {
        const trimmed = inputVal.trim();
        if (!trimmed || safe.includes(trimmed) || (max && safe.length >= max)) return;
        onChange([...safe, trimmed]);
        setInputVal('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
        if (e.key === 'Backspace' && !inputVal && safe.length > 0) onChange(safe.slice(0, -1));
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between ml-2">
                <div className="flex items-center gap-2">
                    <span
                        className="text-sm font-semibold select-none tracking-tight"
                        style={{ color: colors.neutral700 }}
                    >
                        {label}
                    </span>
                    {safe.length > 0 && (
                        <span
                            className="text-[11px] font-bold px-2 py-0.5 rounded-full tabular-nums"
                            style={{ backgroundColor: colors.primary50, color: colors.primary600 }}
                        >
                            {safe.length}{max ? ` / ${max}` : ''}
                        </span>
                    )}
                </div>
                {safe.length > 0 && (
                    <button
                        type="button"
                        onClick={() => onChange([])}
                        className="text-xs px-2.5 py-0.5 rounded-full transition-all hover:opacity-75"
                        style={{ color: colors.error600, backgroundColor: colors.error100 }}
                    >
                        Clear all
                    </button>
                )}
            </div>

            {hint && (
                <p className="text-xs ml-2 -mt-1" style={{ color: colors.neutral400 }}>
                    {hint}
                </p>
            )}

            <TextField
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                InputProps={{
                    endAdornment: inputVal.trim() ? (
                        <InputAdornment position="end">
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90 active:scale-[0.97]"
                                style={{ backgroundColor: colors.primary500, color: colors.neutral0, whiteSpace: 'nowrap' }}
                            >
                                <FiPlus size={12} color={colors.neutral0}/>
                                Add
                            </button>
                        </InputAdornment>
                    ) : null,
                }}
            />

            {safe.length > 0 && (
                <div
                    className="flex flex-wrap gap-2 p-3 rounded-2xl transition-all"
                    style={{
                        backgroundColor: colors.neutral50,
                        border: `1.5px solid ${colors.neutral200}`,
                    }}
                >
                    {safe.map((tag, i) => (
                        <div
                            key={`${tag}-${i}`}
                            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-[1.02] select-none"
                            style={{
                                backgroundColor: colors.primary50,
                                color: colors.primary700,
                                border: `1.5px solid ${colors.primary200}`,
                            }}
                        >
                            <span
                                className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                                style={{ backgroundColor: colors.primary100, color: colors.primary600 }}
                            >
                                {i + 1}
                            </span>
                            {tag}
                            <button
                                type="button"
                                onClick={() => onChange(safe.filter((_, j) => j !== i))}
                                className="flex items-center justify-center rounded-full p-0.5 transition-all opacity-40 group-hover:opacity-100"
                                style={{ color: 'inherit' }}
                                onMouseEnter={e => (e.currentTarget.style.color = colors.error500)}
                                onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}
                            >
                                <FiX size={10} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ── Section Card ───────────────────────────────────────────────────────────────
interface SectionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    accentColor: string;
    filled: number;
    total: number;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({
    icon, title, description, accentColor, filled, total, children, defaultOpen = true,
}) => {
    const colors = useColors();
    const [open, setOpen] = useState(defaultOpen);
    const allDone = filled === total;

    return (
        <div
            className="rounded-3xl overflow-hidden transition-shadow duration-300"
            style={{
                border: `1.5px solid ${colors.neutral200}`,
                borderLeft: `4px solid ${accentColor}`,
                backgroundColor: colors.neutral0,
                boxShadow: open
                    ? '0 8px 32px -8px rgba(0,0,0,0.08)'
                    : '0 2px 8px -4px rgba(0,0,0,0.04)',
            }}
        >
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center gap-4 px-6 py-5 text-left transition-opacity duration-150 hover:opacity-80"
                style={{ backgroundColor: 'transparent' }}
            >
                <div
                    className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: accentColor, color: colors.neutral0 }}
                >
                    {icon}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="font-bold text-base" style={{ color: colors.neutral900 }}>
                        {title}
                    </div>
                    <div className="text-sm mt-0.5 truncate" style={{ color: colors.neutral500 }}>
                        {description}
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    {allDone ? (
                        <span
                            className="text-xs font-bold px-3 py-1 rounded-full"
                            style={{ backgroundColor: colors.success100, color: colors.success700 }}
                        >
                            All done ✓
                        </span>
                    ) : (
                        <div className="flex flex-col items-end gap-1.5">
                            <span
                                className="text-xs font-semibold tabular-nums px-2.5 py-0.5 rounded-full"
                                style={{ backgroundColor: colors.neutral100, color: colors.neutral600 }}
                            >
                                {filled} / {total}
                            </span>
                            <div className="flex gap-0.5">
                                {Array.from({ length: total }, (_, i) => (
                                    <div
                                        key={i}
                                        className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                                        style={{ backgroundColor: i < filled ? accentColor : colors.neutral200 }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    <FiChevronDown
                        size={18}
                        className="transition-transform duration-300"
                        style={{
                            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                            color: colors.neutral400,
                        }}
                    />
                </div>
            </button>

            <Collapse in={open}>
                <div
                    className="px-6 pb-6 pt-4"
                    style={{ borderTop: `1px solid ${colors.neutral100}` }}
                >
                    {children}
                </div>
            </Collapse>
        </div>
    );
};

// ── Field With Char Counter ────────────────────────────────────────────────────
const FieldWithCount: React.FC<{ children: React.ReactNode; value: string; max: number }> = ({
    children, value, max,
}) => (
    <div>
        {children}
        <CharCounter value={value} max={max} />
    </div>
);

// ── Completion helpers ─────────────────────────────────────────────────────────
const HERO_TOTAL = 7;
const CTA_TOTAL  = 5;

const heroFilled = (c: LandingConfig) =>
    [c.heroEyebrow, c.heroHeadline1, c.heroHeadline2, c.heroDescription, c.heroPrimaryCtaText, c.heroSecondaryCtaText]
        .filter(v => v?.trim()).length + ((c.heroTrustBadges?.length ?? 0) > 0 ? 1 : 0);

const ctaFilled = (c: LandingConfig) =>
    [c.ctaBadgeText, c.ctaHeadline, c.ctaDescription, c.ctaButtonText]
        .filter(v => v?.trim()).length + ((c.ctaTrustPoints?.length ?? 0) > 0 ? 1 : 0);

// ── Main Form ─────────────────────────────────────────────────────────────────
interface LandingConfigFormProps {
    config: LandingConfig;
    saving: boolean;
    onChange: (updates: Partial<LandingConfig>) => void;
    onSave: () => void;
}

const LandingConfigFormTemplate: React.FC<LandingConfigFormProps> = ({
    config, saving, onChange, onSave,
}) => {
    const colors = useColors();
    const hFilled     = heroFilled(config);
    const cFilled     = ctaFilled(config);
    const totalFilled = hFilled + cFilled;
    const totalFields = HERO_TOTAL + CTA_TOTAL;
    const overallPct  = Math.round((totalFilled / totalFields) * 100);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                if (!saving) onSave();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [saving, onSave]);

    return (
        <div className="flex flex-col gap-6">

            {/* ── Overall progress ─────────────────────────────────────────── */}
            <div
                className="px-5 py-4 rounded-2xl"
                style={{
                    backgroundColor: colors.neutral50,
                    border: `1.5px solid ${colors.neutral200}`,
                }}
            >
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold" style={{ color: colors.neutral700 }}>
                            Content Completeness
                        </span>
                        <span
                            className="text-sm font-bold tabular-nums"
                            style={{ color: overallPct === 100 ? colors.success600 : colors.primary600 }}
                        >
                            {overallPct}%
                        </span>
                    </div>
                    <LinearProgress
                        variant="determinate"
                        value={overallPct}
                        sx={{
                            height: 6,
                            borderRadius: 9999,
                            backgroundColor: colors.neutral200,
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 9999,
                                backgroundColor: overallPct === 100 ? colors.success600 : colors.primary500,
                                transition: 'width 0.4s ease',
                            },
                        }}
                    />
                    <span className="text-xs" style={{ color: colors.neutral400 }}>
                        {totalFilled} of {totalFields} fields configured
                    </span>
                </div>
            </div>

            {/* ── Hero Section ─────────────────────────────────────────────── */}
            <SectionCard
                icon={<FiZap size={18} />}
                title="Hero Section"
                description="The main headline, description and CTAs visitors see first"
                accentColor={colors.primary500}
                filled={hFilled}
                total={HERO_TOTAL}
                defaultOpen
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <TextField
                        label="Eyebrow Text"
                        value={config.heroEyebrow ?? ''}
                        onChange={e => onChange({ heroEyebrow: e.target.value })}
                        placeholder="e.g. Build your portfolio"
                    />
                    <TextField
                        label="Headline Line 1"
                        value={config.heroHeadline1 ?? ''}
                        onChange={e => onChange({ heroHeadline1: e.target.value })}
                        placeholder="e.g. Ship faster."
                    />
                    <TextField
                        label="Headline Line 2"
                        value={config.heroHeadline2 ?? ''}
                        onChange={e => onChange({ heroHeadline2: e.target.value })}
                        placeholder="e.g. Hire smarter."
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <TextField
                            label="Primary CTA"
                            value={config.heroPrimaryCtaText ?? ''}
                            onChange={e => onChange({ heroPrimaryCtaText: e.target.value })}
                            placeholder="e.g. Get Started"
                        />
                        <TextField
                            label="Secondary CTA"
                            value={config.heroSecondaryCtaText ?? ''}
                            onChange={e => onChange({ heroSecondaryCtaText: e.target.value })}
                            placeholder="e.g. See Demo"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <FieldWithCount value={config.heroDescription ?? ''} max={220}>
                            <TextField
                                label="Hero Description"
                                value={config.heroDescription ?? ''}
                                onChange={e => onChange({ heroDescription: e.target.value })}
                                placeholder="A short, compelling description of your value proposition…"
                                multiline
                                rows={3}
                            />
                        </FieldWithCount>
                    </div>
                    <div className="md:col-span-2">
                        <TagsInput
                            label="Trust Badges"
                            hint="Short social-proof phrases shown below the hero headline"
                            value={config.heroTrustBadges ?? []}
                            onChange={v => onChange({ heroTrustBadges: v })}
                            placeholder="e.g. 500+ Portfolios Built"
                            max={6}
                        />
                    </div>
                </div>
            </SectionCard>

            {/* ── CTA Section ──────────────────────────────────────────────── */}
            <SectionCard
                icon={<FiTarget size={18} />}
                title="CTA Section"
                description="Bottom-of-page conversion banner to turn visitors into sign-ups"
                accentColor={colors.primary700}
                filled={cFilled}
                total={CTA_TOTAL}
                defaultOpen={false}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <TextField
                        label="Badge Text"
                        value={config.ctaBadgeText ?? ''}
                        onChange={e => onChange({ ctaBadgeText: e.target.value })}
                        placeholder="e.g. Start for free"
                    />
                    <TextField
                        label="Headline"
                        value={config.ctaHeadline ?? ''}
                        onChange={e => onChange({ ctaHeadline: e.target.value })}
                        placeholder="e.g. Ready to stand out?"
                    />
                    <TextField
                        label="Button Text"
                        value={config.ctaButtonText ?? ''}
                        onChange={e => onChange({ ctaButtonText: e.target.value })}
                        placeholder="e.g. Create Your Portfolio"
                    />
                    <div className="md:col-span-2">
                        <FieldWithCount value={config.ctaDescription ?? ''} max={200}>
                            <TextField
                                label="CTA Description"
                                value={config.ctaDescription ?? ''}
                                onChange={e => onChange({ ctaDescription: e.target.value })}
                                placeholder="Reinforce the value prop and nudge visitors to sign up…"
                                multiline
                                rows={3}
                            />
                        </FieldWithCount>
                    </div>
                    <div className="md:col-span-2">
                        <TagsInput
                            label="Trust Points"
                            hint="Bullet-style reassurances that reduce friction before sign-up"
                            value={config.ctaTrustPoints ?? []}
                            onChange={v => onChange({ ctaTrustPoints: v })}
                            placeholder="e.g. No credit card required"
                            max={5}
                        />
                    </div>
                </div>
            </SectionCard>

            {/* ── Sticky save footer ───────────────────────────────────────── */}
            <div
                className="sticky bottom-4 flex items-center justify-between px-5 py-4 rounded-2xl"
                style={{
                    backgroundColor: colors.neutral0,
                    border: `1.5px solid ${colors.neutral200}`,
                    boxShadow: '0 8px 32px -8px rgba(0,0,0,0.12)',
                }}
            >
                <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: colors.neutral400 }}>
                        Quick save:
                    </span>
                    <kbd
                        className="text-xs px-2 py-0.5 rounded-lg font-mono"
                        style={{
                            backgroundColor: colors.neutral100,
                            color: colors.neutral600,
                            border: `1px solid ${colors.neutral300}`,
                        }}
                    >
                        ⌘S
                    </kbd>
                    <span className="text-xs" style={{ color: colors.neutral300 }}>/</span>
                    <kbd
                        className="text-xs px-2 py-0.5 rounded-lg font-mono"
                        style={{
                            backgroundColor: colors.neutral100,
                            color: colors.neutral600,
                            border: `1px solid ${colors.neutral300}`,
                        }}
                    >
                        Ctrl+S
                    </kbd>
                </div>
                <Button
                    variant="primaryContained"
                    label="Save Changes"
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
