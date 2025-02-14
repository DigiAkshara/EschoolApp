import { DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import {  useSelector } from "react-redux";
import * as Yup from "yup";
import { postData, updateData } from "../../app/api";
import { STAFF } from "../../app/url";
import { handleApiResponse } from "../../commonComponent/CommonFunctions";
import Stepper from "../../commonComponent/StepperComponent";
import StaffCTCDetails from "./StaffCTCDetails";
import StaffInfo from "./StaffInfo";
import StaffPersonalDetails from "./StaffPersonalDetails";

function Staff({ onClose, getStaff }) {
  const selectedStaff = useSelector((state) => state.staff?.selectedStaff);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    staffType: "",
    firstName: "",
    lastName: "",
    empId: "",
    DOJ: null,
    mobileNumber: "",
    workEmail: null,
    designation: "",
    subjects: [],
    profilePic: null,
    DOB: "",
    email: null,
    guardian: "",
    gender: "",
    presentAddress: {
      area: "",
      city: "",
      state: "",
      pincode: "",
    },
    isSameAsPresent: false,
    permanentAddress: {
      area: "",
      city: "",
      state: "",
      pincode: "",
    },
    aadharNumber: "",
    panNumber: "",
    aadharPic: null,
    panCardPic: null,
    paymentMode: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
    bankPassbook: null,
    amount: "",
    ...(selectedStaff && selectedStaff),
    ...(selectedStaff && {
      confirmAccountNumber: selectedStaff.accountNumber,
    }),
  });

  const panCardRegex = /^[A-Z]{3}P[A-Z]{1}[0-9]{4}[A-Z]{1}$/;

  // Validation schemas for each step
  const validationSchemas = [
    Yup.object({
      staffType: Yup.string().required("Staff Type is required"),
      firstName: Yup.string()
        .matches(
          /^[a-zA-Z\s]*$/,
          "First Name can only contain letters and spaces"
        )
        .min(3, "First Name must be at least 3 characters")
        .max(50, "First Name must be at most 50 characters")
        .required("First Name is required"),

      lastName: Yup.string()
        .matches(
          /^[a-zA-Z\s]*$/,
          "Last Name can only contain letters and spaces"
        )
        .min(3, "Last Name must be at least 3 characters")
        .max(50, "Last Name must be at most 50 characters")
        .required("Last Name is required")
        .notOneOf(
          [Yup.ref("firstName")],
          "First Name and Last Name should not be the same"
        ),
      empId: Yup.string()
        .matches(
          /^(?=.*\d)[a-zA-Z0-9]*$/,
          "EmpId must contain at least one numeric character"
        )
        .max(10, "EmpId must be at most 10 characters")
        .required("EmpId is required"),
      workEmail: Yup.string().email("Enter a valid email address").nullable(),
      designation: Yup.string().required("Designation is required"),
      subjects: Yup.array().test(
        "subjects-required",
        "Subject is required when staff type is Teaching",
        function (value) {
          const { staffType } = this.parent; // Access other field values (e.g., staffType)
          // If staffType is 'teaching' and subjects is empty array, validate as required
          return staffType !== "teaching" || (value && value.length !== 0);
        }
      ),
      DOJ: Yup.date().nullable().required("Date of Joining is required"),
      mobileNumber: Yup.string()
        .required("Mobile Number is required")
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .max(10),
    }),
    Yup.object({
      profilePic: Yup.mixed()
              .nullable()
              .test(
                "fileFormat",
                "Photo must be in JPG, JPEG, or PNG format",
                (value) => {
                  if (!value || !(value instanceof File)) return true; 
      
                  const supportedFormats = ["image/jpeg", "image/jpg", "image/png"];
                  return supportedFormats.includes(value.type);
                }
              )
              .test("fileSize", "Photo size must not exceed 2MB", (value) => {
                if (!value || !(value instanceof File)) return true; 
      
                const maxSizeInBytes = 2 * 1024 * 1024;
                return value.size <= maxSizeInBytes;
              }),

      email: Yup.string().email("Enter a valid email address").nullable(),
      guardian: Yup.string()
        .matches(
          /^[a-zA-Z\s]*$/,
          "Guardian Name can only contain letters and spaces"
        )
        .max(50, "Guardian name must be at most 50 characters")
        .required("Guardian is required"),
      gender: Yup.string().required("Gender is required"),
      DOB: Yup.date().nullable().required("Date of Birth is required"),
      presentAddress: Yup.object({
        area: Yup.string()
          .matches(
            /^[a-zA-Z\s#\/-]*$/,
            "Area can only contain letters, spaces, and the special characters #, /, -"
          )
          .min(3, "Area must be at least 3 characters")
          .max(100, "Area must be at most 100 characters")
          .required("Area is required"),
        city: Yup.string()
          .matches(/^[a-zA-Z\s]*$/, "City can only contain letters and spaces")
          .max(15, "City must be at most 15 characters")
          .min(3, "City must be at least 3 characters")
          .required("City is required"),
        state: Yup.string().required("State is required"),
        pincode: Yup.string()
          .matches(/^\d{6}$/, "Pincode must be a 6-digit numeric code")
          .required("Pincode is required"),
      }),
      permanentAddress: Yup.object({
        area: Yup.string()
          .matches(
            /^[a-zA-Z\s#\/-]*$/,
            "Area can only contain letters, spaces, and the special characters #, /, -"
          )
          .min(3, "Area must be at least 3 characters")
          .max(100, "Area must be at most 100 characters")
          .required("Area is required"),
        city: Yup.string()
          .matches(/^[a-zA-Z\s]*$/, "City can only contain letters and spaces")
          .max(15, "City must be at most 15 characters")
          .min(3, "City must be at least 3 characters")
          .required("City is required"),
        state: Yup.string().required("State is required"),
        pincode: Yup.string()
          .matches(/^\d{6}$/, "Pincode must be a 6-digit numeric code")
          .required("Pincode is required"),
      }),
      aadharNumber: Yup.string()
        .matches(/^\d{12}$/, "Aadhar number must be a 12-digit numeric code")
        .required("Aadhar Number is required"),
        panNumber: Yup.string()
        .matches(
          /^[A-Z]{3}-P-[A-Z]{1}-\d{4}-[A-Z]{1}$/,
          "PAN card must follow the format: AAA-P-A-5555-A"
        )
        .length(10, "PAN card must be exactly 10 characters"),
      aadharPic:  Yup.mixed()
              .nullable()
              .test(
                "fileFormat",
                "Photo must be in JPG, JPEG, or PNG format",
                (value) => {
                  if (!value || !(value instanceof File)) return true; // Allow empty/null value
      
                  const supportedFormats = ["image/jpeg", "image/jpg", "image/png"];
                  return supportedFormats.includes(value.type);
                }
              )
              .test("fileSize", "Photo size must not exceed 2MB", (value) => {
                if (!value || !(value instanceof File)) return true; // Allow empty/null value
      
                const maxSizeInBytes = 2 * 1024 * 1024;
                return value.size <= maxSizeInBytes;
              }),
      panCardPic:  Yup.mixed()
              .nullable()
              .test(
                "fileFormat",
                "Photo must be in JPG, JPEG, or PNG format",
                (value) => {
                  if (!value || !(value instanceof File)) return true; // Allow empty/null value
      
                  const supportedFormats = ["image/jpeg", "image/jpg", "image/png"];
                  return supportedFormats.includes(value.type);
                }
              )
              .test("fileSize", "Photo size must not exceed 2MB", (value) => {
                if (!value || !(value instanceof File)) return true; // Allow empty/null value
      
                const maxSizeInBytes = 2 * 1024 * 1024;
                return value.size <= maxSizeInBytes;
              }),
    }),
    Yup.object({
      amount: Yup.string()
        .matches(
          /^\d{1,10}$/, // Matches only integers with up to 10 digits
          "Amount must be a numeric value within 10 digits and should not have decimals"
        )
        .required("Package amount is required"),
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
          "Account number must be 8-18 digits",
          function (value) {
            return this.parent.paymentMode === "online"
              ? /^\d{8,18}$/.test(value || "")
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
        .test("ifsc-code-required", "IFSC code is required", function (value) {
          return this.parent.paymentMode === "online" ? !!value : true;
        })
        .test(
          "ifsc-code-valid",
          "Invalid IFSC code (format: 4 letters, 0, 6 alphanumeric)",
          function (value) {
            return this.parent.paymentMode === "online"
              ? /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value || "")
              : true;
          }
        )
        .length(11, "IFSC code must be exactly 11 characters long"),
      bankName: Yup.string().test(
        "bank-name-required",
        "Bank name is required",
        function (value) {
          return this.parent.paymentMode === "online" ? !!value : true;
        }
      ),
      bankPassbook: Yup.mixed()
        .nullable()
        .test(
          "fileFormat",
          "Photo must be in JPG, JPEG, or PNG format",
          (value) => {
            if (!value) return true; // If no file is uploaded, skip the test
            const supportedFormats = ["image/jpeg", "image/jpg", "image/png"];

            // Check MIME type first
            if (supportedFormats.includes(value.type)) {
              return true; // Valid MIME type
            }

            // If MIME type is incorrect, check the file extension as a fallback
            const fileExtension = value.name.split(".").pop().toLowerCase();
            const supportedExtensions = ["jpg", "jpeg", "png"];
            return supportedExtensions.includes(fileExtension); // Check file extension
          }
        )
        .test("fileSize", "Photo size must not exceed 2MB", (value) => {
          if (!value) return true; // If no file is uploaded, skip the test
          const maxSizeInBytes = 2 * 1024 * 1024; // 2MB in bytes
          return value.size <= maxSizeInBytes; // Check if file size is within limit
        }),
    }),
  ];

  const handleNext = (values) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (values) => {
    try {
      const finalData = {
        ...formData,
        ...values,
        confirmAccountNumber: undefined,
      };
      let response = values._id
        ? await updateData(STAFF + "/" + values._id, finalData)
        : await postData(STAFF, finalData);
      handleApiResponse(response.data.message, "success");
      getStaff();
      onClose();
    } catch (error) {
      handleApiResponse(error);
    }
  };

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
          console.log(errors),
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
                          <Stepper
                            steps={stepContent}
                            currentStep={currentStep}
                          />
                          <div className="form-content mt-4">
                            {currentStep === 1 && (
                              <StaffInfo
                                values={values}
                                setFieldValue={setFieldValue}
                              />
                            )}
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
                              {currentStep === 3 ? "Submit" : "Next"}
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
  );
}

export default Staff;
