import React, { useEffect, useState } from 'react';
import { useColors } from '../../../utils/types';
import { useSnackbar } from '../../../hooks/useSnackBar';
import { useTestimonialLinkService, type TestimonialLink, type CreateTestimonialLinkRequest } from '../../../services/useTestimonialLinkService';
import { HTTP_STATUS } from '../../../utils/types';

const ListingTestimonialLinksPage: React.FC = () => {
    const colors = useColors();
    const { showSnackbar } = useSnackbar();
    const service = useTestimonialLinkService();

    const [links, setLinks] = useState<TestimonialLink[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [newLinkUrl, setNewLinkUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [form, setForm] = useState<CreateTestimonialLinkRequest>({
        requesterName: '',
        requesterEmail: '',
        expiryDays: 30,
    });

    const loadLinks = async () => {
        try {
            const res = await service.getLinks();
            if (res?.status === HTTP_STATUS.OK) {
                setLinks(res.data?.data ?? []);
            }
        } catch {
            showSnackbar('error', 'Failed to load testimonial links');
        }
    };

    useEffect(() => {
        loadLinks();
    }, []);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const res = await service.createLink(form);
            if (res?.status === HTTP_STATUS.OK || res?.status === 201) {
                const created: TestimonialLink = res.data?.data;
                setNewLinkUrl(created.shareUrl);
                setLinks(prev => [created, ...prev]);
                showSnackbar('success', 'Testimonial request link generated');
            }
        } catch {
            showSnackbar('error', 'Failed to generate link');
        } finally {
            setGenerating(false);
        }
    };

    const handleRevoke = async (id: number) => {
        if (!window.confirm('Revoke this link? It will no longer be accessible.')) return;
        try {
            await service.revokeLink(id);
            setLinks(prev => prev.filter(l => l.id !== id));
            showSnackbar('success', 'Link revoked');
        } catch {
            showSnackbar('error', 'Failed to revoke link');
        }
    };

    const handleCopy = (url: string) => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const getLinkStatus = (link: TestimonialLink): { label: string; color: string; bg: string } => {
        if (link.usedAt) return { label: 'Used', color: colors.neutral600, bg: colors.neutral100 };
        if (new Date(link.expiresAt) < new Date()) return { label: 'Expired', color: colors.error600, bg: colors.error50 };
        return { label: 'Active', color: colors.success700, bg: colors.success50 };
    };

    const closeModal = () => {
        setShowModal(false);
        setNewLinkUrl(null);
        setForm({ requesterName: '', requesterEmail: '', expiryDays: 30 });
        setCopied(false);
    };

    return (
        <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: colors.neutral900, margin: 0 }}>
                    Testimonial Request Links
                </h1>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        padding: '8px 18px',
                        background: colors.primary600,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: 'pointer',
                    }}
                >
                    + Generate Link
                </button>
            </div>

            {/* Link cards */}
            {links.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '48px',
                    color: colors.neutral400,
                    border: `1px dashed ${colors.neutral200}`,
                    borderRadius: '12px',
                }}>
                    No testimonial request links yet. Generate one to get started.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {links.map(link => {
                        const status = getLinkStatus(link);
                        return (
                            <div
                                key={link.id}
                                style={{
                                    border: `1px solid ${colors.neutral200}`,
                                    borderRadius: '10px',
                                    padding: '16px 20px',
                                    background: colors.neutral0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '12px',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 600, fontSize: '14px', color: colors.neutral800 }}>
                                            {link.requesterName || 'Anyone'}
                                        </span>
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            padding: '2px 8px',
                                            borderRadius: '20px',
                                            color: status.color,
                                            background: status.bg,
                                        }}>
                                            {status.label}
                                        </span>
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: colors.primary600,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '480px',
                                    }}>
                                        {link.shareUrl}
                                    </div>
                                    <div style={{ fontSize: '11px', color: colors.neutral400, marginTop: '4px' }}>
                                        Expires: {new Date(link.expiresAt).toLocaleDateString()}
                                        {link.usedAt && ` · Used: ${new Date(link.usedAt).toLocaleDateString()}`}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                    <button
                                        onClick={() => handleCopy(link.shareUrl)}
                                        style={{
                                            padding: '6px 14px',
                                            fontSize: '12px',
                                            border: `1px solid ${colors.neutral200}`,
                                            borderRadius: '6px',
                                            background: colors.neutral50,
                                            color: colors.neutral700,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Copy
                                    </button>
                                    <button
                                        onClick={() => handleRevoke(link.id)}
                                        style={{
                                            padding: '6px 14px',
                                            fontSize: '12px',
                                            border: `1px solid ${colors.error200}`,
                                            borderRadius: '6px',
                                            background: colors.error50,
                                            color: colors.error600,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Revoke
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.45)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        background: colors.neutral0,
                        borderRadius: '14px',
                        padding: '28px',
                        width: '100%',
                        maxWidth: '480px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
                    }}>
                        <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 700, color: colors.neutral900 }}>
                            Generate Testimonial Link
                        </h2>

                        {!newLinkUrl ? (
                            <>
                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ fontSize: '13px', color: colors.neutral600, display: 'block', marginBottom: '6px' }}>
                                        Recipient Name (optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={form.requesterName ?? ''}
                                        onChange={e => setForm(f => ({ ...f, requesterName: e.target.value }))}
                                        placeholder="e.g. Jane Smith"
                                        style={{
                                            width: '100%', padding: '9px 12px', fontSize: '14px',
                                            border: `1px solid ${colors.neutral200}`, borderRadius: '7px',
                                            background: colors.neutral50, color: colors.neutral800,
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ fontSize: '13px', color: colors.neutral600, display: 'block', marginBottom: '6px' }}>
                                        Recipient Email (optional)
                                    </label>
                                    <input
                                        type="email"
                                        value={form.requesterEmail ?? ''}
                                        onChange={e => setForm(f => ({ ...f, requesterEmail: e.target.value }))}
                                        placeholder="e.g. jane@company.com"
                                        style={{
                                            width: '100%', padding: '9px 12px', fontSize: '14px',
                                            border: `1px solid ${colors.neutral200}`, borderRadius: '7px',
                                            background: colors.neutral50, color: colors.neutral800,
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: '22px' }}>
                                    <label style={{ fontSize: '13px', color: colors.neutral600, display: 'block', marginBottom: '6px' }}>
                                        Expiry (days)
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={365}
                                        value={form.expiryDays ?? 30}
                                        onChange={e => setForm(f => ({ ...f, expiryDays: Number(e.target.value) }))}
                                        style={{
                                            width: '100%', padding: '9px 12px', fontSize: '14px',
                                            border: `1px solid ${colors.neutral200}`, borderRadius: '7px',
                                            background: colors.neutral50, color: colors.neutral800,
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={closeModal}
                                        style={{
                                            padding: '8px 18px', fontSize: '14px',
                                            border: `1px solid ${colors.neutral200}`, borderRadius: '7px',
                                            background: 'transparent', color: colors.neutral600, cursor: 'pointer',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleGenerate}
                                        disabled={generating}
                                        style={{
                                            padding: '8px 18px', fontSize: '14px', fontWeight: 600,
                                            border: 'none', borderRadius: '7px',
                                            background: colors.primary600, color: '#fff',
                                            cursor: generating ? 'not-allowed' : 'pointer',
                                            opacity: generating ? 0.7 : 1,
                                        }}
                                    >
                                        {generating ? 'Generating...' : 'Generate'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p style={{ fontSize: '14px', color: colors.neutral600, marginBottom: '12px' }}>
                                    Share this link with your contact. It can be used once.
                                </p>
                                <div style={{
                                    display: 'flex', gap: '8px', alignItems: 'center',
                                    border: `1px solid ${colors.neutral200}`, borderRadius: '8px',
                                    padding: '10px 12px', background: colors.neutral50,
                                    marginBottom: '20px',
                                }}>
                                    <span style={{
                                        flex: 1, fontSize: '12px', color: colors.primary700,
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    }}>
                                        {newLinkUrl}
                                    </span>
                                    <button
                                        onClick={() => handleCopy(newLinkUrl)}
                                        style={{
                                            padding: '5px 12px', fontSize: '12px', fontWeight: 600,
                                            border: 'none', borderRadius: '5px', flexShrink: 0,
                                            background: copied ? colors.success600 : colors.primary600,
                                            color: '#fff', cursor: 'pointer',
                                        }}
                                    >
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={closeModal}
                                        style={{
                                            padding: '8px 18px', fontSize: '14px', fontWeight: 600,
                                            border: 'none', borderRadius: '7px',
                                            background: colors.primary600, color: '#fff', cursor: 'pointer',
                                        }}
                                    >
                                        Done
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListingTestimonialLinksPage;
