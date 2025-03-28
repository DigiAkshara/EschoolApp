import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { Form, Formik } from 'formik'
import { jwtDecode } from 'jwt-decode'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { getData, postData } from '../app/api'
import {
  loadNavConfig,
  setAcademicYear,
  setActiveMenu,
  setBranchData,
  setBranchId,
  setBranchs,
  setIsLoader,
  setUser,
} from '../app/reducers/appConfigSlice'
import { fetchTenant } from '../app/reducers/TenantConfigSlice'
import { BRANCH, LOGIN } from '../app/url'
import { handleApiResponse, roles } from '../commonComponent/CommonFunctions'
import CustomButton from '../commonComponent/CustomButton'
import CustomInput from '../commonComponent/CustomInput'
import CustomSelect from '../commonComponent/CustomSelect'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const initialValues = {
    loginId: '',
    password: '',
    userType: '',
  }

  const validationSchemas = Yup.object({
    loginId: Yup.string()
      // .email('Invalid email address')
      .required('Email / mobile number is required'),
    password: Yup.string()
      .max(20, 'Must be 20 characters or less')
      .required('Password is Required'),
    userType: Yup.string().required('Role is required'),
  })
  const handleSubmit = async (values) => {
    try {
      dispatch(setIsLoader(true))
      let response = await postData(LOGIN, values)
      const user = jwtDecode(response.data.token)
      if(response.data.branch) {
        let branch = response.data.branch
        localStorage.setItem('branchId', branch._id)
        dispatch(setBranchId(branch._id))
        dispatch(setBranchData({
          value:branch._id,
          label:branch.name,
          address:branch.address,
          logo:branch.logo,
          email:branch.email,
          mobileNumber:branch.mobileNumber,
          isDefault:branch.isDefault
        }))
      }
      if(user.permissions|| user.role.name === 'superadmin') {
        localStorage.setItem('studentManagement', response.data.token)
        localStorage.setItem('academicYear', response.data.academicYear?._id)
        dispatch(setUser(user))
        dispatch(setAcademicYear(response.data.academicYear))
        dispatch(setActiveMenu("home"))
        dispatch(loadNavConfig({permissions:user.permissions?.permissions, role:user.role.name}))
        navigate('/')
        if(user.role.name !== 'superadmin') {
          dispatch(fetchTenant(user.tenant))
        }
      } else {
        handleApiResponse({
          message: "You don't have permission to login"
        })
      }
    } catch (error) {
      handleApiResponse(error)
    } finally {
      dispatch(setIsLoader(false))
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('studentManagement')
    if (token) {
      navigate('/')
    }
  }, [])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchemas}
      onSubmit={handleSubmit}
    >
      {({values}) => (
        <Form className="h-screen ">
          <div className="flex min-h-full flex-1">
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
              <div className="mx-auto w-full max-w-sm lg:w-96">
                <div>
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=purple&shade=600"
                    className="h-10 w-auto"
                  />
                  <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">
                    Sign in to your account
                  </h2>
                </div>

                <div className="mt-10 space-y-6">
                  {/* Role Select */}
                  <CustomSelect
                    name="userType"
                    label="Role"
                    icon={UserIcon}
                    options={roles}
                    required={true}
                  />

                  {/* Email Input */}
                  <CustomInput
                    name="loginId"
                    placeholder="you@example.com"
                    label="Email / Mobile Number"
                    icon={EnvelopeIcon}
                    required={true}
                  />

                  {/* Password Input */}
                  <CustomInput
                    name="password"
                    type="password"
                    placeholder="Password"
                    label="Password"
                    icon={LockClosedIcon}
                    required
                  />

                  {/* Remember Me */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-3 block text-sm/6 text-gray-700"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm/6">
                      {/* <a
                        href="#"
                        className="font-semibold text-purple-600 hover:text-purple-500"
                      >
                        Forgot password?
                      </a> */}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <CustomButton type="submit" label="Sign in" />
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
        </Form>
      )}
    </Formik>
  )
}
