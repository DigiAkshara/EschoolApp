import React, { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Datepicker from "react-tailwindcss-datepicker";
import CustomInput from "../commonComponent/CustomInput";
import CustomSelect from "../commonComponent/CustomSelect";
import {  UserCircleIcon } from "@heroicons/react/24/solid";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setFormData } from "../app/reducers/appConfigSlice";
import { useDispatch, useSelector } from "react-redux";


function StaffPersonalDetails({ goNext, onPrevious, setFormRef }) {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);


  const [studyFile, setStudyFile] = useState(null);
  const { formData } = useSelector((state) => state.appConfig);
  const notificationMethods = ["Male", "Female", "Other"];

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
              Staff Personal Details
            </h2>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="col-span-full">
                <label
                  htmlFor="first-name"
                  className="block text-sm/6 font-regular text-gray-900"
                >
                  Passport Size Photo
                  <span className="pl-1 text-red-500">*</span>
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <UserCircleIcon
                    aria-hidden="true"
                    className="size-12 text-gray-300"
                  />
                  <button
                    type="button"
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="DOB"
                  className="block text-sm/6 font-regular text-gray-900"
                >
                  Date Of Joining<span className="pl-1 text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <Datepicker
                    inputClassName="inline-block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                    primaryColor={"purple"}
                    useRange={false}
                    asSingle={true}
                    value={formik.values.DOB}
                    onChange={(newValue) =>
                      formik.setFieldValue("DOB", newValue)
                    }
                  />
                  {/* {formik.touched.DOB && formik.errors.DOB && (
                    <div className="text-red-500 mt-1">{formik.errors.DOB}</div>
                  )} */}
                </div>
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  id="email"
                  name="email"
                  label="Personal Email"
                  placeholder="Enter email"
                  autoComplete="email"
                  type="email"
                  required={true}
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500">
                    {formik.errors.email}
                  </div>
                )}
              </div>
         
              <div className="sm:col-span-2">
                <CustomInput
                  name="guardian"
                  label="Father / Guardian "
                  placeholder="Enter Guardian "
                  type="text"
                  required={true}
                  {...formik.getFieldProps("guardian")}
                />
                {formik.touched.guardian && formik.errors.guardian && (
                  <div className="text-red-500">{formik.errors.guardian}</div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="street-address"
                  className="block text-sm font-regular text-gray-900"
                >
                  Gender<span className="pl-1 text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <div className="space-y-6 sm:flex sm:items-center sm:space-x-4 sm:space-y-0">
                    {notificationMethods.map((gender) => (
                      <div key={gender} className="flex items-center">
                        <input
                          type="radio"
                          id={gender}
                          name="gender"
                          value={gender}
                          checked={formik.values.gender === gender} // Explicitly check if the value matches
                          onChange={formik.handleChange} // Use Formik's handleChange for updates
                          className="size-4 border-gray-300 text-purple-600 focus:ring-purple-600"
                        />
                        <label
                          htmlFor={gender}
                          className="ml-3 block text-sm font-regular text-gray-900"
                        >
                          {gender}
                        </label>
                      </div>
                    ))}
                  </div>
                  {formik.touched.gender && formik.errors.gender && (
                    <div className="text-red-500 mt-1">
                      {formik.errors.gender}
                    </div>
                  )}
                </div>
              </div>              
           
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-4 mb-4">
            <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
              Present Address Details
            </h2>
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
              <div className="sm:col-span-2">
                <CustomInput
                  id="area"
                  name="area"
                  label="Area"
                  placeholder="Enter Area"
                  type="text"
                  required={true}
                  {...formik.getFieldProps("area")}
                />
                {formik.touched.area && formik.errors.area && (
                  <div className="text-red-500">{formik.errors.area}</div>
                )}
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  id="city"
                  name="city"
                  label="City"
                  placeholder="Enter City"
                  type="text"
                  required={true}
                  {...formik.getFieldProps("city")}
                />
                {formik.touched.city && formik.errors.city && (
                  <div className="text-red-500">{formik.errors.city}</div>
                )}
              </div>

              <div className="sm:col-span-2">
                <CustomSelect
                  id="state"
                  name="state"
                  label="State"
                  options={[
                    { value: "andhra_pradesh", label: "Andhra Pradesh" },
                    { value: "telangana", label: "Telangana" },
                    { value: "tamil_nadu", label: "Tamil Nadu" },
                  ]}
                  required={true}
                  {...formik.getFieldProps("state")}
                />
                {formik.touched.state && formik.errors.state && (
                  <div className="text-red-500">{formik.errors.state}</div>
                )}
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  id="pincode"
                  name="pincode"
                  label="Pincode"
                  placeholder="Enter Pincode"
                  type="text"
                  required={true}
                  {...formik.getFieldProps("pincode")}
                />
                {formik.touched.pincode && formik.errors.pincode && (
                  <div className="text-red-500">{formik.errors.pincode}</div>
                )}
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-4 mb-4">
            <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
              Permanent Address Details
            </h2>
            <div className="relative flex items-start mb-4">
              <div className="flex h-6 items-center">
                <input
                  id="sameAsPresent"
                  name="sameAsPresent"
                  type="checkbox"
                  aria-describedby="sameAsPresent-description"
                  className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                />
              </div>
              <div className="ml-3 text-sm/6">
                <label
                  htmlFor="sameAsPresent"
                  className="font-regular text-gray-900"
                >
                  Same as Present Address
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
              <div className="sm:col-span-2">
                <CustomInput
                  id="permanentArea"
                  name="permanentArea"
                  label="Area"
                  placeholder="Enter Area"
                  type="text"
                  required={true}
                  {...formik.getFieldProps("permanentArea")}
                />
                {formik.touched.permanentArea &&
                  formik.errors.permanentArea && (
                    <div className="text-red-500">
                      {formik.errors.permanentArea}
                    </div>
                  )}
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  id="permanentCity"
                  name="permanentCity"
                  label="City"
                  placeholder="Enter City"
                  required={true}
                  type="text"
                  {...formik.getFieldProps("permanentCity")}
                />
                {formik.touched.permanentCity &&
                  formik.errors.permanentCity && (
                    <div className="text-red-500">
                      {formik.errors.permanentCity}
                    </div>
                  )}
              </div>

              <div className="sm:col-span-2">
                <CustomSelect
                  id="permanentState"
                  name="permanentState"
                  label="State"
                  options={[
                    { value: "andhra_pradesh", label: "Andhra Pradesh" },
                    { value: "telangana", label: "Telangana" },
                    { value: "tamil_nadu", label: "Tamil Nadu" },
                  ]}
                  required={true}
                  {...formik.getFieldProps("permanentState")}
                />
                {formik.touched.permanentState &&
                  formik.errors.permanentState && (
                    <div className="text-red-500">
                      {formik.errors.permanentState}
                    </div>
                  )}
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  id="permanentPincode"
                  name="permanentPincode"
                  label="Pincode"
                  placeholder="Enter Pincode"
                  type="text"
                  required={true}
                  {...formik.getFieldProps("permanentPincode")}
                />
                {formik.touched.permanentPincode &&
                  formik.errors.permanentPincode && (
                    <div className="text-red-500">
                      {formik.errors.permanentPincode}
                    </div>
                  )}
              </div>

              
            </div>
            
          </div>
          <div className="border-b border-gray-900/10 pb-4 mb-4">
          <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
              Staff ID Proofs
            </h2>

          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="sm:col-span-4">
                <CustomInput
                  name="aadhar"
                  label="Aadhar number"
                  placeholder="Enter aadhar"
                  required={true}
                  type="text"
                  {...formik.getFieldProps("aadhar")}
                />
                {formik.touched.aadhar && formik.errors.aadhar && (
                  <div className="text-red-500">{formik.errors.aadhar}</div>
                )}
              </div>
              <div className="sm:col-span-4">
                <CustomInput
                  name="aadhar"
                  label="Pan"
                  placeholder="Enter aadhar"
                  required={true}
                  type="text"
                  {...formik.getFieldProps("aadhar")}
                />
                {formik.touched.aadhar && formik.errors.aadhar && (
                  <div className="text-red-500">{formik.errors.aadhar}</div>
                )}
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="file-upload"
                  className="block text-sm/6 font-regular text-gray-900"
                >
                  Upload Student Aadhar Card
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


              <div className="sm:col-span-4">
                <label
                  htmlFor="file-upload"
                  className="block text-sm/6 font-regular text-gray-900"
                >
                  Upload PAN Card
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

      </div>
    </form>
  );
}

export default StaffPersonalDetails;
