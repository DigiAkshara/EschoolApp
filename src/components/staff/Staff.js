import { DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { postData } from '../../app/api'
import { STAFF } from '../../app/url'
import { handleApiResponse } from '../../commonComponent/CommonFunctions'
import Stepper from '../../commonComponent/StepperComponent'
import StaffCTCDetails from './StaffCTCDetails'
import StaffInfo from './StaffInfo'
import StaffPersonalDetails from './StaffPersonalDetails'

function Staff({ onClose, getStaff }) {
  const selectedStaff = useSelector((state) => state.staff.selectedStaff)
  const dispatch = useDispatch()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    staffType: '',
    firstName: '',
    lastName: '',
    empId: '',
    DOJ: null,
    mobileNumber: '',
    workEmail: null,
    designation: '',
    subjects: [],
    profilePic: null,
    DOB: '',
    email: null,
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
    aadharPic: null,
    panCardPic: null,
    paymentMode: '',
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
    bankPassbook: null,
    amount: '',
    ...(selectedStaff && selectedStaff),
  })

  const panCardRegex = /^[A-Z]{3}P[A-Z]{1}[0-9]{4}[A-Z]{1}$/;

  // Validation schemas for each step
  const validationSchemas = [
    Yup.object({
      staffType: Yup.string().required('Staff Type is required'),
      firstName: Yup.string()
        .required('First Name is required')
        .min(3, 'First name should be at least 3 letters'),
      lastName: Yup.string()
        .min(3, 'Last name should be at least 3 letters'),
      empId: Yup.string().required('EmpId is required'),
      workEmail: Yup.string()
        .email('Enter a valid email address').nullable(),
      designation: Yup.string().required('Designation is required'),
      subjects: Yup.array().test(
        'subjects-required',
        'Subject is required when staff type is Teaching',
        function (value) {
          const { staffType } = this.parent; // Access other field values (e.g., staffType)
          // If staffType is 'teaching' and subjects is empty array, validate as required
          return staffType !== 'teaching' || (value && value.length !== 0);
        }
      ),
      DOJ: Yup.date().nullable().required('Date of Joining is required'),
      mobileNumber: Yup.string().required('Mobile Number is required').matches(
        /^[0-9]{10}$/,
        "Mobile number must be 10 digits"
      ).max(10),
    }),
    Yup.object({
      profilePic: Yup.object().nullable(),
      email: Yup.string()
        .email('Enter a valid email address').nullable(),
      guardian: Yup.string().required('Guardian is required').max(50),
      gender: Yup.string().required('Gender is required'),
      DOB: Yup.date().nullable().required('Date of Birth is required'),
      presentAddress: Yup.object({
        area: Yup.string().required('Area is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        pincode: Yup.string().required('Pincode is required'),
      }),
      permanentAddress: Yup.object({
        area: Yup.string().required('Area is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        pincode: Yup.string().required('Pincode is required'),
      }),
      aadharNumber: Yup.string()
        .matches(/^[0-9]{12}$/, 'Aadhar number must be 12 digits')
        .required('Aadhar Number is required'),
      panNumber: Yup.string()
        .matches(panCardRegex, "Invalid PAN card number")
        .required("PAN card is required"),
      aadharPic: Yup.object().nullable(),
      panCardPic: Yup.object().nullable(),
    }),
    Yup.object({
      amount: Yup.string().required('Package amount is required'),
      paymentMode: Yup.string()
        .required("Payment mode is required")
        .oneOf(["online", "offline"], "Invalid payment mode"),
      accountNumber: Yup.string()
        .test(
          "account-number-required",
          "Account number is required",
          function (value) {
            return this.parent.paymentMode === "online" ? !!value : true;
          }
        )
        .test(
          "account-number-valid",
          "Account number must be 10-18 digits",
          function (value) {
            return this.parent.paymentMode === "online"
              ? /^\d{10,18}$/.test(value || "")
              : true;
          }
        ),
      confirmAccountNumber: Yup.string()
        .test(
          "confirm-account-number-required",
          "Confirm account number is required",
          function (value) {
            return this.parent.paymentMode === "online" ? !!value : true;
          }
        )
        .test(
          "confirm-account-number-match",
          "Account numbers must match",
          function (value) {
            return this.parent.paymentMode === "online"
              ? value === this.parent.accountNumber
              : true;
          }
        ),
      ifscCode: Yup.string()
        .test(
          "ifsc-code-required",
          "IFSC code is required",
          function (value) {
            return this.parent.paymentMode === "online" ? !!value : true;
          }
        )
        .test(
          "ifsc-code-valid",
          "Invalid IFSC code (format: 4 letters, 0, 6 alphanumeric)",
          function (value) {
            return this.parent.paymentMode === "online"
              ? /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value || "")
              : true;
          }
        ),
      bankName: Yup.string().test(
        "bank-name-required",
        "Bank name is required",
        function (value) {
          return this.parent.paymentMode === "online" ? !!value : true;
        }
      ), bankPassbook: Yup.object().nullable(),
    }),
  ]

  const handleNext = (values) => {
    setFormData((prev) => ({ ...prev, ...values }))
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async (values) => {
    try {
      const finalData = { ...formData, ...values, confirmAccountNumber: undefined }
      let response = await postData(STAFF, finalData)
      handleApiResponse(response.data.message, "success")
      getStaff();
      // onClose();
    } catch (error) {
      handleApiResponse(error)
      console.log(error)
    }
  }

  const stepContent = [
    { id: 1, name: "Employment Info", href: "#", status: "current" },
    { id: 2, name: "Personal Details", href: "#", status: "upcoming" },
    { id: 3, name: "CTC details", href: "#", status: "upcoming" },
  ];

  return (
    <>
      <Formik
        initialValues={formData}
        validationSchema={validationSchemas[currentStep - 1]}
        onSubmit={currentStep === 3 ? handleSubmit : handleNext}
      >
        {({ values, setFieldValue, errors }) => (
          // console.log(errors),
          <Form>
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
                          <Stepper steps={stepContent} currentStep={currentStep} />
                          <div className="form-content mt-4">
                            {currentStep === 1 && <StaffInfo values={values}
                              setFieldValue={setFieldValue} />}
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
