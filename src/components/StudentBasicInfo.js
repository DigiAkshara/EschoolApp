import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import CustomInput from "../commonComponent/CustomInput";
import CustomSelect from "../commonComponent/CustomSelect";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setFormData } from "../app/reducers/appConfigSlice";
import { useDispatch, useSelector } from "react-redux";

function BasicInfo({ goNext, setFormRef }) {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.appConfig);
  const [value, setValue] = useState({});
  const [file, setFile] = useState(null);
  const [parentID, setParentID] = useState(null);

  const notificationMethods = ["Male", "Female", "Other"];

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      DOB: null,
      gender: "",
      nationality: "",
      religion: "",
      cast: "",
      subCast: "",
      bloodGroup: "",
      aadhar: "",
      fileUpload: null,
      fatherName: "",
      fatherMobileNbr: "",
      fatherOccupation: "",
      fatherEmail: "",
      motherName: "",
      mobileNbrMother: "",
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
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      gender: Yup.string().required("Gender is required"),
      nationality: Yup.string().required("Nationality is required"),
      religion: Yup.string().required("Religion is required"),
      cast: Yup.string().required("cast is required"),
      subCast: Yup.string().required("subCast is required"),
      bloodGroup: Yup.string().required("bloodGroup is required"),
      nationality: Yup.string().required("Nationality is required"),
      fatherName: Yup.string().required("Father's Name is required"),
      fatherMobileNbr: Yup.string().required(
        "Fathers mobile number is required"
      ),
      fatherOccupation: Yup.string().required("Fathers Occupation is required"),
      fatherEmail: Yup.string().required("Fathers Email is required"),
      motherName: Yup.string().required("Mother's Name is required"),
      mobileNbrMother: Yup.string().required("Mother's mobile nbr is required"),
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
      aadhar: Yup.string()
        .matches(/^[0-9]{12}$/, "Aadhar number must be 12 digits")
        .required("Aadhar number is required"),
      // DOB: Yup.date()
      //   .nullable() // Allow null value initially
      //   .required("Date of Birth is required"),
      // .typeError("Invalid date format"), // For invalid dates
      fileUpload: Yup.mixed()
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
    onSubmit: (values) => {
      // console.log("Submitting Basic Info:", values);
      //   dispatch(setFormData({ basicInfo: values }));
      let data = {...formData}
      data.basicInfo=values
      console.log("basic info:",data);
      
      dispatch(setFormData(data))
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
    setFile(event.target.files[0]);
    formik.setFieldValue("fileUpload", event.target.files[0]);
  };

  const handleParentIDFileChange = (event) => {
    setParentID(event.target.files[0]);
    formik.setFieldValue("uploadParentID", event.target.files[0]);
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

              {/* <div className="sm:col-span-2">
                <label
                  htmlFor="DOB"
                  className="block text-sm/6 font-regular text-gray-900"
                >
                  DOB<span className="pl-1 text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <Datepicker
                    inputClassName="inline-block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                    primaryColor="purple"
                    useRange={false}
                    asSingle={true}
                    value={formik.values.DOB}
                    onChange={(newValue) => {
                      const date = newValue?.startDate || null; // Extract the startDate
                      formik.setFieldValue("DOB", date); // Update the Formik value
                    }}
                  />
                  {formik.touched.DOB && formik.errors.DOB && (
                    <div className="text-red-500 mt-1">{formik.errors.DOB}</div>
                  )}
                </div>
              </div> */}
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
              Mother Details
            </h2>
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
              <div className="sm:col-span-2">
                <CustomInput
                  id="motherName"
                  name="motherName"
                  label="Mother Full Name"
                  placeholder="Enter Name"
                  type="text"
                  required={true}
                  {...formik.getFieldProps("motherName")}
                />
                {formik.touched.motherName && formik.errors.motherName && (
                  <div className="text-red-500">{formik.errors.motherName}</div>
                )}
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  id="mobileNbrMother"
                  name="mobileNbrMother"
                  label="Mobile Number"
                  placeholder="Enter mobile"
                  type="text"
                  required={true}
                  {...formik.getFieldProps("mobileNbrMother")}
                />
                {formik.touched.mobileNbrMother &&
                  formik.errors.mobileNbrMother && (
                    <div className="text-red-500">
                      {formik.errors.mobileNbrMother}
                    </div>
                  )}
              </div>

              <div className="sm:col-span-2">
                <CustomSelect
                  id="motherOccupation"
                  name="motherOccupation"
                  label="Occupation"
                  options={[
                    { value: "occupation1", label: "Occupation 1" },
                    { value: "occupation2", label: "Occupation 2" },
                    { value: "occupation3", label: "Occupation 3" },
                  ]}
                  {...formik.getFieldProps("motherOccupation")}
                />
                {formik.touched.motherOccupation &&
                  formik.errors.motherOccupation && (
                    <div className="text-red-500">
                      {formik.errors.motherOccupation}
                    </div>
                  )}
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  id="motherEmail"
                  name="motherEmail"
                  label="Mother Email"
                  placeholder="Enter email"
                  autoComplete="email"
                  type="text"
                  required={true}
                  {...formik.getFieldProps("motherEmail")}
                />
                {formik.touched.motherEmail && formik.errors.motherEmail && (
                  <div className="text-red-500">
                    {formik.errors.motherEmail}
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

              <div className="sm:col-span-4">
                <label
                  htmlFor="uploadParentID"
                  className="block text-sm/6 font-regular text-gray-900"
                >
                  Upload Parents ID Proofs
                  <span className="pl-1 text-red-500">*</span>
                </label>
                <div className="mt-2 flex justify-center rounded-lg bg-gray-50 border border-dashed border-gray-900/25 px-4 py-4">
                  <div className="flex items-center">
                    <PhotoIcon
                      aria-hidden="true"
                      className="mx-auto size-12 text-gray-300"
                    />
                    <div className="ml-4">
                      <div className="flex text-sm/6 text-gray-600">
                        <label
                          htmlFor="uploadParentID"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="uploadParentID"
                            name="uploadParentID"
                            type="file"
                            className="sr-only"
                            onChange={handleParentIDFileChange}
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
                {formik.values.uploadParentID && (
                  <div className="text-sm text-gray-700 mt-2">
                    {formik.values.uploadParentID.name}
                  </div>
                )}
                {formik.touched.uploadParentID &&
                  formik.errors.uploadParentID && (
                    <div className="text-red-500 mt-2">
                      {formik.errors.uploadParentID}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
        <button type="submit" hidden />

      </form>
    </>
  );
}

export default BasicInfo;
