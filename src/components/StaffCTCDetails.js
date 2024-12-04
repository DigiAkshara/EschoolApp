import React, { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Datepicker from "react-tailwindcss-datepicker";
import CustomInput from "../commonComponent/CustomInput";
import CustomSelect from "../commonComponent/CustomSelect";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setFormData } from "../app/reducers/appConfigSlice";
import { useDispatch, useSelector } from "react-redux";


function StaffCTCDetails({ goNext, onPrevious, setFormRef }) {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);


  const [studyFile, setStudyFile] = useState(null);
  const { formData } = useSelector((state) => state.appConfig);

  const formik = useFormik({
    initialValues: {
      academicYear: "",
      DOA: null,
      admissionNbr: "",
      class: "",
      section: "",
      yearOfStudy: "",
      schoolName: "",
      className: "",
      totalMarks: "",
      certificateUpload: null,
    },
    validationSchema: Yup.object({
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
      onSubmit: (values) => {
        const updatedData = { ...formData };
        updatedData.prevSchoolDetails = values
        console.log("UPDATED data:", updatedData);
        dispatch(setFormData(updatedData))
        console.log("FORM dATA IS : ", formData);
        goNext();
    },
  });

  React.useEffect(() => {
    if (setFormRef) {
      setFormRef(formik);
    }
  }, [setFormRef]);

  
  const handleFileChange = (event) => {
    setStudyFile(event.target.files[0]);
    formik.setFieldValue("certificateUpload", event.target.files[0]);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="">
        <div className="border-b border-gray-900/10 pb-4 mb-4">
        <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
        Bank Details
            </h2>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="sm:col-span-2">
                <CustomInput
                  name="accountNumber"
                  label="Account number"
                  placeholder="Enter Account number"
                  type="text"
                  required={true}
                  {...formik.getFieldProps("accountNumber")}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="text-red-500">{formik.errors.firstName}</div>
                )}
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  name="reAccountNumber"
                  label="Re-Enter Account number"
                  placeholder="Enter Account number"
                  type="text"
                  required={true}
                  {...formik.getFieldProps("reAccountNumber")}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="text-red-500">{formik.errors.lastName}</div>
                )}
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  name="ifscCode"
                  label="IFSC code"
                  placeholder="Enter IFSC"
                  type="text"
                  required={true}
                  {...formik.getFieldProps("ifscCode")}
                />
                {formik.touched.ifscCode && formik.errors.ifscCode && (
                  <div className="text-red-500">{formik.errors.ifscCode}</div>
                )}
              </div>

              <div className="sm:col-span-2">
                <CustomSelect
                  id="bankName"
                  name="bankName"
                  label="Bank Name"
                  required={true}
                  options={[
                    { value: "bankName1", label: "Bank Name 1" },
                    { value: "bankName2", label: "Bank Name 2" },
                    { value: "bankName3", label: "Bank Name 3" },
                  ]}
                  {...formik.getFieldProps("bankName")}
                />
                {formik.touched.bankName && formik.errors.bankName && (
                  <div className="text-red-500">
                    {formik.errors.bankName}
                  </div>
                )}
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="file-upload"
                  className="block text-sm/6 font-regular text-gray-900"
                >
                  Upload Bank Passbook 
                  <span className="pl-1 text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <div className="mt-2 flex justify-center rounded-lg bg-gray-50 border border-dashed border-gray-900/25 px-4 py-4">
                    <div className="flex items-center">
                      <PhotoIcon
                        aria-hidden="true"
                        className="mx-auto size-12 text-gray-300"
                      />
                      <div className="ml-4">
                        <div className="flex text-sm/6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"
                          >
                            <span>Upload a file </span>
                            <input
                              id="file-upload"
                              name="fileUpload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                              accept=".jpg,.jpeg,.png,.pdf"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs/5 text-gray-600">
                          PNG, JPG, up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {file && (
                  <div className="text-sm text-gray-700 mt-2">{file.name}</div>
                )}
                {formik.touched.fileUpload && formik.errors.fileUpload && (
                  <div className="text-red-500 mt-2">
                    {formik.errors.fileUpload}
                  </div>
                )}
              </div>

                         
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-4 mb-4">
        <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
          Payroll Details
            </h2>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          
            <div className="sm:col-span-4">
                <CustomSelect
                  id="payroll"
                  name="payroll"
                  label="Select Payroll"
                  required={true}
                  options={[
                    { value: "payroll1", label: "Payroll 1" },
                    { value: "payroll2", label: "Payroll 2" },
                    { value: "payroll3", label: "Payroll 3" },
                  ]}
                  {...formik.getFieldProps("bankName")}
                />
                {formik.touched.bankName && formik.errors.bankName && (
                  <div className="text-red-500">
                    {formik.errors.bankName}
                  </div>
                )}
              </div>
          </div>
        </div>

      </div>
    </form>
  );
}

export default StaffCTCDetails;
