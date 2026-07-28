import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HTTP_STATUS } from '../../../utils/types';
import { useSnackbar } from '../../../hooks/useSnackBar';
import { useTestimonialLinkService, type TestimonialLink, type CreateTestimonialLinkRequest } from '../../../services/useTestimonialLinkService';
import TestimonialLinkTableTemplate from '../../templates/TestimonialRequests/TestimonialLinkTable.template';
import GenerateTestimonialLinkModal from '../../templates/TestimonialRequests/GenerateTestimonialLinkModal.template';
import { DeleteConfirmation } from '../../molecules/DeleteConfirmation/DeleteConfirmation';

const DEFAULT_FORM: CreateTestimonialLinkRequest = {
    requesterName: '',
    requesterEmail: '',
    expiryDays: 30,
};

const ListingTestimonialLinksPage: React.FC = () => {
    const { showSnackbar } = useSnackbar();
    const service = useTestimonialLinkService();

    const [showModal, setShowModal] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [form, setForm] = useState<CreateTestimonialLinkRequest>(DEFAULT_FORM);
    const [linkPendingRevoke, setLinkPendingRevoke] = useState<TestimonialLink | null>(null);
    const [revoking, setRevoking] = useState(false);

    const { data: pageResponse, refetch } = useQuery({
        queryKey: ['testimonialLinks'],
        queryFn: () => service.getLinks(),
        refetchOnMount: 'always',
    });

    const links: TestimonialLink[] = pageResponse?.data?.data ?? [];

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const res = await service.createLink(form);
            if (res?.status === HTTP_STATUS.OK || res?.status === 201) {
                const created: TestimonialLink = res.data?.data;
                setGeneratedUrl(created.shareUrl);
                refetch();
                showSnackbar('success', 'Testimonial request link generated');
            } else {
                showSnackbar('error', 'Failed to generate link');
            }
        } catch {
            showSnackbar('error', 'Failed to generate link');
        } finally {
            setGenerating(false);
        }
    };

    const handleCopyGenerated = () => {
        if (!generatedUrl) return;
        navigator.clipboard.writeText(generatedUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    };

    const handleRevoke = async () => {
        if (!linkPendingRevoke) return;
        setRevoking(true);
        try {
            await service.revokeLink(linkPendingRevoke.id);
            refetch();
            showSnackbar('success', 'Link revoked');
        } catch {
            showSnackbar('error', 'Failed to revoke link');
        } finally {
            setRevoking(false);
            setLinkPendingRevoke(null);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setGeneratedUrl(null);
        setForm(DEFAULT_FORM);
        setCopied(false);
    };

    return (
        <>
            <TestimonialLinkTableTemplate
                links={links}
                onGenerateClick={() => setShowModal(true)}
                onRevoke={setLinkPendingRevoke}
            />

            <GenerateTestimonialLinkModal
                open={showModal}
                form={form}
                onFormChange={setForm}
                generating={generating}
                generatedUrl={generatedUrl}
                copied={copied}
                onCopy={handleCopyGenerated}
                onGenerate={handleGenerate}
                onClose={closeModal}
            />

            <DeleteConfirmation
                open={!!linkPendingRevoke}
                title="Revoke this link?"
                description={`It will no longer be accessible${linkPendingRevoke?.requesterName ? ` to ${linkPendingRevoke.requesterName}` : ''}.`}
                onDelete={handleRevoke}
                onCancel={() => setLinkPendingRevoke(null)}
                deleteButtonText={revoking ? 'Revoking...' : 'Revoke'}
            />
        </>
    );
};

export default ListingTestimonialLinksPage;
