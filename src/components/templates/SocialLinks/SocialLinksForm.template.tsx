import React from 'react';
import Button from '../../atoms/Button/Button';
import TextField from '../../atoms/TextField/TextField';
import CustomRadioGroup from '../../molecules/CustomRadioGroup/CustomRadioGroup';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { Status, useColors } from '../../../utils/types';
import { makeRoute } from '../../../utils/helper';
import { type SocialLink, type SocialLinkResponse } from '../../../services/useSocialLinkService';
import AutoCompleteInput from '../../atoms/AutoCompleteInput/AutoCompleteInput';
import { SocialLinkPlatformOptions } from '../../../utils/constant';
import FormShell from '../Shared/FormShell.template';

interface SocialLinksFormTemplateProps {
    onSubmit: (values: SocialLink) => void;
    mode: string;
    socialLink?: SocialLinkResponse | null;
}

const validationSchema = Yup.object({
    platform: Yup.string().required('Platform is required'),
    url: Yup.string().url('Must be a valid URL').required('URL is required'),
    order: Yup.string().required('Order is required'),
    status: Yup.string().required('Status is required'),
});

const SocialLinksFormTemplate: React.FC<SocialLinksFormTemplateProps> = ({
    onSubmit,
    mode,
    socialLink,
}) => {
    const navigate = useNavigate();
    const colors = useColors();

    const formik = useFormik<SocialLink>({
        initialValues: {
            platform: socialLink?.platform || '',
            url: socialLink?.url || '',
            order: socialLink?.order || '',
            status: socialLink?.status || Status.ACTIVE,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit,
    });

    const cardStyle: React.CSSProperties = { background: colors.neutral0, border: `1.5px solid ${colors.neutral300}` };
    const sectionTitleStyle: React.CSSProperties = { color: colors.neutral800 };

    return (
        <FormShell
            title={mode === MODE.ADD ? 'Add Social Link' : mode === MODE.EDIT ? 'Edit Social Link' : 'Social Link Details'}
            subtitle={mode === MODE.VIEW ? 'View social link details' : 'Configure your public profile connection'}
            breadcrumb="Social Links"
            onBack={() => navigate(makeRoute(ADMIN_ROUTES.SOCIAL_LINKS, {}))}
        >
            <div className="px-3 py-4 sm:p-6 space-y-6 sm:space-y-8">
                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.primary500 }} />
                        Social Link Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AutoCompleteInput
                            label="Platform"
                            placeHolder="Search and select a platform (e.g., LinkedIn, GitHub)"
                            options={SocialLinkPlatformOptions}
                            value={SocialLinkPlatformOptions.find(option => option.value === formik.values.platform) || null}
                            onSearch={() => { }}
                            onChange={value => { formik.setFieldValue("platform", value?.value ?? null); }}
                            required
                            error={formik.touched.platform && Boolean(formik.errors.platform)}
                            helperText={formik.touched.platform && formik.errors.platform ? String(formik.errors.platform) : ""}
                            isDisabled={mode !== MODE.ADD}
                        />
                        <TextField
                            label="URL"
                            placeholder="https://example.com"
                            fullWidth
                            {...formik.getFieldProps('url')}
                            disabled={mode === MODE.VIEW}
                            required
                            error={formik.touched.url && Boolean(formik.errors.url)}
                            helperText={formik.touched.url && formik.errors.url ? String(formik.errors.url) : ""}
                        />
                        <TextField
                            label="Display Order"
                            placeholder="e.g. 1, 2, 3"
                            type="text"
                            fullWidth
                            {...formik.getFieldProps('order')}
                            disabled={mode === MODE.VIEW}
                            required
                            error={formik.touched.order && Boolean(formik.errors.order)}
                            helperText={formik.touched.order && formik.errors.order ? String(formik.errors.order) : ""}
                        />
                    </div>
                </div>
                <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm" style={cardStyle}>
                    <h3 className="text-lg font-semibold flex items-center mb-4" style={sectionTitleStyle}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.success500 }} />
                        Social Link Status
                    </h3>
                    <CustomRadioGroup
                        name="status"
                        label=""
                        options={Object.values(Status).map((status) => ({ value: status, label: status }))}
                        value={formik.values.status || ''}
                        onChange={formik.handleChange}
                        disabled={mode === MODE.VIEW}
                    />
                </div>
                <div className="flex justify-between gap-3">
                    <Button label="Cancel" variant="tertiaryContained" onClick={() => navigate(makeRoute(ADMIN_ROUTES.SOCIAL_LINKS, {}))} />
                    {mode !== MODE.VIEW && (
                        <Button
                            label={mode === MODE.ADD ? 'Add' : 'Update'}
                            variant="primaryContained"
                            onClick={() => formik.handleSubmit()}
                            disabled={formik.isSubmitting}
                        />
                    )}
                </div>
            </div>
        </FormShell>
    );
};

export default SocialLinksFormTemplate;
