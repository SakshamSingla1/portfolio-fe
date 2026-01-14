import React, { useEffect } from 'react';
import Button from '../../atoms/Button/Button';
import { type NavlinkRequest, type NavlinkResponse } from '../../../services/useNavlinkService';
import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { useNavigate } from 'react-router-dom';
import TextField from '../../atoms/TextField/TextField';
import { formatToEnumKey, makeRoute } from '../../../utils/helper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomRadioGroup from '../../molecules/CustomRadioGroup/CustomRadioGroup';
import { Status , ROLES, RoleOptions } from '../../../utils/types';
import Select from '../../atoms/Select/Select';

interface NavlinkFormTemplateProps {
  onSubmit: (values: NavlinkRequest) => void;
  mode: string;
  navlink?: NavlinkResponse | null;
}

const validationSchema = Yup.object().shape({
  index: Yup.string().required('Index is required'),
  name: Yup.string().required('Name is required'),
  path: Yup.string().required('Path is required'),
  role: Yup.string().required('Role is required'),
  status: Yup.string().required('Status is required'),
});

const NavlinkFormTemplate: React.FC<NavlinkFormTemplateProps> = ({ onSubmit, mode, navlink }) => {
  const navigate = useNavigate();

  const formik = useFormik<NavlinkRequest>({
    initialValues: {
      index: navlink?.index?.toString() || '',
      name: navlink?.name || '',
      path: navlink?.path || '',
      icon: navlink?.icon || '',
      role: navlink?.role || ROLES.SUPER_ADMIN,
      status: navlink?.status || Status.ACTIVE
    },
    validationSchema,
    onSubmit: (values) => onSubmit(values),
  });

  useEffect(() => {
    if (navlink) {
      formik.setValues({
        index: navlink.index?.toString() || '',
        name: navlink.name || '',
        path: navlink.path || '',
        icon: navlink.icon || '',
        role: navlink.role || ROLES.SUPER_ADMIN,
        status: navlink.status
      });
    }
  }, [navlink]);

  return (
    <div className="mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">
        {mode === MODE.ADD
          ? 'Add New Navlink'
          : mode === MODE.EDIT
            ? 'Edit Navlink'
            : 'Navlink Details'}
      </h2>

      <p className="text-gray-500 mb-6">
        {mode === MODE.VIEW
          ? 'View details of this navlink.'
          : 'Fill in the details below to proceed.'}
      </p>
      <div className="bg-white rounded-xl shadow border border-gray-200 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <TextField
              label="Name"
              variant="outlined"
              placeholder='Enter navlink name'
              fullWidth
              {...formik.getFieldProps('name')}
              onBlur={(e) => {
                formik.setFieldValue('name', formatToEnumKey(e.target.value));
              }}
              disabled={mode === MODE.VIEW}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </div>
          <div className="space-y-1">
            <TextField
              label="Path"
              placeholder="Enter path (e.g., dashboard, users)"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps('path')}
              disabled={mode === MODE.VIEW}
              error={formik.touched.path && Boolean(formik.errors.path)}
              helperText={formik.touched.path && formik.errors.path}
            />
          </div>
          <div className="space-y-1">
            <TextField
              label="Index"
              placeholder="Enter index value"
              variant="outlined"
              fullWidth
              type="number"
              {...formik.getFieldProps('index')}
              disabled={mode === MODE.VIEW}
              error={formik.touched.index && Boolean(formik.errors.index)}
              helperText={formik.touched.index && formik.errors.index}
              inputProps={{ min: 0 }}
            />
          </div>
          <div className='space-y-1'>
            <Select
              label="Role"
              placeholder='Select role'
              options={RoleOptions}
              value={formik.values.role}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={Boolean(formik.touched.role && formik.errors.role) ? formik.errors.role : ""}
              onChange={(value) => {
                formik.setFieldValue('role', value);
              }}
              disabled={mode === MODE.VIEW}
            />
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 mt-4">
        <CustomRadioGroup
          name="status"
          label="Navlink Status"
          options={Object.values(Status).map((status: string) => ({
            value: status,
            label: status,
          }))}
          value={formik.values.status || ""}
          onChange={formik.handleChange}
          disabled={mode === MODE.VIEW}
        />
      </div>

      <div className="flex justify-between mt-10">
        <Button
          label="Cancel"
          variant="tertiaryContained"
          onClick={() => navigate(makeRoute(ADMIN_ROUTES.NAVLINKS, {}))}
        />

        {mode !== MODE.VIEW && (
          <Button
            label="Save Changes"
            variant="primaryContained"
            onClick={() => formik.handleSubmit()}
            disabled={formik.isSubmitting || !formik.isValid}
          />
        )}
      </div>
    </div>
  );
};

export default NavlinkFormTemplate;
