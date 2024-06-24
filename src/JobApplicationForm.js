import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const schema = yup.object().shape({
  fullName: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: yup.number().typeError('Phone Number must be a number').required('Phone Number is required'),
  applyingFor: yup.string().required('Applying for Position is required'),
  relevantExperience: yup.number().when('applyingFor', {
    is: val => val === 'Developer' || val === 'Designer',
    then: yup.number().typeError('Relevant Experience must be a number').required('Relevant Experience is required').positive('Relevant Experience must be greater than 0')
  }),
  portfolioUrl: yup.string().url('Invalid URL').when('applyingFor', {
    is: 'Designer',
    then: yup.string().required('Portfolio URL is required')
  }),
  managementExperience: yup.string().when('applyingFor', {
    is: 'Manager',
    then: yup.string().required('Management Experience is required')
  }),
  additionalSkills: yup.array().min(1, 'At least one skill must be selected'),
  preferredInterviewTime: yup.date().required('Preferred Interview Time is required').typeError('Invalid date')
});

const JobApplicationForm = () => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const [summary, setSummary] = useState(null);
  const applyingFor = watch('applyingFor');

  const onSubmit = data => {
    setSummary(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Job Application Form</h1>
        <div>
          <label>Full Name</label>
          <input {...register('fullName')} />
          {errors.fullName && <p>{errors.fullName.message}</p>}
        </div>

        <div>
          <label>Email</label>
          <input {...register('email')} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>Phone Number</label>
          <input type="number" {...register('phoneNumber')} />
          {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
        </div>

        <div>
          <label>Applying for Position</label>
          <select {...register('applyingFor')}>
            <option value="">Select...</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Manager">Manager</option>
          </select>
          {errors.applyingFor && <p>{errors.applyingFor.message}</p>}
        </div>

        {(applyingFor === 'Developer' || applyingFor === 'Designer') && (
          <div>
            <label>Relevant Experience (Years)</label>
            <input type="number" {...register('relevantExperience')} />
            {errors.relevantExperience && <p>{errors.relevantExperience.message}</p>}
          </div>
        )}

        {applyingFor === 'Designer' && (
          <div>
            <label>Portfolio URL</label>
            <input type="text" {...register('portfolioUrl')} />
            {errors.portfolioUrl && <p>{errors.portfolioUrl.message}</p>}
          </div>
        )}

        {applyingFor === 'Manager' && (
          <div>
            <label>Management Experience</label>
            <input type="text" {...register('managementExperience')} />
            {errors.managementExperience && <p>{errors.managementExperience.message}</p>}
          </div>
        )}

        <div>
          <label>Additional Skills</label>
          <div>
            <label><input type="checkbox" {...register('additionalSkills')} value="JavaScript" /> JavaScript</label>
            <label><input type="checkbox" {...register('additionalSkills')} value="CSS" /> CSS</label>
            <label><input type="checkbox" {...register('additionalSkills')} value="Python" /> Python</label>
          </div>
          {errors.additionalSkills && <p>{errors.additionalSkills.message}</p>}
        </div>

        <div>
          <label>Preferred Interview Time</label>
          <Controller
            control={control}
            name="preferredInterviewTime"
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={field.onChange}
                showTimeSelect
                dateFormat="Pp"
              />
            )}
          />
          {errors.preferredInterviewTime && <p>{errors.preferredInterviewTime.message}</p>}
        </div>

        <button type="submit">Submit</button>
      </form>

      {summary && (
        <div>
          <h2>Summary</h2>
          <pre>{JSON.stringify(summary, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default JobApplicationForm;
