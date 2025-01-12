import {DialogPanel, DialogTitle} from '@headlessui/react'
import {CheckIcon} from '@heroicons/react/20/solid'
import {XMarkIcon} from '@heroicons/react/24/outline'
import {Form, Formik} from 'formik'
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import * as Yup from 'yup'
import {postData} from '../../app/api'
import {clearFormData} from '../../app/reducers/appConfigSlice'
import {STAFF} from '../../app/url'
import StaffCTCDetails from './StaffCTCDetails'
import StaffInfo from './StaffInfo'
import StaffPersonalDetails from './StaffPersonalDetails'

function Staff({onClose}) {
  const dispatch = useDispatch()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    empId: '',
    DOJ: null,
    mobileNumber: '',
    workEmail: '',
    designation: '',
    subjects: '',
    fileUpload: '',
    DOB: '',
    email: '',
    guardian: '',
    gender: '',
    presentAddress: {
      area: '',
      city: '',
      state: '',
      pincode: '',
    },
    isSameAsPresent: false,
    permanentAddress: {
      area: '',
      city: '',
      state: '',
      pincode: '',
    },
    aadharNumber: '',
    panNumber: '',
    aadharPic: '',
    panCardPic: '',
    accountNumber: '',
    reAccountNumber: '',
    ifscCode: '',
    bankName: '',
    passBookPic: '',
    payroll: '',
  })

  useEffect(() => {
    // Initialize the form data in Redux store
  }, [])

  // Validation schemas for each step
  const validationSchemas = [
    Yup.object({
      firstName: Yup.string()
        .required('First Name is required')
        .min(3, 'First name should be at least 3 letters'),
      lastName: Yup.string()
        .required('Last Name is required')
        .min(3, 'Last name should be at least 3 letters'),
      empId: Yup.string().required('empId is required'),
      workEmail: Yup.string()
        .required('Work Email is required')
        .email('Enter a valid email address'),
      designation: Yup.string().required('Designation is required'),
      subjects: Yup.string().required('Subjects is required'),
      DOJ: Yup.date().nullable().required('Date of Joining is required'),
      mobileNumber: Yup.string().required('Mobile Number is required'),
    }),
    Yup.object({
      profilePic: Yup.object(),
      email: Yup.string()
        .required('Email is required')
        .email('Enter a valid email address'),
      guardian: Yup.string().required(' Guardian is required'),
      gender: Yup.string().required('Gender is required'),
      DOB: Yup.date().nullable().required('Date of Birth is required'),
      presentAddress: Yup.object({
        area: Yup.string().required('Area is required'),
        city: Yup.string().required(' City is required'),
        state: Yup.string().required('Sate is required'),
        pincode: Yup.string().required(' pincode is required'),
      }),
      permanentAddress: Yup.object({
        area: Yup.string().required('Area is required'),
        city: Yup.string().required(' City is required'),
        state: Yup.string().required('Sate is required'),
        pincode: Yup.string().required(' pincode is required'),
      }),
      aadharNumber: Yup.string()
        .matches(/^[0-9]{12}$/, 'Aadhar number must be 12 digits')
        .required('Aadhar number is required'),
      panNumber: Yup.string().required('Pan number is required'),
      aadharPic: Yup.object(),
      panCardPic: Yup.object(),
    }),
    Yup.object({
      bankDetails: Yup.object({
        accountNumber: Yup.string().required('Account Number is required'),
        reAccountNumber: Yup.string()
          .oneOf([Yup.ref('accountNumber'), null], 'accountNumbers must match')
          .required('confirm accountNumber is required'),
        ifscCode: Yup.string().required('Ifsc Code is required'),
        bankName: Yup.string().required('Bank Name is required'),
        passBookPic: Yup.object().required('Pass BookPic is required'),
      }),
      amount: Yup.string().required('Paackage amount is required'),
    }),
  ]

  const handleNext = (values) => {
    alert('handle next')
    console.log('handle next')
    setFormData((prev) => ({...prev, ...values}))
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async (values) => {
    alert('handle submit')
    console.log('Submit clicked')
    try {
      const finalData = {...formData, ...values}
      console.log('Final Data: ', finalData)
      alert('Staff added successfully!')
      let response = await postData(STAFF, finalData)
      if (response.status === 200) {
        dispatch(clearFormData())
        alert('Staff added successfully!')
        // props.goNext('login') if you want to navigate after adding student
      } else {
        alert(response.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const stepContent = [1, 2, 3]

  // const [open, setOpen] = useState(false);
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <>
      <Formik
        initialValues={formData}
        validationSchema={validationSchemas[currentStep - 1]}
        onSubmit={currentStep === 3 ? handleSubmit : handleNext}
      >
        {({values, setFieldValue, errors}) => (
          <Form>
            {console.log('Errors: ', errors)}
            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                  <DialogPanel
                    transition
                    className="pointer-events-auto w-screen max-w-6xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
                  >
                    <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                      <div className="flex min-h-0 flex-1 flex-col ">
                        <div className="bg-purple-900 px-3 py-3 sm:px-6">
                          <div className="flex items-start justify-between">
                            <DialogTitle className=" text-base font-semibold text-white">
                              Add Staff
                            </DialogTitle>
                            <div className="ml-3 flex h-7 items-center">
                              <button
                                type="button"
                                onClick={onClose}
                                className="relative rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon
                                  aria-hidden="true"
                                  className="size-6"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="relative mt-6 flex-1 px-4 sm:px-6 overflow-y-auto">
                          <div className="progress-steps">
                            <nav
                              aria-label="Progress"
                              className="mx-auto max-w-7xl"
                            >
                              <ol
                                role="list"
                                className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-l lg:border lg:border-gray-200"
                              >
                                {stepContent.map((step, stepIdx) => (
                                  <li
                                    key={stepIdx}
                                    className="relative overflow-hidden lg:flex-1"
                                  >
                                    <div
                                      className={classNames(
                                        currentStep === 1
                                          ? 'rounded-t-md border-b-0'
                                          : '',
                                        stepIdx === stepContent.length - 1
                                          ? 'rounded-b-md border-t-0'
                                          : '',
                                        'overflow-hidden border border-gray-200 lg:border-0',
                                      )}
                                    >
                                      <button
                                        type="button"
                                        // onClick={() =>
                                        //   setActiveStep(parseInt(stepIdx, 10))
                                        // }
                                        className="group w-full"
                                      >
                                        {step.status === 'complete' ? (
                                          <a href={'#'} className="group">
                                            <span
                                              aria-hidden="true"
                                              className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                                            />
                                            <span
                                              className={classNames(
                                                stepIdx !== 0 ? 'lg:pl-9' : '',
                                                'flex items-center px-4 py-2 text-sm font-medium',
                                              )}
                                            >
                                              <span className="shrink-0">
                                                <span className="flex size-6 items-center justify-center rounded-full bg-purple-600">
                                                  <CheckIcon
                                                    aria-hidden="true"
                                                    className="size-4 text-white"
                                                  />
                                                </span>
                                              </span>
                                              <span className="ml-4 flex min-w-0 flex-col">
                                                <span className="text-sm font-medium">
                                                  'step'
                                                </span>
                                              </span>
                                            </span>
                                          </a>
                                        ) : step.status === 'current' ? (
                                          <a
                                            href={step.href}
                                            aria-current="step"
                                          >
                                            <span
                                              aria-hidden="true"
                                              className="absolute left-0 top-0 h-full w-1 bg-purple-600 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                                            />
                                            <span
                                              className={classNames(
                                                stepIdx !== 0 ? 'lg:pl-9' : '',
                                                'flex items-center px-4 py-2 text-xs font-medium',
                                              )}
                                            >
                                              <span className="shrink-0">
                                                <span className="flex size-6 items-center justify-center rounded-full border-2 border-purple-600">
                                                  <span className="text-purple-600">
                                                    {step.id}
                                                  </span>
                                                </span>
                                              </span>
                                              <span className="ml-4 flex min-w-0 flex-col">
                                                <span className="text-sm font-medium text-purple-600">
                                                  {step.name}
                                                </span>
                                              </span>
                                            </span>
                                          </a>
                                        ) : (
                                          <a href={'#'} className="group">
                                            <span
                                              aria-hidden="true"
                                              className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                                            />
                                            <span
                                              className={classNames(
                                                stepIdx !== 0 ? 'lg:pl-9' : '',
                                                'flex items-center px-4 py-2 text-xs font-medium',
                                              )}
                                            >
                                              <span className="shrink-0">
                                                <span className="flex size-6 items-center justify-center rounded-full border-2 border-gray-300">
                                                  <span className="text-gray-500">
                                                    {stepIdx}
                                                  </span>
                                                </span>
                                              </span>
                                              <span className="ml-4 flex min-w-0 flex-col">
                                                <span className="text-sm font-medium text-gray-500">
                                                  stepName
                                                </span>
                                              </span>
                                            </span>
                                          </a>
                                        )}

                                        {stepIdx !== 0 ? (
                                          <>
                                            {/* Separator */}
                                            <div
                                              aria-hidden="true"
                                              className="absolute inset-0 left-0 top-0 hidden w-3 lg:block"
                                            >
                                              <svg
                                                fill="none"
                                                viewBox="0 0 12 82"
                                                preserveAspectRatio="none"
                                                className="size-full text-gray-300"
                                              >
                                                <path
                                                  d="M0.5 0V31L10.5 41L0.5 51V82"
                                                  stroke="currentcolor"
                                                  vectorEffect="non-scaling-stroke"
                                                />
                                              </svg>
                                            </div>
                                          </>
                                        ) : null}
                                      </button>
                                    </div>
                                  </li>
                                ))}
                              </ol>
                            </nav>
                          </div>
                          <div className="form-content mt-4">
                            {currentStep === 1 && <StaffInfo />}
                            {currentStep === 2 && (
                              <StaffPersonalDetails
                                values={values}
                                setFieldValue={setFieldValue}
                              />
                            )}
                            {currentStep === 3 && (
                              <StaffCTCDetails
                                values={values}
                                setFieldValue={setFieldValue}
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex shrink-0 justify-between px-4 py-4">
                          <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                          >
                            Cancel
                          </button>
                          <div>
                            {currentStep > 1 && (
                              <button
                                type="button"
                                onClick={handleBack}
                                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                              >
                                Back
                              </button>
                            )}
                            <button
                              type="submit"
                              className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm"
                            >
                              {currentStep === 3 ? 'Submit' : 'Next'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogPanel>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default Staff
