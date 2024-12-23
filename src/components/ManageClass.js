import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomSelect from "../commonComponent/CustomSelect";
import ManageClassTimetable from "./ManageClassTimetable";
import ManageClassSyllabus from "./ManageClassSyllabus";
import { getData, postData } from "../app/api";
import { CLASS, CLASSES, NEWCLASS, SUBJECTS } from "../app/url";
import { board, classCategory } from "../commonComponent/CommonFunctions";
import CustomInput from "../commonComponent/CustomInput";
import { useNavigate } from "react-router-dom";

function ManageClass({ onClose }) {
  const [subjects, setSubjects] = useState();
  const [classData, setClassData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    getClass();
  }, []);

  const getClass = async () => {
    const res = await getData(CLASSES);
    console.log("comming class data is:", res.data);

    const classData = res.data.data.map((item) => {
      return {
        label: item.name, // Displayed text in the dropdown
        value: item._id,
      };
    });
    setClassData(classData);
  };

  const getInitialValues = () => {
    return {
      board: "",
      category: "",
      class: "",
      section: "",
      classTeacher: "",
      theorySubject: "",
      labSubject: "",
      extracurricular: "",
      timetable: [],
      syllabus: [],
    };
  };

  const getValidationSchema = () => {
    return Yup.object({
      board: Yup.string().required("Board is required"),
      category: Yup.string().required("Class category is required"),
      class: Yup.string().required("Class is required"),
      section: Yup.string().required("Section is required"),
      classTeacher: Yup.string().required("Class teacher is required"),
      theorySubject: Yup.string().required("Theory Subjects is required"),
      labSubject: Yup.string().required("Lab Subjects is required"),
      extracurricular: Yup.string().required(
        "Extracurricular Activities is required"
      ),

      timetable: Yup.array()
        .of(
          Yup.object({
            period: Yup.number()
              .required("Period is required")
              .positive("Period must be positive")
              .integer("Period must be an integer"),
            time: Yup.string().required("Time is required"),
            days: Yup.object({
              monday: Yup.object({
                subject: Yup.string().required("Subject is required"),
                teacher: Yup.string().required("Teacher is required"),
              }),
              tuesday: Yup.object({
                subject: Yup.string().required("Subject is required"),
                teacher: Yup.string().required("Teacher is required"),
              }),
              wednesday: Yup.object({
                subject: Yup.string().required("Subject is required"),
                teacher: Yup.string().required("Teacher is required"),
              }),
              thursday: Yup.object({
                subject: Yup.string().required("Subject is required"),
                teacher: Yup.string().required("Teacher is required"),
              }),
              friday: Yup.object({
                subject: Yup.string().required("Subject is required"),
                teacher: Yup.string().required("Teacher is required"),
              }),
              saturday: Yup.object({
                subject: Yup.string().required("Subject is required"),
                teacher: Yup.string().required("Teacher is required"),
              }),
            }),
          })
        )
        .min(1, "At least one timetable entry is required"),
      syllabus: Yup.array().of(
        Yup.object({
          syllabusSubject: Yup.string().required("Subject is required"),
          acadamicYear: Yup.string().required("Academic year is required"),
          syllabusPic: Yup.string().required("Syllabus file is required"),
        })
      ),
    });
  };

  // const handleSubmit = (values) => {
  //   console.log("Form submitted with values:", values);
  //   alert("Form submitted successfully!");
  //   onClose(); // Close the modal after form submission
  // };

  const handleSubmit = async (values) => {
    console.log("Handle submit");
    
    console.log("Form submitted with values:", values);
    try {
      let response = await postData(NEWCLASS, values);
      console.log("respose is:", response);
      if (response.status === 201) {
        console.log("Class added successfully!");
        navigate("/academics-class");
        alert(response.statusText);

        onClose();
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const classOptions = [
    { label: "Nursery", value: "nursery" },
    { label: "UKG", value: "ukg" },
    { label: "LKG", value: "lkg" },
  ];

  const teacherOptions = [
    { label: "Rama Krishna", value: "rama_krishna" },
    { label: "Sita Devi", value: "sita_devi" },
  ];

  useEffect(() => {
    getSubjects();
  }, []);

  const getSubjects = async () => {
    const res = await getData(SUBJECTS);
    console.log("comming subject data is:", res.data);

    const subData = res.data.data.map((item) => {
      return {
        label: item.name, // Displayed text in the dropdown
        value: item._id,
      };
    });
    setSubjects(subData);
  };

  return (
    <>
      <div className="fixed inset-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-7xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="bg-purple-900 px-3 py-3 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className=" text-base font-semibold text-white">
                        Add Class
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={onClose}
                          className="relative rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex-1 px-6 py-6 sm:px-6 overflow-y-auto">
                    <Formik
                      initialValues={getInitialValues()}
                      validationSchema={getValidationSchema()}
                      onSubmit={handleSubmit}
                    >
                      {({ values, setFieldValue, errors, touched }) => (
                        <Form>
                          {console.log(errors)}
                          <div className="border-b border-gray-900/10 pb-4 mb-4">
                            <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                              Add New Class
                            </h2>
                            <div className="grid grid-cols-5 gap-x-4 gap-y-4">
                              <div className="sm:col-span-1">
                                <CustomSelect
                                  label="Board"
                                  name="board"
                                  options={board}
                                  required
                                />
                              </div>
                              <div className="sm:col-span-1">
                                <CustomSelect
                                  label="Class Category"
                                  name="category"
                                  options={classCategory}
                                  required
                                />
                              </div>
                              <div className="sm:col-span-1">
                                <CustomSelect
                                  label="Class"
                                  name="class"
                                  options={classData}
                                  required
                                />
                              </div>

                              <div className="sm:col-span-1">
                                <CustomInput
                                  name="section"
                                  label="Section"
                                  placeholder="Enter Section"
                                  required={true}
                                />
                              </div>

                              <div className="sm:col-span-1">
                                <CustomSelect
                                  label="Class Teacher"
                                  name="classTeacher"
                                  options={teacherOptions}
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="border-b border-gray-900/10 pb-4 mb-4">
                            <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                              Add Theory Subjects
                            </h2>
                            <p className="text-base font-regular text-gray-900">
                              Please review the theory subjects listed below and
                              suggest any additions or removals relevant to this
                              class and section.
                            </p>
                            <div className="flex items-center mt-4 gap-4">
                              <div className="filter-badges-blk flex flex-wrap gap-4">
                                <span className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                  English
                                  <button
                                    type="button"
                                    className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
                                  >
                                    <span className="sr-only">Remove</span>
                                    <svg
                                      viewBox="0 0 14 14"
                                      className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
                                    >
                                      <path d="M4 4l6 6m0-6l-6 6" />
                                    </svg>
                                    <span className="absolute -inset-1" />
                                  </button>
                                </span>
                                <span className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                  Telugu
                                  <button
                                    type="button"
                                    className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
                                  >
                                    <span className="sr-only">Remove</span>
                                    <svg
                                      viewBox="0 0 14 14"
                                      className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
                                    >
                                      <path d="M4 4l6 6m0-6l-6 6" />
                                    </svg>
                                    <span className="absolute -inset-1" />
                                  </button>
                                </span>
                                <span className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                  Hindi
                                  <button
                                    type="button"
                                    className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
                                  >
                                    <span className="sr-only">Remove</span>
                                    <svg
                                      viewBox="0 0 14 14"
                                      className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
                                    >
                                      <path d="M4 4l6 6m0-6l-6 6" />
                                    </svg>
                                    <span className="absolute -inset-1" />
                                  </button>
                                </span>
                                <span className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                  Maths
                                  <button
                                    type="button"
                                    className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
                                  >
                                    <span className="sr-only">Remove</span>
                                    <svg
                                      viewBox="0 0 14 14"
                                      className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
                                    >
                                      <path d="M4 4l6 6m0-6l-6 6" />
                                    </svg>
                                    <span className="absolute -inset-1" />
                                  </button>
                                </span>
                                <span className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                  Social
                                  <button
                                    type="button"
                                    className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
                                  >
                                    <span className="sr-only">Remove</span>
                                    <svg
                                      viewBox="0 0 14 14"
                                      className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
                                    >
                                      <path d="M4 4l6 6m0-6l-6 6" />
                                    </svg>
                                    <span className="absolute -inset-1" />
                                  </button>
                                </span>
                              </div>

                              <div className="flex add-sub-input-blk">
                                <div className="">
                                  <Field
                                    name="theorySubject"
                                    type="text"
                                    placeholder="Add New Subject"
                                    className="block w-52 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                  />
                                  <ErrorMessage
                                    name="theorySubject"
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>

                                <button
                                  type="submit"
                                  className=" w-1/2 ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="border-b border-gray-900/10 pb-4 mb-4">
                            <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                              Add Lab Subjects
                            </h2>
                            <p className="text-base font-regular text-gray-900">
                              Please review the Lab subjects listed below and
                              suggest any additions or removals relevant to this
                              class and section.
                            </p>
                            <div className="flex items-center mt-4 gap-4">
                              <div className="filter-badges-blk flex flex-wrap gap-4">
                                <span className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                  Computer
                                  <button
                                    type="button"
                                    className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
                                  >
                                    <span className="sr-only">Remove</span>
                                    <svg
                                      viewBox="0 0 14 14"
                                      className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
                                    >
                                      <path d="M4 4l6 6m0-6l-6 6" />
                                    </svg>
                                    <span className="absolute -inset-1" />
                                  </button>
                                </span>
                                <span className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                  Science
                                  <button
                                    type="button"
                                    className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
                                  >
                                    <span className="sr-only">Remove</span>
                                    <svg
                                      viewBox="0 0 14 14"
                                      className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
                                    >
                                      <path d="M4 4l6 6m0-6l-6 6" />
                                    </svg>
                                    <span className="absolute -inset-1" />
                                  </button>
                                </span>
                              </div>

                              <div className="flex add-sub-input-blk">
                                <div className="">
                                  <Field
                                    name="labSubject"
                                    type="text"
                                    placeholder="Add New Lab"
                                    className="block w-52 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                  />
                                  <ErrorMessage
                                    name="labSubject"
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>

                                <button
                                  type="submit"
                                  className=" w-1/2 ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="border-b border-gray-900/10 pb-4 mb-4">
                            <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                              Extracurricular Activities
                            </h2>
                            <p className="text-base font-regular text-gray-900">
                              Please review the Extracurricular Activities
                              listed below and suggest any additions or removals
                              relevant to this class and section.
                            </p>
                            <div className="flex items-center mt-4 gap-4">
                              <div className="filter-badges-blk flex flex-wrap gap-4">
                                <span className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                  Dance
                                  <button
                                    type="button"
                                    className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
                                  >
                                    <span className="sr-only">Remove</span>
                                    <svg
                                      viewBox="0 0 14 14"
                                      className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
                                    >
                                      <path d="M4 4l6 6m0-6l-6 6" />
                                    </svg>
                                    <span className="absolute -inset-1" />
                                  </button>
                                </span>
                                <span className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                  Art
                                  <button
                                    type="button"
                                    className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
                                  >
                                    <span className="sr-only">Remove</span>
                                    <svg
                                      viewBox="0 0 14 14"
                                      className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
                                    >
                                      <path d="M4 4l6 6m0-6l-6 6" />
                                    </svg>
                                    <span className="absolute -inset-1" />
                                  </button>
                                </span>
                                <span className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                  Sports
                                  <button
                                    type="button"
                                    className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
                                  >
                                    <span className="sr-only">Remove</span>
                                    <svg
                                      viewBox="0 0 14 14"
                                      className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
                                    >
                                      <path d="M4 4l6 6m0-6l-6 6" />
                                    </svg>
                                    <span className="absolute -inset-1" />
                                  </button>
                                </span>
                              </div>

                              <div className="flex add-sub-input-blk">
                                <div className="">
                                  <Field
                                    name="extracurricular"
                                    type="text"
                                    placeholder="Add New "
                                    className="block w-52 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                  />
                                  <ErrorMessage
                                    name="extracurricular"
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>

                                <button
                                  type="submit"
                                  className=" w-1/2 ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="border-b border-gray-900/10 pb-4 mb-4">
                            <ManageClassTimetable
                              values={values}
                              setFieldValue={setFieldValue}
                            />
                          </div>
                          <div className="pb-4 mb-4">
                            <ManageClassSyllabus
                              values={values}
                              setFieldValue={setFieldValue}
                              errors={errors}
                              touched={touched}
                            />
                          </div>

                          <div className="flex justify-end bg-gray-100 px-4 py-4">
                            <button
                              type="button"
                              onClick={onClose}
                              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                            >
                              Submit
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageClass;
