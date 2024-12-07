import { DialogPanel, DialogTitle } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import SchoolDetailsTab from "./StudentAcademicDetails";
import BasicInfo from "./StudentBasicInfo";
import FeeDetailsTab from "./StudentFeeDetails";

function Student({ onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
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
    profilePic: null,
    aadharPic: null,
    fatherName: "",
    fatherMobileNumber: "",
    fatherOccupation: "",
    fatherEmail: "",
    motherName: "",
    motherMobileNumber: "",
    motherOccupation: "",
    motherEmail: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    permanentArea: "",
    permanentCity: "",
    permanentState: "",
    permanentPincode: "",
    uploadParentID: null,
    academicYear: "",
    DOA: null,
    admissionNbr: "",
    class: "",
    section: "",
    yearOfStudy: "",
    schoolName: "",
    className: "",
    totalMarks: "",
    certificateUpload: null
  });

  useEffect(() => {
    // Initialize the form data in Redux store
  }, []);

  // Validation schemas for each step
  const validationSchemas = [
    Yup.object({
      firstName: Yup.string()
        .min(3, "First Name must be at least 3 characters")
        .required("First Name is required"),
      lastName: Yup.string()
        .min(3, "Last Name must be at least 3 characters")
        .required("Last Name is required"),
      gender: Yup.string().required("Gender is required"),
      nationality: Yup.string().required("Nationality is required"),
      religion: Yup.string().required("Religion is required"),
      cast: Yup.string().required("cast is required"),
      subCast: Yup.string().required("subCast is required"),
      bloodGroup: Yup.string().required("bloodGroup is required"),
      fatherName: Yup.string().required("Father's Name is required"),
      fatherMobileNumber: Yup.string().matches(/^[0-9]{10}$/, "Mobile number must be 10 digits").required(
        "Fathers mobile number is required"
      ),
      fatherOccupation: Yup.string().required("Fathers Occupation is required"),
      fatherEmail: Yup.string().required("Fathers Email is required"),
      motherName: Yup.string().required("Mother's Name is required"),
      motherMobileNumber: Yup.string().matches(/^[0-9]{10}$/, "Mobile number must be 10 digits").required("Mother's mobile nbr is required"),
      motherOccupation: Yup.string().required(
        "Mother's Occupation is required"
      ),
      motherEmail: Yup.string().required("Mother's email is required"),
      area: Yup.string().required("Artea is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      pincode: Yup.string().required("Pincode is required"),
      permanentArea: Yup.string().required("Permanent Area is required"),
      permanentCity: Yup.string().required("Permanent city is required"),
      permanentState: Yup.string().required("Permanent state is required"),
      permanentPincode: Yup.string().required("Permanent Pincode is required"),
      aadharNumber: Yup.string()
        .matches(/^[0-9]{12}$/, "Aadhar number must be 12 digits")
        .required("Aadhar number is required"),
      DOB: Yup.date()
        .nullable()
        .required("Date of Birth is required"), // For invalid dates
      aadharPic: Yup.mixed()
        .required("Aadhar card file is required")
        .test("fileSize", "File size too large", (value) => {
          return value && value.size <= 10485760; // Max 10 MB
        })
        .test("fileType", "Invalid file type", (value) => {
          return (
            value &&
            ["image/jpeg", "image/png", "application/pdf"].includes(value.type)
          );
        }),
      uploadParentID: Yup.mixed()
        .required("Parent ID proof is required")
        .test(
          "fileSize",
          "File is too large",
          (value) => value && value.size <= 10 * 1024 * 1024
        ) // Max 10MB
        .test(
          "fileType",
          "Only PNG and JPG files are allowed",
          (value) =>
            value && (value.type === "image/png" || value.type === "image/jpeg")
        ),
    }),
    Yup.object({
      academicYear: Yup.string().required("Academic year is required"),
      // DOA: Yup.date()
      //   .nullable()
      //   .required("Date of Admission is required"),
        // .typeError("Invalid date format"),
      admissionNbr: Yup.string()
        .required("Admission number is required")
        .matches(/^[0-9]+$/, "Admission number must be numeric"),
      class: Yup.string().required("Class is required"),
      section: Yup.string().required("Section is required"),
      yearOfStudy: Yup.string().required("Year of study is required"),
      schoolName: Yup.string().required("School name is required"),
      className: Yup.string().required("Class is required"),
      totalMarks: Yup.number()
        .required("Total marks are required")
        .positive("Marks must be positive")
        .integer("Marks must be an integer"),
        certificateUpload: Yup.mixed()
        .required("File upload is required")
        .test(
          "fileType",
          "Only PNG or JPG files are allowed",
          (value) =>
            !value || (value && ["image/png", "image/jpeg"].includes(value.type))
        )
        .test(
          "fileSize",
          "File size must be less than 10MB",
          (value) => !value || (value && value.size <= 10 * 1024 * 1024)
        ),
    }),
    Yup.object({
      comments: Yup.string().required("Comments are required"),
    }),
  ];

  const handleNext = (values) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (values) => {
    const finalData = { ...formData, ...values };
    console.log("Final Data: ", finalData);
    alert("Form submitted successfully!");
  };

  const stepContent = [
    <BasicInfo key={1} />,
    <SchoolDetailsTab key={2} />,
    <FeeDetailsTab key={3} />,
  ];

  // const [open, setOpen] = useState(false);
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
        {({ values }) => (
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
                                          ? "rounded-t-md border-b-0"
                                          : "",
                                        stepIdx === stepContent.length - 1
                                          ? "rounded-b-md border-t-0"
                                          : "",
                                        "overflow-hidden border border-gray-200 lg:border-0"
                                      )}
                                    >
                                      <button
                                        type="button"
                                        // onClick={() =>
                                        //   setActiveStep(parseInt(stepIdx, 10))
                                        // }
                                        className="group w-full"
                                      >
                                        {step.status === "complete" ? (
                                          <a href={'#'} className="group">
                                            <span
                                              aria-hidden="true"
                                              className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                                            />
                                            <span
                                              className={classNames(
                                                stepIdx !== 0 ? "lg:pl-9" : "",
                                                "flex items-center px-4 py-2 text-sm font-medium"
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
                                        ) : step.status === "current" ? (
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
                                                stepIdx !== 0 ? "lg:pl-9" : "",
                                                "flex items-center px-4 py-2 text-xs font-medium"
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
                                                stepIdx !== 0 ? "lg:pl-9" : "",
                                                "flex items-center px-4 py-2 text-xs font-medium"
                                              )}
                                            >
                                              <span className="shrink-0">
                                                <span className="flex size-6 items-center justify-center rounded-full border-2 border-gray-300">
                                                  <span className="text-gray-500">
                                                  {stepIdx + 1}
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
                            {stepContent[currentStep - 1]}
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
