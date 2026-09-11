import React, { useEffect, useState } from 'react';
import { useNavlinkService, type NavlinkResponse } from '../../../services/useNavlinkService';
import {
    type SubscriptionPlanResponseDTO,
    type SubscriptionPlanRequestDTO,
} from '../../../services/useSubscriptionPlanService';
import TextField from '../../atoms/TextField/TextField';
import Button from '../../atoms/Button/Button';
import AdvancedCheckbox from '../../atoms/AdvancedCheckbox/AdvancedCheckbox';
import { useFormik } from 'formik';
import CustomRadioGroup from '../../molecules/CustomRadioGroup/CustomRadioGroup';
import { HTTP_STATUS, Status, useColors } from '../../../utils/types';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { enumToNormalKey, makeRoute } from '../../../utils/helper';
import FormShell from '../Shared/FormShell.template';
import { useSnackbar } from '../../../hooks/useSnackBar';

interface SubscriptionPlanFormTemplateProps {
    planDetails?: SubscriptionPlanResponseDTO | null;
    mode: string;
    onSubmit: (values: SubscriptionPlanRequestDTO, navLinkIds: number[]) => void;
}

const validationSchema = Yup.object({
    name: Yup.string().required('Plan name is required'),
    code: Yup.string().required('Plan code is required'),
    priceMonthly: Yup.number().min(0, 'Must be 0 or more').required('Monthly price is required'),
    priceYearly: Yup.number().min(0, 'Must be 0 or more').required('Yearly price is required'),
    currency: Yup.string().required('Currency is required'),
    sortOrder: Yup.number().required('Sort order is required'),
    status: Yup.string().required('Status is required'),
});

