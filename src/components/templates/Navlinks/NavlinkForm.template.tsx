import React, { useEffect } from 'react';
import Button from '../../atoms/Button/Button';
import TextField from '../../atoms/TextField/TextField';
import CustomRadioGroup from '../../molecules/CustomRadioGroup/CustomRadioGroup';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { Status } from '../../../utils/types';
import { useColors } from '../../../utils/types';
import { formatToEnumKey, makeRoute } from '../../../utils/helper';
import { type NavlinkRequest, type NavlinkResponse } from '../../../services/useNavlinkService';
import FormShell from '../Shared/FormShell.template';

interface NavlinkFormTemplateProps {
  onSubmit: (values: NavlinkRequest) => void;
  mode: string;
  navlink?: NavlinkResponse | null;
}

const validationSchema = Yup.object({
  index: Yup.string().required('Index is required'),
  name: Yup.string().required('Name is required'),
  path: Yup.string().required('Path is required'),
  navGroup: Yup.string().required('Nav group is required'),
  status: Yup.string().required('Status is required'),
});

const NavlinkFormTemplate: React.FC<NavlinkFormTemplateProps> = ({
  onSubmit,
  mode,
  navlink,
}) => {
  const navigate = useNavigate();
  const colors = useColors();

  const formik = useFormik<NavlinkRequest>({
    initialValues: {
      index: navlink?.index || '',
      name: navlink?.name || '',
      path: navlink?.path || '',
      icon: navlink?.icon || '',
      navGroup: navlink?.navGroup || '',
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
        navGroup: navlink.navGroup || '',
        status: navlink.status,
      });
    }
  }, [navlink]);

  const title =
    mode === MODE.ADD ? 'Add Navlink' : mode === MODE.EDIT ? 'Edit Navlink' : 'Navlink Details';
  const subtitle =
    mode === MODE.VIEW ? 'View navigation link details' : 'Configure sidebar navigation settings';

  return (
    <FormShell
      title={title}
      subtitle={subtitle}
      breadcrumb="Navlinks"
      onBack={() => navigate(-1)}
    >
      <div className="p-6">
        <div className="space-y-8">
          <div
            className="p-6 rounded-xl shadow-sm border"
            style={{ backgroundColor: colors.neutral0, borderColor: colors.neutral300 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: colors.neutral900 }}>
              <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#f97316' }} />
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
                label="Nav Group"
                placeholder="Navigation group"
                fullWidth
                {...formik.getFieldProps('navGroup')}
                onBlur={(e) =>
                  formik.setFieldValue('navGroup', formatToEnumKey(e.target.value))
                }
                disabled={mode === MODE.VIEW}
                required
                error={formik.touched.navGroup && Boolean(formik.errors.navGroup)}
                helperText={Boolean(formik.touched.navGroup && formik.errors.navGroup) ? formik.errors.navGroup : ''}
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
            </div>
          </div>

          <div
            className="p-6 rounded-xl shadow-sm border"
            style={{ backgroundColor: colors.neutral0, borderColor: colors.neutral300 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: colors.neutral900 }}>
              <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#22c55e' }} />
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
    </FormShell>
  );
};

export default NavlinkFormTemplate;
