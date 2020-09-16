import * as yup from 'yup';

export default yup.object().shape({
  title: yup.string().required('Title is required'),
  contact_name: yup.string().required('Contact is required'),
  unique_id: yup.string().required('Unique ID is required'),
  contact_email: yup.string().email('Must be valid email').required('Contact email is required'),
  description: yup.string().required('Description is required'),
  publisher: yup.string().required('Publisher is required'),
  subagency: yup.string(),
  public_access_level: yup.string().required('Access level is required'),
  data_quality: yup.string().required('Data Quality is required'),
  rights: yup
    .string()
    .required('Rights is required.')
    .test('rights-desc', 'Please add explanation of rights', function validate(value) {
      const formVals = this.from[0].value;
      if (value === 'false') {
        if (!formVals.rights_desc) return false;
      }
      return true;
    }),
  rights_desc: yup.string(),
  spatial: yup
    .string()
    .test('spatial-location-extra', 'Please provide location description.', function validate(
      value
    ) {
      const formVals = this.from[0].value;
      if (value === 'true') {
        if (!formVals.spatial_location_desc) return false;
      }
      return true;
    }),
  spatial_location_desc: yup.string(),
  license_others: yup.string(),
  license_new: yup
    .string()
    .required('License is required')
    .test('license-extra', 'Please specify the name of your license', function validate(value) {
      const formVals = this.from[0].value;
      if (value === 'Others') {
        if (!formVals.license_others) return false;
      }
      return true;
    }),
  temporal: yup
    .string()
    .test('temporal-start-end', 'Please specify start and end date', function validate(value) {
      const formVals = this.from[0].value;
      if (value === 'true') {
        if (!formVals.temporal_start_date || !formVals.temporal_end_date) return false;
      }
      return true;
    }),
  temporal_start_date: yup.date(),
  temporal_end_date: yup.date(),
});
