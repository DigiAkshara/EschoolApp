import React from 'react';
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import CustomInput from '../commonComponent/CustomInput';
import CustomSelect from '../commonComponent/CustomSelect';
import CustomButton from '../commonComponent/CustomButton';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { postData } from "../app/api";
import { LOGIN } from "../app/url";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../app/reducers/appConfigSlice";
import { useNavigate, useParams } from 'react-router-dom';

export default function Login() {
  const {id} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      role: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Password is Required'),
      role: Yup.string()
        .required('Role is required'),
    }),
    onSubmit: async (values) => {
      // Log the form values to the console
      console.log('Form Submitted with Values:', values);
      let response = await postData(LOGIN, values)
      if (response.status === 200) {
        localStorage.setItem('studentManagment', response.token);
        dispatch(setUser(jwtDecode(response.token)))
        navigate(id ? `/tenant/${id}` : '/')
      } else {
        alert(response.message)
      }
    },
  });

  return (
    <div className="flex min-h-full flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              alt="Your Company"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=purple&shade=600"
              className="h-10 w-auto"
            />
            <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Role Select */}
              <CustomSelect
                id="role"
                name="role"
                label="Role"
                icon={UserIcon}
                options={[
                  { value: '', label: 'Select' },
                  { value: 'staff', label: 'Staff' },
                  { value: 'student', label: 'student' },
                  { value: 'other', label: 'other' },
                ]}
                value={formik.values.role}
                onChange={(e) => formik.setFieldValue('role', e.target.value)}
                onBlur={formik.handleBlur}
              />
              {formik.touched.role && formik.errors.role && (
                <div className="text-red-500 text-sm">{formik.errors.role}</div>
              )}

              {/* Email Input */}
              <CustomInput
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                label="Email address"
                icon={EnvelopeIcon}
                autoComplete="email"
                required
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm">{formik.errors.email}</div>
              )}

              {/* Password Input */}
              <CustomInput
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                label="Password"
                icon={LockClosedIcon}
                autoComplete="current-password"
                required
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm">{formik.errors.password}</div>
              )}

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm/6 text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm/6">
                  <a href="#" className="font-semibold text-purple-600 hover:text-purple-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <CustomButton
                type="submit"
                label="Sign in"
              />
            </form>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          alt=""
          src={'/LoginImage.jpg'}
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    </div>
  );
}
