import { DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { postData, updateData } from "../../app/api";
import { STUDENT } from "../../app/url";
import { handleApiResponse } from "../../commonComponent/CommonFunctions";
import Stepper from "../../commonComponent/StepperComponent";
import SchoolDetailsTab from "./AcademicDetails";
import BasicInfo from "./BasicInfo";
import FeeDetailsTab from "./FeeDetails";

function Student({ onClose, loadStudents }) {
  const { selectedStudent } = useSelector((state) => state.students);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    profilePic: null,
    firstName: "",
    lastName: "",
    DOB: "",
    gender: "",
    nationality: "",
    religion: "",
    cast: "",
    subCast: "",
    bloodGroup: "",
    aadharNumber: "",
    aadharPic: null,
    fatherDetails: {
      name: "",
      mobileNumber: "",
      occupation: "",
      email: "",
    },
    motherDetails: {
      name: "",
      mobileNumber: "",
      occupation: "",
      email: "",
    },
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
    parentIdProof: null,
    //academic tab
    academics: {
      academicYear: "",
      class: "",
      section: "",
    },
    admissionNumber: "",
    admissionDate: "",
    previousSchool: {
      schoolName: "",
      yearOfStudy: "",
      totalMarks: "",
      classStudied: "",
      studyProof: null,
    },
    //fees tab
    fees: [],
    ...(selectedStudent && selectedStudent),
    ...(selectedStudent && {
      academics: {
        ...selectedStudent.academics,
        academicYear:selectedStudent.academics.academicYear?._id,
        class: selectedStudent.academics.class?._id,
        classObj: selectedStudent.academics.class,
        section: selectedStudent.academics.section?._id,
        sectionObj: selectedStudent.academics.section,
      },
      fees: selectedStudent.fees?.feeList || [],
    }),
  });
  // Validation schemas for each step
  const validationSchemas = [
    Yup.object({
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
      gender: Yup.string().required("Gender is required"),
      nationality: Yup.string(),
      religion: Yup.string(),
      cast: Yup.string(),
      subCast: Yup.string(),
      bloodGroup: Yup.string(),
      fatherDetails: Yup.object({
        name: Yup.string()
          .matches(
            /^[a-zA-Z\s]*$/,
            "Father Name can only contain letters and spaces"
          )
          .min(3, "Father Name must be at least 3 characters")
          .max(50, "Father Name must be at most 50 characters")
          .required("Father's Name is required"),
        mobileNumber: Yup.string()
          .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
          .required("Fathers mobile number is required"),
        occupation: Yup.string(),
        email: Yup.string().email("Enter a valid email address").nullable(),
      }),
      motherDetails: Yup.object({
        name: Yup.string()
          .matches(
            /^[a-zA-Z\s]*$/,
            "Mother Name can only contain letters and spaces"
          )
          .min(3, "Mother Name must be at least 3 characters")
          .max(50, "Mother Name must be at most 50 characters"),
        mobileNumber: Yup.string().matches(
          /^[0-9]{10}$/,
          "Mobile number must be 10 digits"
        ),
        occupation: Yup.string(),
        email: Yup.string().email("Enter a valid email address").nullable(),
      }),
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
          .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
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
        state: Yup.string().required("Permanent state is required"),
        pincode: Yup.string()
          .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
          .required("Permanent Pincode is required"),
      }),
      aadharNumber: Yup.string()
        .matches(/^\d{12}$/, "Aadhar number must be a 12-digit numeric code")
        .required("Aadhar Number is required"),
      DOB: Yup.date().nullable().required("Date of Birth is required"), // For invalid dates
      profilePic: Yup.mixed()
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

      aadharPic: Yup.mixed()
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
      parentIdProof: Yup.mixed()
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
      academics: Yup.object({
        academicYear: Yup.string().required("Academic year is required"),
        class: Yup.string().required("Class is required"),
        section: Yup.string().required("Section is required"),
      }),
      admissionNumber: Yup.string()
        .matches(
          /^[a-zA-Z0-9]*$/,
          "Admission number can only contain letters and numbers"
        )
        .max(10, "Admission number must be at most 10 characters")
        .required("Admission number is required"),
      admissionDate: Yup.date()
        .nullable()
        .required("Admission date is required"),
      aadharNumber: Yup.string()
        .matches(/^[0-9]{12}$/, "Aadhar number must be 12 digits")
        .required("Aadhar number is required"),
      DOB: Yup.date().nullable().required("Date of Birth is required"), // For invalid dates
      previousSchool: Yup.object({
        schoolName: Yup.string()
          .matches(
            /^[a-zA-Z\s]*$/,
            "School name can only contain letters and spaces"
          )
          .min(3, "School name must be at least 3 characters")
          .max(50, "School name must be at most 50 characters"),
        yearOfStudy: Yup.string(),
        totalMarks: Yup.number().nullable(),
        classStudied: Yup.string()
          .matches(
            /^[a-zA-Z0-9\s]*$/,
            "Class name can only contain letters, numbers, and spaces"
          )
          .max(50, "Class name must be at most 50 characters"),
        studyProof: Yup.mixed()
          .test(
            "fileSize",
            "File size must be less than 2MB",
            (value) => !value || (value && value.size <= 2 * 1024 * 1024) // 2MB in bytes
          )
          .test(
            "fileFormat",
            "Only JPG, JPEG, PNG, and PDF formats are allowed",
            (value) =>
              !value ||
              (value &&
                ["image/jpeg", "image/png", "application/pdf"].includes(
                  value.type
                ))
          )
          .nullable(),
      }),
    }),
    Yup.object({
      fees: Yup.array()
        .of(
          Yup.object().shape({
            isChecked: Yup.boolean(),
            discount: Yup.number()
              .min(0, "Discount must be at least 0")
              .max(9999, "Discount must be a numeric value up to 4 digits"),
            feeName: Yup.string(),
            installmentAmount: Yup.number(),
            totalFee: Yup.number(),
            feeType: Yup.string().test(
              "is-required-if-checked",
              "Duration is required",
              function (value) {
                const { isChecked } = this.parent; 
                if (isChecked && !value) {
                  return false; 
                }
                return true;
              }
            ),
            dueDate: Yup.string().test(
              "is-required-if-checked",
              "Due date is required",
              function (value) {
                const { isChecked } = this.parent; // Access sibling field 'checked'
                if (isChecked && !value) {
                  return false; // Fail validation if checked but amount is invalid
                }
                return true; // Pass validation otherwise
              }
            ),
          })
        )
        .test(
          "at-least-one-checked",
          "At least one fee must be selected",
          (items) => items.some((item) => item.isChecked)
        ),
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
    const finalData = { ...formData, ...values };
    try {
      let response = values._id
        ? await updateData(STUDENT + "/" + values._id, finalData)
        : await postData(STUDENT, finalData);
      handleApiResponse(response.data.message, "success");
      loadStudents();
      onClose();
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const stepContent = [
    { id: 1, name: "Basic Info", href: "#", status: "current" },
    { id: 2, name: "Academic Details", href: "#", status: "upcoming" },
    { id: 3, name: "Fee details", href: "#", status: "upcoming" },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <Formik
        initialValues={formData}
        validationSchema={validationSchemas[currentStep - 1]}
        onSubmit={currentStep === 3 ? handleSubmit : handleNext}
      >
        {({ values, setFieldValue, errors }) => (
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
                              Add Student
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
                              <BasicInfo
                                values={values}
                                setFieldValue={setFieldValue}
                              />
                            )}
                            {currentStep === 2 && (
                              <SchoolDetailsTab
                                values={values}
                                setFieldValue={setFieldValue}
                              />
                            )}
                            {currentStep === 3 && (
                              <FeeDetailsTab
                                errors={errors}
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

export default Student;
