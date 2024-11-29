import React from 'react'

import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import CustomInput from "../commonComponent/CustomInput";
import CustomSelect from "../commonComponent/CustomSelect";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setFormData } from "../app/reducers/appConfigSlice";
import { useDispatch, useSelector } from "react-redux";

function Old({goNext}) {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.appConfig);
  const [value, setValue] = useState({});
  const [file, setFile] = useState(null);

  const notificationMethods = ["Male", "Female", "Other"];

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
    
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      
        }),
    onSubmit: (values) => {
     
    },
  });

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    formik.setFieldValue("fileUpload", event.target.files[0]);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="">
          <div className="border-b border-gray-900/10 pb-4 mb-4">
            <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
              Personal Details
            </h2>
            <div className=" grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
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
                <CustomInput
                  name="firstName"
                  label="Student First Name"
                  placeholder="Enter First Name"
                  type="text"
                  required={true}
                  {...formik.getFieldProps("firstName")}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="text-red-500">{formik.errors.firstName}</div>
                )}
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  name="lastName"
                  label="Student last Name"
                  placeholder="Enter First Name"
                  type="text"
                  required={true}
                  {...formik.getFieldProps("lastName")}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="text-red-500">{formik.errors.lastName}</div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="DOB"
                  className="block text-sm/6 font-regular text-gray-900"
                >
                  DOB<span className="pl-1 text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <Datepicker
                    inputClassName="inline-block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                    primaryColor={"purple"}
                    useRange={false}
                    asSingle={true}
                    value={formik.values.DOB}
                    onChange={(newValue) => formik.setFieldValue("DOB", newValue)}
                  />
                      {formik.touched.DOB && formik.errors.DOB && (
      <div className="text-red-500 mt-1">{formik.errors.DOB}</div>
    )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="street-address"
                  className="block text-sm/6 font-regular text-gray-900"
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
                          className="size-4 border-gray-300 text-purple-600 focus:ring-purple-600"
                          {...formik.getFieldProps("gender")}
                        />
                        <label
                          htmlFor={gender}
                          className="ml-3 block text-sm/6 font-regular text-gray-900"
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

              <div className="sm:col-span-1">
                <CustomSelect
                  id="nationality"
                  name="nationality"
                  label="Nationality"
                  options={[
                    { value: "nationality1", label: "Nationality 1" },
                    { value: "nationality2", label: "Nationality 2" },
                    { value: "nationality3", label: "Nationality 3" },
                  ]}
                  {...formik.getFieldProps("nationality")}
                />
                {formik.touched.nationality && formik.errors.nationality && (
                  <div className="text-red-500">
                    {formik.errors.nationality}
                  </div>
                )}
              </div>

              <div className="sm:col-span-1">
                <CustomSelect
                  id="religion"
                  name="religion"
                  label="Religion"
                  options={[
                    { value: "hindu", label: "Hindu" },
                    { value: "muslim", label: "Muslim " },
                    { value: "jain", label: "Jain " },
                  ]}
                  {...formik.getFieldProps("religion")}
                />
                {formik.touched.religion && formik.errors.religion && (
                  <div className="text-red-500">{formik.errors.religion}</div>
                )}
              </div>

              <div className="sm:col-span-1">
                <CustomSelect
                  id="cast"
                  name="cast"
                  label="Cast"
                  options={[
                    { value: "bc", label: "BC" },
                    { value: "obc", label: "OBC" },
                    { value: "sc", label: "SC" },
                  ]}
                  {...formik.getFieldProps("cast")}
                />
                {formik.touched.cast && formik.errors.cast && (
                  <div className="text-red-500">{formik.errors.cast}</div>
                )}
              </div>

              <div className="sm:col-span-1">
                <CustomSelect
                  id="subCast"
                  name="subCast"
                  label="Sub Caste"
                  options={[
                    { value: "subCast1", label: "Sub Caste 1" },
                    { value: "subCast2", label: "Sub Caste 2" },
                    { value: "subCast3", label: "Sub Caste 3" },
                  ]}
                  {...formik.getFieldProps("subCast")}
                />
                {formik.touched.subCast && formik.errors.subCast && (
                  <div className="text-red-500">{formik.errors.subCast}</div>
                )}
              </div>

              <div className="sm:col-span-2">
                <CustomSelect
                  id="bloodGroup"
                  name="bloodGroup"
                  label="Blood Group"
                  options={[
                    { value: "bloodGroup1", label: "AB" },
                    { value: "bloodGroup2", label: "AB+" },
                    { value: "bloodGroup3", label: "O+" },
                  ]}
                  {...formik.getFieldProps("bloodGroup")}
                />
                {formik.touched.bloodGroup && formik.errors.bloodGroup && (
                  <div className="text-red-500">{formik.errors.bloodGroup}</div>
                )}
              </div>

              <div className="sm:col-span-2">
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
                {file && <div className="text-sm text-gray-700 mt-2">{file.name}</div>}
                      {formik.touched.fileUpload && formik.errors.fileUpload && (
                        <div className="text-red-500 mt-2">{formik.errors.fileUpload}</div>
                      )}
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-4 mb-4">
            <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
              Father Details
            </h2>
            <div className=" grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
              <div className="sm:col-span-2">
                <CustomInput
                  id="fatherName"
                  name="fatherName"
                  label="Father Full Name"
                  placeholder="Enter Name"
                  type="text"
                  required={true}
                  {...formik.getFieldProps("fatherName")}
                />
                {formik.touched.fatherName && formik.errors.fatherName && (
                  <div className="text-red-500">{formik.errors.fatherName}</div>
                )}
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  id="fatherMobileNbr"
                  name="fatherMobileNbr"
                  label="Mobile Number"
                  placeholder="Enter mobile"
                  required={true}
                  type="text"
                  {...formik.getFieldProps("fatherMobileNbr")}
                />
                {formik.touched.fatherMobileNbr &&
                  formik.errors.fatherMobileNbr && (
                    <div className="text-red-500">
                      {formik.errors.fatherMobileNbr}
                    </div>
                  )}
              </div>

              <div className="sm:col-span-2">
                <CustomSelect
                  id="fatherOccupation"
                  name="fatherOccupation"
                  label="Occupation"
                  options={[
                    { value: "occupation1", label: "Occupation 1" },
                    { value: "occupation2", label: "Occupation 2" },
                    { value: "occupation3", label: "Occupation 3" },
                  ]}
                  {...formik.getFieldProps("fatherOccupation")}
                />
                {formik.touched.fatherOccupation &&
                  formik.errors.fatherOccupation && (
                    <div className="text-red-500">
                      {formik.errors.fatherOccupation}
                    </div>
                  )}
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  id="fatherEmail"
                  name="fatherEmail"
                  label="Father Email"
                  placeholder="Enter email"
                  autoComplete="email"
                  type="email"
                  required={true}
                  {...formik.getFieldProps("fatherEmail")}
                />
                {formik.touched.fatherEmail && formik.errors.fatherEmail && (
                  <div className="text-red-500">
                    {formik.errors.fatherEmail}
                  </div>
                )}
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


        </div>
        <button type="submit" className="bg-purple-600 px-3 py-2 text-sm font-semibold text-white"
        >Save</button>
      </form>
    </>
  );
}

export default Old;
