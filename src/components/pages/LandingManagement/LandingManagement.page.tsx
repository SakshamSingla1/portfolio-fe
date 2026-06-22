import { useState, useEffect, useCallback } from 'react';
import { CircularProgress } from '@mui/material';
import {
    LuLayoutDashboard, LuZap, LuMessageSquare, LuLayers, LuGlobe, LuStar, LuImage,
} from 'react-icons/lu';
import BannerTab from '../../templates/Settings/BannerTab';
import { useSnackbar } from '../../../hooks/useSnackBar';
import useLandingPageService from '../../../services/useLandingPageService';
import type {
    LandingConfig, LandingFeature, LandingFaq,
    LandingStep, LandingAudienceCard, LandingTestimonial,
} from '../../../services/useLandingPageService';
import { HTTP_STATUS } from '../../../utils/types';
import FormShell from '../../templates/Shared/FormShell.template';
import Tabs from '../../atoms/Tabs/Tabs';
import type { ITabsSchema } from '../../atoms/Tabs/Tabs';
import DeleteConfirmPopup from '../../organisms/DeleteConfirmPopup/DeleteConfirmPopup';
import LandingConfigFormTemplate from '../../templates/Landing/LandingConfigForm.template';
import LandingFeaturesTableTemplate from '../../templates/Landing/LandingFeaturesTable.template';
import LandingFaqsTableTemplate from '../../templates/Landing/LandingFaqsTable.template';
import LandingStepsTableTemplate from '../../templates/Landing/LandingStepsTable.template';
import LandingAudienceTableTemplate from '../../templates/Landing/LandingAudienceTable.template';
import LandingTestimonialsTableTemplate from '../../templates/Landing/LandingTestimonialsTable.template';
import LandingItemModalTemplate from '../../templates/Landing/LandingItemModal.template';

// ── Empty factories ─────────────────────────────────────────────────────────────

const emptyConfig = (): LandingConfig => ({
    heroEyebrow: '', heroHeadline1: '', heroHeadline2: '', heroDescription: '',
    heroPrimaryCtaText: '', heroSecondaryCtaText: '', heroTrustBadges: [],
    ctaBadgeText: '', ctaHeadline: '', ctaDescription: '', ctaButtonText: '', ctaTrustPoints: [],
});
const emptyFeature     = (): LandingFeature      => ({ iconName: '', colorKey: '', title: '', description: '', sortOrder: 0, isActive: true });
const emptyFaq         = (): LandingFaq          => ({ question: '', answer: '', sortOrder: 0, isActive: true });
const emptyStep        = (): LandingStep         => ({ stepNumber: '', iconName: '', colorKey: '', title: '', bullets: [], sortOrder: 0, isActive: true });
const emptyAudience    = (): LandingAudienceCard => ({ iconName: '', colorKey: '', title: '', description: '', sortOrder: 0, isActive: true });
const emptyTestimonial = (): LandingTestimonial  => ({ authorName: '', authorRole: '', authorCompany: '', avatarUrl: '', content: '', linkedinUrl: '', sortOrder: 0, isActive: true });

// ── Component ───────────────────────────────────────────────────────────────────

