import React, { useState, useEffect } from 'react';
import { useNavlinkService, type NavlinkResponse } from '../../../services/useNavlinkService';
import { usePermissionService, type PermissionResponseDTO } from '../../../services/usePermissionService';
import { type RolePermissionResponseDTO, type RoleRequestBodyDTO } from '../../../services/useRoleService';
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

interface RoleFormTemplateProps {
    roleDetails?: RolePermissionResponseDTO | null;
    mode: string;
    onSubmit: (values: RoleRequestBodyDTO) => void;
}

const validationSchema = Yup.object({
    name: Yup.string().required('Role name is required'),
    description: Yup.string().required('Description is required'),
    status: Yup.string().required('Status is required'),
    rolePermissions: Yup.array().of(
        Yup.object({
            navLinkId: Yup.string().required('Navlink ID is required'),
            permissionId: Yup.string().required('Permission ID is required')
        })
    ).min(0, 'At least one permission should be selected')
});

const RoleFormTemplate: React.FC<RoleFormTemplateProps> = ({ roleDetails, mode, onSubmit }) => {
    const navigate = useNavigate();
    const navLinkService = useNavlinkService();
    const permissionService = usePermissionService();
    const colors = useColors();

    const [navlinks, setNavlinks] = useState<NavlinkResponse[]>([]);
    const [permissions, setPermissions] = useState<PermissionResponseDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedNavlinks, setExpandedNavlinks] = useState<Set<string>>(new Set());
    const [selectedPermissionCount, setSelectedPermissionCount] = useState(0);

    const formik = useFormik<RoleRequestBodyDTO>({
        initialValues: {
            name: roleDetails?.name || '',
            description: roleDetails?.description || '',
            status: roleDetails?.status || Status.ACTIVE,
            rolePermissions: roleDetails?.navLinks?.flatMap((navlink) => 
                navlink.permissions.map((permission) => ({
                    navLinkId: navlink.navLinkId,
                    permissionId: permission.id
                }))
            ) || []
        },
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
        },
        enableReinitialize: true
    })

    const loadNavlinks = async () => {
        try {
            const response = await navLinkService.getAllNavlinks({
                page: "1",
                size: "1000",
                sortDir: "ASC",
                sortBy: "name"
            });
            if (response.status === HTTP_STATUS.OK) {
                setNavlinks(response.data.data);
            }
        } catch (error) {
            console.error('Error loading navlinks:', error);
        }
    };

    const loadPermissions = async () => {
        try {
            const response = await permissionService.getAllPermissions();
            if (response.status === HTTP_STATUS.OK) {
                setPermissions(response.data.data);
            }
        } catch (error) {
            console.error('Error loading permissions:', error);
        }
    }

    useEffect(() => {
        loadNavlinks();
        loadPermissions();
    }, []);

    const handlePermissionToggle = (navLinkId: string, permissionId: string) => {
        const currentPermissions = formik.values.rolePermissions;
        const existingIndex = currentPermissions.findIndex(
            p => p.navLinkId === navLinkId && p.permissionId === permissionId
        );

        if (existingIndex >= 0) {
            // Remove permission
            const updatedPermissions = currentPermissions.filter(
                (_, index) => index !== existingIndex
            );
            formik.setFieldValue('rolePermissions', updatedPermissions);
        } else {
            // Add permission
            formik.setFieldValue('rolePermissions', [
                ...currentPermissions,
                { navLinkId, permissionId }
            ]);
        }
    };

    const isPermissionSelected = (navLinkId: string, permissionId: string) => {
        return formik.values.rolePermissions.some(
            p => p.navLinkId === navLinkId && p.permissionId === permissionId
        );
    };

    const handleSelectAllForNavlink = (navLinkId: string) => {
        const currentPermissions = formik.values.rolePermissions;

        // Remove all existing permissions for this navlink
        const otherPermissions = currentPermissions.filter(
            p => p.navLinkId !== navLinkId
        );

        // Add all permissions for this navlink
        const newPermissions = permissions.map(permission => ({
            navLinkId,
            permissionId: permission.id
        }));

        formik.setFieldValue('rolePermissions', [...otherPermissions, ...newPermissions]);
    };

    const handleUpdateAllForNavlink = (navLinkId: string) => {
        const currentPermissions = formik.values.rolePermissions;

        // Remove all existing permissions for this navlink
        const otherPermissions = currentPermissions.filter(
            p => p.navLinkId !== navLinkId
        );

        formik.setFieldValue('rolePermissions', otherPermissions);
    };

    const areAllPermissionsSelected = (navLinkId: string) => {
        return permissions.every(permission =>
            isPermissionSelected(navLinkId, permission.id)
        );
    };

    const getSelectedPermissionCount = () => {
        return formik.values.rolePermissions.length;
    };

    const getTotalPermissionCount = () => {
        return navlinks.length * permissions.length;
    };

    const toggleNavlinkExpansion = (navlinkId: string) => {
        const newExpanded = new Set(expandedNavlinks);
        if (newExpanded.has(navlinkId)) {
            newExpanded.delete(navlinkId);
        } else {
            newExpanded.add(navlinkId);
        }
        setExpandedNavlinks(newExpanded);
    };

    const handleSelectAllNavlinks = () => {
        const allPermissions = navlinks.flatMap(navlink =>
            permissions.map(permission => ({
                navLinkId: navlink.id,
                permissionId: permission.id
            }))
        );
        formik.setFieldValue('rolePermissions', allPermissions);
    };

    const handleClearAllPermissions = () => {
        formik.setFieldValue('rolePermissions', []);
    };

    const getFilteredPermissions = () => {
        if (!searchTerm) return permissions;
        return permissions.filter(permission =>
            permission.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const getNavlinkSelectionStats = (navlinkId: string) => {
        const total = permissions.length;
        const selected = permissions.filter(p => isPermissionSelected(navlinkId, p.id)).length;
        return { selected, total };
    };

    useEffect(() => {
        setSelectedPermissionCount(getSelectedPermissionCount());
    }, [formik.values.rolePermissions]);

    return (
        <div className="mb-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2" style={{ color: colors.neutral900 }}>
                    {mode === MODE.ADD
                        ? 'Add Role'
                        : mode === MODE.EDIT
                            ? 'Edit Role'
                            : 'Role Details'}
                </h2>
                <p style={{ color: colors.neutral600 }}>
                    {mode === MODE.VIEW
                        ? 'View role details and permissions'
                        : 'Configure role settings and permissions'}
                </p>
            </div>

            <div className="space-y-8">
                <div className="p-6 rounded-xl shadow-sm border" style={{ backgroundColor: colors.neutral50, borderColor: colors.neutral200 }}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: colors.neutral900 }}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.primary500 }} />
                        Role Details
                    </h3>

                    <div className="grid grid-cols-2 gap-6">
                        <TextField
                            label="Role Name"
                            placeholder="Enter role name"
                            fullWidth
                            {...formik.getFieldProps('name')}
                            disabled={mode === MODE.VIEW}
                            required
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={Boolean(formik.touched.name && formik.errors.name) ? formik.errors.name : ''}
                        />
                        <TextField
                            label="Description"
                            placeholder="Enter role description"
                            fullWidth
                            {...formik.getFieldProps('description')}
                            disabled={mode === MODE.VIEW}
                            required
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={Boolean(formik.touched.description && formik.errors.description) ? formik.errors.description : ''}
                        />
                    </div>
                </div>

                <div className="p-6 rounded-xl shadow-sm border" style={{ backgroundColor: colors.neutral50, borderColor: colors.neutral200 }}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: colors.neutral900 }}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.success500 }} />
                        Role Status
                    </h3>

                    <CustomRadioGroup
                        name="status"
                        label=""
                        options={Object.values(Status).map(status => ({
                            value: status,
                            label: status,
                        }))}
                        value={formik.values.status || ''}
                        onChange={formik.handleChange}
                        disabled={mode === MODE.VIEW}
                    />
                </div>

                <div className="p-6 rounded-xl shadow-sm border" style={{ backgroundColor: colors.neutral50, borderColor: colors.neutral200 }}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: colors.neutral900 }}>
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.warning500 }} />
                        Permissions
                    </h3>
                    <div>
                        <div className="rounded-lg p-4 mb-6 border" style={{ backgroundColor: colors.neutral100, borderColor: colors.neutral200 }}>
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="text-sm font-medium" style={{ color: colors.neutral700 }}>
                                        <span className="font-semibold" style={{ color: colors.primary600 }}>{selectedPermissionCount}</span>
                                        <span style={{ color: colors.neutral500 }}> / {getTotalPermissionCount()}</span>
                                        <span style={{ color: colors.neutral500 }} className="ml-1">permissions selected</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            label="Select All Navlinks"
                                            variant="primaryContained"
                                            size="small"
                                            onClick={handleSelectAllNavlinks}
                                            disabled={mode === MODE.VIEW || selectedPermissionCount === getTotalPermissionCount()}
                                        />
                                        <Button
                                            label="Clear All"
                                            variant="tertiaryContained"
                                            size="small"
                                            onClick={handleClearAllPermissions}
                                            disabled={mode === MODE.VIEW || selectedPermissionCount === 0}
                                        />
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto">
                                    <TextField
                                        label=""
                                        placeholder="Search permissions..."
                                        fullWidth
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {navlinks.map((navlink) => {
                                const isExpanded = expandedNavlinks.has(navlink.id);
                                const stats = getNavlinkSelectionStats(navlink.id);
                                const filteredPermissions = getFilteredPermissions();
                                const hasFilteredPermissions = filteredPermissions.length > 0;

                                return (
                                    <div key={navlink.id} className="rounded-lg overflow-hidden transition-all duration-200 border" style={{ borderColor: colors.neutral200 }}>
                                        {/* Navlink Header */}
                                        <div className="px-4 py-3 border-b" style={{ backgroundColor: colors.neutral100, borderColor: colors.neutral200 }}>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => toggleNavlinkExpansion(navlink.id)}
                                                        className="p-1 rounded transition-colors"
                                                        disabled={mode === MODE.VIEW}
                                                        style={{
                                                            backgroundColor: isExpanded ? colors.neutral200 : 'transparent',
                                                            color: colors.neutral600
                                                        }}
                                                    >
                                                        <svg
                                                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                    <h4 className="font-medium" style={{ color: colors.neutral900 }}>{enumToNormalKey(navlink.name)}</h4>
                                                    <span className="text-sm" style={{ color: colors.neutral500 }}>
                                                        ({stats.selected}/{stats.total} selected)
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        label={areAllPermissionsSelected(navlink.id) ? "Deselect All" : "Select All"}
                                                        variant="tertiaryContained"
                                                        size="small"
                                                        onClick={() => {
                                                            if (areAllPermissionsSelected(navlink.id)) {
                                                                handleUpdateAllForNavlink(navlink.id);
                                                            } else {
                                                                handleSelectAllForNavlink(navlink.id);
                                                            }
                                                        }}
                                                        disabled={mode === MODE.VIEW}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Permissions Grid */}
                                        {isExpanded && (
                                            <div className="p-4">
                                                {!hasFilteredPermissions ? (
                                                    <div className="text-center py-8" style={{ color: colors.neutral500 }}>
                                                        No permissions found matching "{searchTerm}"
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                        {filteredPermissions.map((permission) => {
                                                            const isSelected = isPermissionSelected(navlink.id, permission.id);
                                                            return (
                                                                <label
                                                                    key={permission.id}
                                                                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${isSelected
                                                                            ? 'border-blue-500 bg-blue-50'
                                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                                        }`}
                                                                    style={{
                                                                        borderColor: isSelected ? colors.primary500 : colors.neutral200,
                                                                        backgroundColor: isSelected ? colors.primary50 : colors.neutral50
                                                                    }}
                                                                >
                                                                    <AdvancedCheckbox
                                                                        name={`permission-${navlink.id}-${permission.id}`}
                                                                        checked={isSelected}
                                                                        onChange={() => handlePermissionToggle(navlink.id, permission.id)}
                                                                        disabled={mode === MODE.VIEW}
                                                                        size="small"
                                                                        variant="primary"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <span className="text-sm font-medium" style={{ color: colors.neutral900 }}>{permission.name}</span>
                                                                    </div>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between gap-3 pt-4">
                    <Button
                        label="Cancel"
                        variant="tertiaryContained"
                        onClick={() => navigate(makeRoute(ADMIN_ROUTES.ROLE, {}))}
                    />

                    {mode !== MODE.VIEW && (
                        <Button
                            label={mode === MODE.ADD ? 'Create Role' : 'Update Role'}
                            variant="primaryContained"
                            onClick={() => formik.handleSubmit()}
                            disabled={formik.isSubmitting}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default RoleFormTemplate;
