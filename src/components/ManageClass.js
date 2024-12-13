import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Formik, Form , Field,ErrorMessage} from "formik";
import * as Yup from "yup";
import CustomSelect from "../commonComponent/CustomSelect";
import ManageClassTimetable from "./ManageClassTimetable";
import ManageClassSyllabus from "./ManageClassSyllabus";
import { getData } from "../app/api";
import { SUBJECTS } from "../app/url";
import { board, classCategory } from "../commonComponent/CommonFunctions";

function ManageClass({ onClose }) {
  const [subjects, setSubjects] = useState()

  const initialValues = {
    board: "",
    category: "",
    class: "",
    section:"",
    classTeacher:"",
    timetable: {
      subject: "",
      day: "",
      time: "",
    },
   
  };

  const validationSchema = Yup.object({
    board: Yup.string().required("Board is required"),
    category: Yup.string().required("Class category is required"),
    class: Yup.string().required("Class is required"),
    section: Yup.string().required("Section is required"),
    classTeacher: Yup.string().required("Class teacher is required"),
    timetable: Yup.object({
      subject: Yup.string().required("Subject is required"),
      day: Yup.string().required("Day is required"),
      time: Yup.string().required("Time is required"),
    }),
  });

  const handleSubmit = (values) => {
    console.log("Form submitted with values:", values);
    onClose(); // Close the modal after form submission
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

  // useEffect(() => {
  //   getSubjects();
  // }, []);
  
  const getSubjects = async () => {
    const res = await getData(SUBJECTS);
    console.log("comming subject data is:",res.data );
    
     const subData = res.data.map((item) => {
      return {
        label: item.name, // Displayed text in the dropdown
        value: item._id, 
      }
    })
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
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {() => (
                        <Form>
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
                                  options={classOptions}
                                  required
                                />
                              </div>

                              <div className="sm:col-span-1">
                                <label
                                  htmlFor="section"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  Section <span className="pl-1 text-red-500">*</span>
                                </label>
                                <div className="mt-2">
                                  <Field
                                    name="section"
                                    type="text"
                                    placeholder="Enter Section Name"
                                    className="block w-52 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                  />
                                  <ErrorMessage name="section" component="div" className="text-red-500" />
                                </div>
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
                            <ManageClassTimetable />
                          </div>
                          <div className="pb-4 mb-4">
                            <ManageClassSyllabus />
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
