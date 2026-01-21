import React, { useEffect } from 'react';
import Button from '../../atoms/Button/Button';
import TextField from '../../atoms/TextField/TextField';
import CustomRadioGroup from '../../molecules/CustomRadioGroup/CustomRadioGroup';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { Status } from '../../../utils/types';
import { makeRoute } from '../../../utils/helper';
import { type SocialLink, type SocialLinkResponse } from '../../../services/useSocialLinkService';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import AutoCompleteInput from '../../atoms/AutoCompleteInput/AutoCompleteInput';
import { SocialLinkPlatformOptions } from '../../../utils/constant';

interface SocialLinksFormTemplateProps {
    onSubmit: (values: SocialLink) => void;
    mode: string;
    socialLink?: SocialLinkResponse | null;
}

const validationSchema = Yup.object({
    platform: Yup.string().required('Platform is required'),
    url: Yup.string().required('URL is required'),
    order: Yup.string().required('Order is required'),
    status: Yup.string().required('Status is required'),
});

const SocialLinksFormTemplate: React.FC<SocialLinksFormTemplateProps> = ({
    onSubmit,
    mode,
    socialLink,
}) => {
    const navigate = useNavigate();
    const { user } = useAuthenticatedUser();

    const formik = useFormik<SocialLink>({
        initialValues: {
            profileId: user?.id || '',
            platform: socialLink?.platform || '',
            url: socialLink?.url || '',
            order: socialLink?.order || '',
            status: socialLink?.status || Status.ACTIVE,
        },
        validationSchema,
        onSubmit,
    });

    useEffect(() => {
        if (socialLink) {
            formik.setValues({
                profileId: user?.id || '',
                platform: socialLink.platform || '',
                url: socialLink.url || '',
                order: socialLink.order || '',
                status: socialLink.status || Status.ACTIVE,
            });
        }
    }, [socialLink]);

    useEffect(() => {
        console.log(formik);
    }, [formik]);

    return (
        <div className="mb-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {mode === MODE.ADD ? 'Add Social Link' : mode === MODE.EDIT ? 'Edit Social Link' : 'Social Link Details'}
                </h2>
                <p className="text-gray-600">
                    {mode === MODE.VIEW ? 'View social link details' : 'Configure social link settings'}
                </p>
            </div>
            <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                        Social Link Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AutoCompleteInput
                            label="Platform"
                            placeHolder="Search and select a platform (e.g., LinkedIn, GitHub)"
                            options={SocialLinkPlatformOptions}
                            value={SocialLinkPlatformOptions.find(option => option.value === formik.values.platform) || null}
                            onSearch={() => { }}
                            onChange={value => {
                                formik.setFieldValue("platform", value?.value ?? null);
                            }}
                            error={formik.touched.platform && Boolean(formik.errors.platform)}
                            helperText={formik.touched.platform && formik.errors.platform ? String(formik.errors.platform) : ""}
                            isDisabled={mode !== MODE.ADD}
                        />
                        <TextField
                            label="Url"
                            placeholder="https://example.com"
                            fullWidth
                            {...formik.getFieldProps('url')}
                            disabled={mode === MODE.VIEW}
                            error={formik.touched.url && Boolean(formik.errors.url)}
                            helperText={formik.touched.url && formik.errors.url ? String(formik.errors.url) : ""}
                        />
                        <TextField
                            label="Index"
                            placeholder="Order"
                            type="text"
                            fullWidth
                            {...formik.getFieldProps('order')}
                            disabled={mode === MODE.VIEW}
                            error={formik.touched.order && Boolean(formik.errors.order)}
                            helperText={formik.touched.order && formik.errors.order ? String(formik.errors.order) : ""}
                        />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                        Social Link Status
                    </h3>
                    <CustomRadioGroup
                        name="status"
                        label=""
                        options={Object.values(Status).map((status) => ({
                            value: status,
                            label: status,
                        }))}
                        value={formik.values.status || ''}
                        onChange={formik.handleChange}
                        disabled={mode === MODE.VIEW}
                    />
                </div>
                <div className="flex justify-between gap-3 pt-4">
                    <Button
                        label="Cancel"
                        variant="tertiaryContained"
                        onClick={() =>
                            navigate(makeRoute(ADMIN_ROUTES.SOCIAL_LINKS, {}))
                        }
                    />
                    {mode !== MODE.VIEW && (
                        <Button
                            label={mode === MODE.ADD ? 'Add' : 'Update'}
                            variant="primaryContained"
                            onClick={() => formik.handleSubmit()}
                            disabled={formik.isSubmitting || !formik.isValid}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SocialLinksFormTemplate;
