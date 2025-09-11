import React from 'react';
import { useContactUsService, ContactUsRequest } from '../../../services/useContactUsService';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { HTTP_STATUS } from '../../../utils/constant';
import { COLORS } from '../../../utils/constant';
import TextField from '../TextField/TextField';
import Button from '../Button/Button';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(
    /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)$/,
    'Invalid phone number'
  ),
  message: Yup.string().required('Message is required').min(10, 'Message must be at least 10 characters'),
});

const ContactForm: React.FC = () => {
  const contactUsService = useContactUsService();

  const formik = useFormik<ContactUsRequest>({
    initialValues: {
      name: '',
      email: '',
      message: '',
      phone: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await contactUsService.create(values);
        if (response?.status === HTTP_STATUS.OK) {
          resetForm();
        } else {
          console.error('Error creating contact:', response?.data?.message);
        }
      } catch (error) {
        console.error('Error creating contact:', error);
      }
    },
  });

  return (
    <div className={`max-w-2xl mx-auto bg-${COLORS.background} rounded-xl shadow-lg overflow-hidden`}>
      <div className="p-8">
        <h2 className={`text-3xl font-bold text-${COLORS.textPrimary} mb-6`}>Get in Touch</h2>
        <div className="space-y-6">
          <div>
            <TextField
              name="name"
              label="Name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!(formik.touched.name && formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!(formik.touched.email && formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </div>

            <div>
              <TextField
                name="phone"
                label="Phone Number"
                type="tel"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!(formik.touched.phone && formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </div>
          </div>

          <div>
              <TextField
                name="message"
                label="Your Message"
                type="text"
                multiline
                rows={4}
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!(formik.touched.message && formik.errors.message)}
                helperText={formik.touched.message && formik.errors.message}
              />
          </div>

          <div className="pt-2">
            <Button
              label="Send Message"
              type="submit"
              variant="primaryContained"
              disabled={formik.isSubmitting || !formik.isValid}
              onClick={()=>formik.handleSubmit()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;