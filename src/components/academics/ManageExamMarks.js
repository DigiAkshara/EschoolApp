import {DialogPanel, DialogTitle} from '@headlessui/react'
import {IdentificationIcon, XMarkIcon} from '@heroicons/react/24/outline'
import {Form, Formik} from 'formik'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import * as Yup from 'yup'
import {getData} from '../../app/api'
import {CLASSES} from '../../app/url'
import {boardOptions, classCategory} from '../../commonComponent/CommonFunctions'
import CustomInput from '../../commonComponent/CustomInput'
import CustomSelect from '../../commonComponent/CustomSelect'
import ManageAddMarks from './ManageAddMarks'

function ManageExamMarks({onClose}) {
  const { classCategories:categoryOptions, classes: classOptions, sections: sectionOptions } = useSelector(
    (state) => state.academics
  ); 
  const selectedExam = useSelector((state) => state.exams.selectedExam)
  console.log(selectedExam, "selectedExam")
  const subjects = selectedExam?selectedExam?.timeTable?.map((item) => ({
    label: item.subject,
    value: item.subject,
  })):[]

  const students = [
    {
      rollNo: '1',
      name: 'Janet Baker',
      id: '112345',
    },
    {
      rollNo: '2',
      name: 'John Doe',
      id: '112346',
    },
    // More students can be added here
  ]

  const initialMarks = students.map((student) => ({
    student: student.name,
    marks: subjects.map((subject) => ({
      subject: subject.su,
      mark: '',
    })),
    marksObt: '',
    totalMarks: '',
    percentage: '',
  }))

  const getInitialValues = () => {
    return {
      board: selectedExam?.board || '',
      classCategory: selectedExam?.category || '',
      class: selectedExam?.class || '',
      section: selectedExam?.section || '',
      name: selectedExam?.examName || '',
      marks: initialMarks,
    }
  }

  const getValidationSchema = () => {
    return Yup.object({
      board: Yup.string().required('Board is required'),
      classCategory: Yup.string().required('Class category is required'),
      class: Yup.string().required('Class is required'),
      section: Yup.string().required('Section is required'),
      name: Yup.string().required('Exam name is required'),
      marks: Yup.array().of(
        Yup.object({
          student: Yup.string(),
          marks: Yup.array().of(
            Yup.object({
              subject: Yup.string(),
              mark: Yup.number(),
            }),
          ),
        }),
      ),
    })
  }
 

 

  const handleSubmit = async (values) => {
    console.log('Exam values:', values)
  }

  return (
    <>
      <Formik
        initialValues={getInitialValues()}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
      >
        {({values, setFieldValue, errors, touched}) => (
          <Form>
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
                              Add Exam Marks
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
                        <div className="relative flex-1 px-6 py-6 sm:px-6 overflow-y-auto">
                          <div className="form-content">
                            {/* Basic details form */}

                            <div className="">
                              <div className="border-b border-gray-900/10 pb-4 mb-4">
                                <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                                  Exam Details
                                </h2>
                                <div className=" grid grid-cols-4 gap-x-4 gap-y-4">
                                  <div className="sm:col-span-1">
                                    <CustomSelect
                                      label="Board"
                                      name="board"
                                      options={boardOptions}
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomSelect
                                      label="Class Category"
                                      name="classCategory"
                                      options={categoryOptions}
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomSelect
                                      label="Class"
                                      name="class"
                                      options={classOptions}
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomSelect
                                      label="Section"
                                      name="section"
                                      options={sectionOptions}
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomInput
                                      id="name"
                                      name="name"
                                      label="Exam Name"
                                      placeholder="Enter Exam name"
                                    />
                                  </div>
                                </div>
                                <div className=" sm-col-12  mt-2 flex justify-end">
                                  <button
                                    type="submit"
                                    className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                                  >
                                    Search
                                  </button>
                                </div>
                              </div>

                              <div className="border-b border-gray-900/10 pb-4 mb-4">
                                <ManageAddMarks
                                  subjects={subjects}
                                  students={students}
                                  values={values}
                                  setFieldValue={setFieldValue}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>

                              <div className="border-b border-gray-900/10 pb-4 mb-4">
                                <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                                  Progress Cards
                                </h2>
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                                >
                                  <IdentificationIcon
                                    aria-hidden="true"
                                    className="-ml-0.5 size-5"
                                  />
                                  Generate Progress Cards
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 px-4 py-4 bg-gray-100 w-full justify-end">
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
                    </div>
                  </DialogPanel>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default ManageExamMarks
