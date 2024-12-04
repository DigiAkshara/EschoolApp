import React, { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Datepicker from "react-tailwindcss-datepicker";
import CustomInput from "../commonComponent/CustomInput";
import CustomSelect from "../commonComponent/CustomSelect";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setFormData } from "../app/reducers/appConfigSlice";
import { useDispatch, useSelector } from "react-redux";


function StaffInfo({ goNext, onPrevious, setFormRef }) {
  const dispatch = useDispatch();
  

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
              Staff Employment Details
            </h2>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="sm:col-span-2">
                <CustomInput
                  name="firstName"
                  label="First Name"
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
                  label="Last Name"
                  placeholder="Enter last Name"
                  type="text"
                  required={true}
                  {...formik.getFieldProps("lastName")}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="text-red-500">{formik.errors.lastName}</div>
                )}
              </div>

              <div className="sm:col-span-2">
                <CustomInput
                  name="lastName"
                  label="Emp ID"
                  placeholder="Enter EmpID"
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
           
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-4 mb-4">

          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
          <div className="sm:col-span-2">
                <CustomInput
                  id="fatherEmail"
                  name="fatherEmail"
                  label="Work Email"
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
          

            

              <div className="sm:col-span-2">
                <CustomSelect
                  id="designation"
                  name="designation"
                  label="Designation"
                  options={[
                    { value: "designation1", label: "Designation 1" },
                    { value: "designation2", label: "Designation 2" },
                    { value: "designation3", label: "Designation 3" },
                  ]}
                  {...formik.getFieldProps("designation")}
                />
                {formik.touched.designation && formik.errors.designation && (
                  <div className="text-red-500">
                    {formik.errors.designation}
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <CustomSelect
                  id="subjects"
                  name="subjects"
                  label="Dealing Subjects"
                  options={[
                    { value: "subjects1", label: "Subjects 1" },
                    { value: "subjects2", label: "Subjects 2" },
                    { value: "subjects3", label: "Subjects 3" },
                  ]}
                  {...formik.getFieldProps("subjects")}
                />
                {formik.touched.subjects && formik.errors.subjects && (
                  <div className="text-red-500">
                    {formik.errors.subjects}
                  </div>
                )}
              </div>

           
          </div>
        </div>
        

      </div>
    </form>
  );
}

export default StaffInfo;
