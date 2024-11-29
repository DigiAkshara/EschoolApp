import React, { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Datepicker from "react-tailwindcss-datepicker";
import CustomInput from "../commonComponent/CustomInput";
import CustomSelect from "../commonComponent/CustomSelect";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setFormData } from "../app/reducers/appConfigSlice";
import { useDispatch, useSelector } from "react-redux";


function StudentAcademicDetails({ goNext, onPrevious, setFormRef }) {
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
            Present Academic Details
          </h2>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
            <div className="sm:col-span-2">
              <CustomSelect
                id="academicYear"
                name="academicYear"
                label="Academic year"
                options={[
                  { value: "2023", label: "2023" },
                  { value: "2024", label: "2024" },
                  { value: "2025", label: "2025" },
                ]}
                {...formik.getFieldProps("academicYear")}
              />
              {formik.touched.academicYear && formik.errors.academicYear && (
                <div className="text-red-500">{formik.errors.academicYear}</div>
              )}
            </div>

            <div className="sm:col-span-2">
            <label
              htmlFor="DOA"
              className="block text-sm/6 font-regular text-gray-900"
            >
              Date Of Admission<span className="pl-1 text-red-500">*</span>
            </label>
            <div className="mt-2">
              <Datepicker
                inputClassName="inline-block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                primaryColor="purple"
                useRange={false}
                asSingle={true}
                value={formik.values.DOA}
                onChange={(newValue) =>
                  formik.setFieldValue("DOA", newValue)
                }
              />
              {/* {formik.touched.DOA && formik.errors.DOA && (
                <div className="text-red-500 mt-1">{formik.errors.DOA}</div>
              )} */}
            </div>
          </div>

            

            <div className="sm:col-span-2">
              <CustomInput
                name="admissionNbr"
                label="Admission Number"
                placeholder="Enter Admi.No."
                type="text"
                required={true}
                {...formik.getFieldProps("admissionNbr")}
              />
              {formik.touched.admissionNbr && formik.errors.admissionNbr && (
                <div className="text-red-500">{formik.errors.admissionNbr}</div>
              )}
            </div>

            <div className="sm:col-span-1">
              <CustomSelect
                id="class"
                name="class"
                label="Class"
                required={true}
                options={[
                  { value: "1", label: "Class 1" },
                  { value: "2", label: "Class 2" },
                  { value: "3", label: "Class 3" },
                ]}
                {...formik.getFieldProps("class")}
              />
              {formik.touched.class && formik.errors.class && (
                <div className="text-red-500">{formik.errors.class}</div>
              )}
            </div>

            <div className="sm:col-span-1">
              <CustomSelect
                id="section"
                name="section"
                label="Section"
                required={true}
                options={[
                  { value: "A", label: "Section A" },
                  { value: "B", label: "Section B" },
                  { value: "C", label: "Section C" },
                ]}
                {...formik.getFieldProps("section")}
              />
              {formik.touched.section && formik.errors.section && (
                <div className="text-red-500">{formik.errors.section}</div>
              )}
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-4 mb-4">
          <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
            Previous Academic Details
          </h2>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-8">
            <div className="sm:col-span-2">
              <CustomSelect
                id="yearOfStudy"
                name="yearOfStudy"
                label="Year of study"
                required={true}
                options={[
                  { value: "2020", label: "2020" },
                  { value: "2021", label: "2021" },
                  { value: "2022", label: "2022" },
                ]}
                {...formik.getFieldProps("yearOfStudy")}
              />
              {formik.touched.yearOfStudy && formik.errors.yearOfStudy && (
                <div className="text-red-500">{formik.errors.yearOfStudy}</div>
              )}
            </div>

            <div className="sm:col-span-2">
              <CustomInput
                id="schoolName"
                name="schoolName"
                label="School Name"
                placeholder="Enter"
                required={true}
                {...formik.getFieldProps("schoolName")}
              />
              {formik.touched.schoolName && formik.errors.schoolName && (
                <div className="text-red-500">{formik.errors.schoolName}</div>
              )}
            </div>

            <div className="sm:col-span-2">
              <CustomInput
                id="className"
                name="className"
                label="Class"
                placeholder="Enter"
                required={true}
                {...formik.getFieldProps("className")}
              />
              {formik.touched.className && formik.errors.className && (
                <div className="text-red-500">{formik.errors.className}</div>
              )}
            </div>

            <div className="sm:col-span-2">
              <CustomInput
                id="totalMarks"
                name="totalMarks"
                label="Total Marks Scored"
                placeholder="Enter"
                required={true}
                {...formik.getFieldProps("totalMarks")}
              />
              {formik.touched.totalMarks && formik.errors.totalMarks && (
                <div className="text-red-500">{formik.errors.totalMarks}</div>
              )}
            </div>

            <div className="sm:col-span-4">
        <label
          htmlFor="file-upload"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Upload Transfer / Study Certificate
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
                <div className="flex text-sm/6 leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="font-semibold text-purple-600 hover:text-purple-500 cursor-pointer"
                  >
                    Choose File
                    <input
                      id="file-upload"
                      type="file"
                      name="certificateUpload"
                      accept=".png, .jpg, .jpeg"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <p className="text-xs/5 leading-5 text-gray-600 mt-1">
                  PNG or JPG files only. Max 10MB.
                </p>
                {formik.touched.fileUpload && formik.errors.fileUpload && (
                  <div className="text-red-500">
                    {formik.errors.fileUpload}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {studyFile && (
                  <div className="text-sm text-gray-700 mt-2">{studyFile.name}</div>
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

export default StudentAcademicDetails;