const LandingManagement = () => {
    const service = useLandingPageService();
    const { showSnackbar } = useSnackbar();

    const [activeTab, setActiveTab] = useState('config');
    const [loading, setLoading] = useState(false);

    const [config, setConfig]         = useState<LandingConfig>(emptyConfig());
    const [configSaving, setConfigSaving] = useState(false);

    const [features, setFeatures]         = useState<LandingFeature[]>([]);
    const [faqs, setFaqs]                 = useState<LandingFaq[]>([]);
    const [steps, setSteps]               = useState<LandingStep[]>([]);
    const [audience, setAudience]         = useState<LandingAudienceCard[]>([]);
    const [testimonials, setTestimonials] = useState<LandingTestimonial[]>([]);

    const [modal, setModal]     = useState<{ open: boolean; type: string; data: any }>({ open: false, type: '', data: null });
    const [formData, setFormData] = useState<any>({});
    const [saving, setSaving]   = useState(false);

    const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: number } | null>(null);
    const [deleting, setDeleting]         = useState(false);

    // ── Data loading ──────────────────────────────────────────────────────────

    const loadAll = useCallback(async () => {
        setLoading(true);
        const [cfgRes, ftRes, faqRes, stRes, audRes, testRes] = await Promise.all([
            service.getConfig(),
            service.getFeatures(),
            service.getFaqs(),
            service.getSteps(),
            service.getAudienceCards(),
            service.getTestimonials(),
        ]);
        if (cfgRes?.status === HTTP_STATUS.OK && cfgRes.data?.data) {
            const raw = cfgRes.data.data;
            setConfig({ ...emptyConfig(), ...raw, heroTrustBadges: raw.heroTrustBadges ?? [], ctaTrustPoints: raw.ctaTrustPoints ?? [] });
        }
        if (ftRes?.status === HTTP_STATUS.OK)   setFeatures(ftRes.data?.data ?? []);
        if (faqRes?.status === HTTP_STATUS.OK)  setFaqs(faqRes.data?.data ?? []);
        if (stRes?.status === HTTP_STATUS.OK)   setSteps(stRes.data?.data ?? []);
        if (audRes?.status === HTTP_STATUS.OK)  setAudience(audRes.data?.data ?? []);
        if (testRes?.status === HTTP_STATUS.OK) setTestimonials(testRes.data?.data ?? []);
        setLoading(false);
    }, []);

    useEffect(() => { loadAll(); }, []);

    // ── Config ────────────────────────────────────────────────────────────────

    const saveConfig = async () => {
        setConfigSaving(true);
        const res = await service.updateConfig(config);
        if (res?.status === HTTP_STATUS.OK) {
            showSnackbar('success', 'Config saved');
            const saved = res.data.data;
            setConfig({ ...emptyConfig(), ...saved, heroTrustBadges: saved.heroTrustBadges ?? [], ctaTrustPoints: saved.ctaTrustPoints ?? [] });
        } else {
            showSnackbar('error', res?.data?.message ?? 'Failed to save config');
        }
        setConfigSaving(false);
    };

    // ── Modal ─────────────────────────────────────────────────────────────────

    const openModal = (type: string, data: any) => {
        setModal({ open: true, type, data });
        setFormData({ ...data });
    };
    const closeModal = () => setModal({ open: false, type: '', data: null });

    const handleFieldChange = (key: string, value: any) => {
        setFormData((p: any) => ({ ...p, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        const { type, data } = modal;
        const isEdit = !!data?.id;
        let res: any;
        if (type === 'feature')          res = isEdit ? await service.updateFeature(data.id, formData)     : await service.createFeature(formData);
        else if (type === 'faq')         res = isEdit ? await service.updateFaq(data.id, formData)          : await service.createFaq(formData);
        else if (type === 'step')        res = isEdit ? await service.updateStep(data.id, formData)         : await service.createStep(formData);
        else if (type === 'audience')    res = isEdit ? await service.updateAudienceCard(data.id, formData) : await service.createAudienceCard(formData);
        else if (type === 'testimonial') res = isEdit ? await service.updateTestimonial(data.id, formData)  : await service.createTestimonial(formData);

        if (res?.status === HTTP_STATUS.OK || res?.status === 201) {
            showSnackbar('success', isEdit ? 'Updated successfully' : 'Created successfully');
            closeModal();
            loadAll();
        } else {
            showSnackbar('error', res?.data?.message ?? 'Operation failed');
        }
        setSaving(false);
    };

    // ── Delete ────────────────────────────────────────────────────────────────

    const confirmDelete = (type: string, id: number) => setDeleteTarget({ type, id });

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        const { type, id } = deleteTarget;
        let res: any;
        if (type === 'feature')          res = await service.deleteFeature(id);
        else if (type === 'faq')         res = await service.deleteFaq(id);
        else if (type === 'step')        res = await service.deleteStep(id);
        else if (type === 'audience')    res = await service.deleteAudienceCard(id);
        else if (type === 'testimonial') res = await service.deleteTestimonial(id);

        if (res?.status === HTTP_STATUS.OK || res?.status === 204) {
            showSnackbar('success', 'Deleted');
            loadAll();
        } else {
            showSnackbar('error', 'Delete failed');
        }
        setDeleting(false);
        setDeleteTarget(null);
    };

    // ── Tab schema ────────────────────────────────────────────────────────────

    const tabSchema: ITabsSchema[] = [
        {
            label: 'Config',
            value: 'config',
            icon: <LuLayoutDashboard size={14} />,
            component: (
                <LandingConfigFormTemplate
                    config={config}
                    saving={configSaving}
                    onChange={updates => setConfig(p => ({ ...p, ...updates }))}
                    onSave={saveConfig}
                />
            ),
        },
        {
            label: 'Features',
            value: 'features',
            icon: <LuZap size={14} />,
            component: (
                <LandingFeaturesTableTemplate
                    features={features}
                    onAdd={() => openModal('feature', emptyFeature())}
                    onEdit={item => openModal('feature', item)}
                    onDelete={id => confirmDelete('feature', id)}
                />
            ),
        },
        {
            label: 'FAQs',
            value: 'faqs',
            icon: <LuMessageSquare size={14} />,
            component: (
                <LandingFaqsTableTemplate
                    faqs={faqs}
                    onAdd={() => openModal('faq', emptyFaq())}
                    onEdit={item => openModal('faq', item)}
                    onDelete={id => confirmDelete('faq', id)}
                />
            ),
        },
        {
            label: 'How To Use',
            value: 'steps',
            icon: <LuLayers size={14} />,
            component: (
                <LandingStepsTableTemplate
                    steps={steps}
                    onAdd={() => openModal('step', emptyStep())}
                    onEdit={item => openModal('step', item)}
                    onDelete={id => confirmDelete('step', id)}
                />
            ),
        },
        {
            label: 'Audience',
            value: 'audience',
            icon: <LuGlobe size={14} />,
            component: (
                <LandingAudienceTableTemplate
                    audience={audience}
                    onAdd={() => openModal('audience', emptyAudience())}
                    onEdit={item => openModal('audience', item)}
                    onDelete={id => confirmDelete('audience', id)}
                />
            ),
        },
        {
            label: 'Testimonials',
            value: 'testimonials',
            icon: <LuStar size={14} />,
            component: (
                <LandingTestimonialsTableTemplate
                    testimonials={testimonials}
                    onAdd={() => openModal('testimonial', emptyTestimonial())}
                    onEdit={item => openModal('testimonial', item)}
                    onDelete={id => confirmDelete('testimonial', id)}
                />
            ),
        },
        {
            label: 'Dashboard Banner',
            value: 'banner',
            icon: <LuImage size={14} />,
            component: <BannerTab />,
        },
    ];

    if (loading) return (
        <div className="flex justify-center items-center mt-20">
            <CircularProgress />
        </div>
    );

    return (
        <FormShell
            title="Landing Page Management"
            subtitle="Manage hero content, features, FAQs, steps, audience cards, and testimonials"
        >
            <div className="p-6">
                <Tabs schema={tabSchema} value={activeTab} setValue={setActiveTab} fullWidth />
            </div>

            <LandingItemModalTemplate
                open={modal.open}
                type={modal.type}
                isEdit={!!modal.data?.id}
                formData={formData}
                saving={saving}
                onFieldChange={handleFieldChange}
                onSave={handleSave}
                onClose={closeModal}
            />

            <DeleteConfirmPopup
                isOpen={!!deleteTarget}
                title={`Delete this ${deleteTarget?.type ?? 'item'}?`}
                onDelete={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                loading={deleting}
            />
        </FormShell>
    );
};

export default LandingManagement;
