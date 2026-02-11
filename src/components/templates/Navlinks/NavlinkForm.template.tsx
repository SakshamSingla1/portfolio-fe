import React, { useEffect } from 'react';
import Button from '../../atoms/Button/Button';
import TextField from '../../atoms/TextField/TextField';
import CustomRadioGroup from '../../molecules/CustomRadioGroup/CustomRadioGroup';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { Status, ROLES, RoleOptions } from '../../../utils/types';
import { formatToEnumKey, makeRoute } from '../../../utils/helper';
import { type NavlinkRequest, type NavlinkResponse } from '../../../services/useNavlinkService';
import FilterChip from '../../atoms/FilterChip/FilterChip';

interface NavlinkFormTemplateProps {
  onSubmit: (values: NavlinkRequest) => void;
  mode: string;
  navlink?: NavlinkResponse | null;
}

const validationSchema = Yup.object({
  index: Yup.string().required('Index is required'),
  name: Yup.string().required('Name is required'),
  path: Yup.string().required('Path is required'),
  roles: Yup.array().of(Yup.string()).min(1, 'At least one role is required'),
  status: Yup.string().required('Status is required'),
});

const NavlinkFormTemplate: React.FC<NavlinkFormTemplateProps> = ({
  onSubmit,
  mode,
  navlink,
}) => {
  const navigate = useNavigate();

  const formik = useFormik<NavlinkRequest>({
    initialValues: {
      index: navlink?.index || '',
      name: navlink?.name || '',
      path: navlink?.path || '',
      icon: navlink?.icon || '',
      roles: navlink?.roles || [ROLES.SUPER_ADMIN],
      status: navlink?.status || Status.ACTIVE,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    if (navlink) {
      formik.setValues({
        index: navlink.index || '',
        name: navlink.name || '',
        path: navlink.path || '',
        icon: navlink.icon || '',
        roles: navlink.roles || [ROLES.SUPER_ADMIN],
        status: navlink.status,
      });
    }
  }, [navlink]);

  return (
    <div className="mb-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {mode === MODE.ADD
            ? 'Add Navlink'
            : mode === MODE.EDIT
            ? 'Edit Navlink'
            : 'Navlink Details'}
        </h2>
        <p className="text-gray-600">
          {mode === MODE.VIEW
            ? 'View navigation link details'
            : 'Configure sidebar navigation settings'}
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
            Navlink Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Name"
              placeholder="Enter navlink name"
              fullWidth
              {...formik.getFieldProps('name')}
              onBlur={(e) =>
                formik.setFieldValue('name', formatToEnumKey(e.target.value))
              }
              disabled={mode === MODE.VIEW}
              required
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={Boolean(formik.touched.name && formik.errors.name) ? formik.errors.name : ''}
            />

            <TextField
              label="Path"
              placeholder="e.g. dashboard, users"
              fullWidth
              {...formik.getFieldProps('path')}
              disabled={mode === MODE.VIEW}
              required
              error={formik.touched.path && Boolean(formik.errors.path)}
              helperText={Boolean(formik.touched.path && formik.errors.path) ? formik.errors.path : ''}
            />

            <TextField
              label="Index"
              placeholder="Navigation order"
              type="number"
              fullWidth
              {...formik.getFieldProps('index')}
              disabled={mode === MODE.VIEW}
              required
              error={formik.touched.index && Boolean(formik.errors.index)}
              helperText={Boolean(formik.touched.index && formik.errors.index) ? formik.errors.index : ''}
              inputProps={{ min: 0 }}
            />

            <FilterChip
              label="Roles"
              placeholder="Select"
              options={RoleOptions}
              value={RoleOptions.filter((opt) =>
                formik.values.roles.includes(String(opt.value))
              )}
              onchange={(values) => formik.setFieldValue('roles', values.map((v: any) => v.value))}
              minWidth="100px"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
            Navlink Status
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

        <div className="flex justify-between gap-3 pt-4">
          <Button
            label="Cancel"
            variant="tertiaryContained"
            onClick={() =>
              navigate(makeRoute(ADMIN_ROUTES.NAVLINKS, {}))
            }
          />

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
    </div>
  );
};

export default NavlinkFormTemplate;