const SubscriptionPlanFormTemplate: React.FC<SubscriptionPlanFormTemplateProps> = ({ planDetails, mode, onSubmit }) => {
    const navigate = useNavigate();
    const navLinkService = useNavlinkService();
    const colors = useColors();
    const { showSnackbar } = useSnackbar();

    const [navlinks, setNavlinks] = useState<NavlinkResponse[]>([]);
    const [selectedNavLinkIds, setSelectedNavLinkIds] = useState<number[]>(
        planDetails?.includedNavLinks?.map((n) => n.navLinkId) ?? []
    );

    useEffect(() => {
        setSelectedNavLinkIds(planDetails?.includedNavLinks?.map((n) => n.navLinkId) ?? []);
    }, [planDetails]);

    const formik = useFormik<SubscriptionPlanRequestDTO>({
        initialValues: {
            name: planDetails?.name || '',
            code: planDetails?.code || '',
            description: planDetails?.description || '',
            priceMonthly: planDetails?.priceMonthly ?? 0,
            priceYearly: planDetails?.priceYearly ?? 0,
            currency: planDetails?.currency || 'USD',
            isDefault: planDetails?.isDefault ?? false,
            sortOrder: planDetails?.sortOrder ?? 0,
            status: planDetails?.status || Status.ACTIVE,
        },
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values, selectedNavLinkIds);
        },
        enableReinitialize: true,
    });

    useEffect(() => {
        const loadNavlinks = async () => {
            try {
                const response = await navLinkService.getAllNavlinks({
                    page: '0',
                    size: '1000',
                    sortDir: 'ASC',
                    sortBy: 'name',
                });
                if (response.status === HTTP_STATUS.OK) {
                    setNavlinks(response.data.data.content);
                }
            } catch {
                showSnackbar('error', 'Failed to load navlinks');
            }
        };
        loadNavlinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleNavLink = (navLinkId: number) => {
        setSelectedNavLinkIds((prev) =>
            prev.includes(navLinkId) ? prev.filter((id) => id !== navLinkId) : [...prev, navLinkId]
        );
    };

    const title =
        mode === MODE.ADD ? 'Add Subscription Plan' : mode === MODE.EDIT ? 'Edit Subscription Plan' : 'Subscription Plan Details';
    const subtitle =
        mode === MODE.VIEW ? 'View plan pricing and included modules' : 'Configure pricing and which modules this plan includes';

    return (
        <FormShell title={title} subtitle={subtitle} breadcrumb="Subscription Plans" onBack={() => navigate(-1)}>
            <div className="px-3 py-4 sm:p-6">
                <div className="space-y-6 sm:space-y-8">
                    <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm border" style={{ backgroundColor: colors.neutral50, borderColor: colors.neutral300 }}>
                        <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: colors.neutral900 }}>
                            <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.primary500 }} />
                            Plan Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextField
                                label="Plan Name"
                                placeholder="e.g. Pro"
                                fullWidth
                                {...formik.getFieldProps('name')}
                                disabled={mode === MODE.VIEW}
                                required
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
                            />
                            <TextField
                                label="Plan Code"
                                placeholder="e.g. PRO"
                                fullWidth
                                {...formik.getFieldProps('code')}
                                disabled={mode === MODE.VIEW || mode === MODE.EDIT}
                                required
                                error={formik.touched.code && Boolean(formik.errors.code)}
                                helperText={formik.touched.code && formik.errors.code ? formik.errors.code : ''}
                            />
                            <TextField
                                label="Description"
                                placeholder="Enter plan description"
                                fullWidth
                                {...formik.getFieldProps('description')}
                                disabled={mode === MODE.VIEW}
                            />
                            <TextField
                                label="Sort Order"
                                type="number"
                                fullWidth
                                {...formik.getFieldProps('sortOrder')}
                                disabled={mode === MODE.VIEW}
                                required
                                error={formik.touched.sortOrder && Boolean(formik.errors.sortOrder)}
                                helperText={formik.touched.sortOrder && formik.errors.sortOrder ? formik.errors.sortOrder : ''}
                            />
                        </div>
                    </div>

                    <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm border" style={{ backgroundColor: colors.neutral50, borderColor: colors.neutral300 }}>
                        <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: colors.neutral900 }}>
                            <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.success500 }} />
                            Pricing
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <TextField
                                label="Monthly Price"
                                type="number"
                                fullWidth
                                {...formik.getFieldProps('priceMonthly')}
                                disabled={mode === MODE.VIEW}
                                required
                                error={formik.touched.priceMonthly && Boolean(formik.errors.priceMonthly)}
                                helperText={formik.touched.priceMonthly && formik.errors.priceMonthly ? formik.errors.priceMonthly : ''}
                            />
                            <TextField
                                label="Yearly Price"
                                type="number"
                                fullWidth
                                {...formik.getFieldProps('priceYearly')}
                                disabled={mode === MODE.VIEW}
                                required
                                error={formik.touched.priceYearly && Boolean(formik.errors.priceYearly)}
                                helperText={formik.touched.priceYearly && formik.errors.priceYearly ? formik.errors.priceYearly : ''}
                            />
                            <TextField
                                label="Currency"
                                placeholder="USD"
                                fullWidth
                                {...formik.getFieldProps('currency')}
                                disabled={mode === MODE.VIEW}
                                required
                                error={formik.touched.currency && Boolean(formik.errors.currency)}
                                helperText={formik.touched.currency && formik.errors.currency ? formik.errors.currency : ''}
                            />
                        </div>
                        <div className="mt-4">
                            <label className="flex items-center gap-2 cursor-pointer w-fit">
                                <AdvancedCheckbox
                                    name="isDefault"
                                    checked={formik.values.isDefault}
                                    onChange={() => formik.setFieldValue('isDefault', !formik.values.isDefault)}
                                    disabled={mode === MODE.VIEW}
                                    size="small"
                                    variant="primary"
                                />
                                <span className="text-sm font-medium" style={{ color: colors.neutral900 }}>
                                    Default plan for newly registered profiles
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm border" style={{ backgroundColor: colors.neutral50, borderColor: colors.neutral300 }}>
                        <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: colors.neutral900 }}>
                            <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.warning500 }} />
                            Plan Status
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

                    <div className="px-3 py-4 sm:p-6 rounded-xl shadow-sm border" style={{ backgroundColor: colors.neutral50, borderColor: colors.neutral300 }}>
                        <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: colors.neutral900 }}>
                            <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.primary500 }} />
                            Included Modules
                        </h3>
                        <p className="text-sm mb-4" style={{ color: colors.neutral500 }}>
                            A module left unchecked here is only hidden for profiles on this plan — it still respects
                            that profile's role permissions. A module unchecked across every plan is treated as a
                            system module and stays visible to everyone.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {navlinks.map((navlink) => {
                                const isSelected = navlink.id != null && selectedNavLinkIds.includes(navlink.id);
                                return (
                                    <label
                                        key={navlink.id}
                                        className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all duration-200"
                                        style={{
                                            borderColor: isSelected ? colors.primary500 : colors.neutral200,
                                            backgroundColor: isSelected ? colors.primary50 : colors.neutral50,
                                        }}
                                    >
                                        <AdvancedCheckbox
                                            name={`navlink-${navlink.id}`}
                                            checked={isSelected}
                                            onChange={() => navlink.id != null && toggleNavLink(navlink.id)}
                                            disabled={mode === MODE.VIEW}
                                            size="small"
                                            variant="primary"
                                        />
                                        <span className="text-sm font-medium" style={{ color: colors.neutral900 }}>
                                            {enumToNormalKey(navlink.name)}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-between gap-3 pt-4">
                        <Button
                            label="Cancel"
                            variant="tertiaryContained"
                            onClick={() => navigate(makeRoute(ADMIN_ROUTES.SUBSCRIPTION_PLAN, {}))}
                        />
                        {mode !== MODE.VIEW && (
                            <Button
                                label={mode === MODE.ADD ? 'Create Plan' : 'Update Plan'}
                                variant="primaryContained"
                                onClick={() => formik.handleSubmit()}
                                disabled={formik.isSubmitting}
                            />
                        )}
                    </div>
                </div>
            </div>
        </FormShell>
    );
};

export default SubscriptionPlanFormTemplate;
