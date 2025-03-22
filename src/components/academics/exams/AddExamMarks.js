import { DialogPanel, DialogTitle } from '@headlessui/react'
import { IdentificationIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { getData, postData } from '../../../app/api'
import { ACADEMICS, MARKS } from '../../../app/url'
import { boardOptions, capitalizeWords, handleApiResponse } from '../../../commonComponent/CommonFunctions'
import CustomInput from '../../../commonComponent/CustomInput'
import CustomSelect from '../../../commonComponent/CustomSelect'
import { fetchExamData } from '../../../app/reducers/examSlice'

function AddExamMarks({ onClose }) {
  const { classCategories: categoryOptions, classes: classOptions, sections: sectionOptions } = useSelector(
    (state) => state.academics
  );
  const selectedExam = useSelector((state) => state.exams.selectedExam)
  const [students, setStudents] = useState([])
  const dispatch = useDispatch()
  const getInitialValues = () => {
    return {
      examId: selectedExam?._id || '',
      board: selectedExam?.board || '',
      classCategory: selectedExam?.category || '',
      class: selectedExam?.class || '',
      section: selectedExam?.section || '',
      name: selectedExam?.examName || '',
      studentsMarks: students,
    }
  }

  const getValidationSchema = () => {
    return Yup.object({
      board: Yup.string().required('Board is required'),
      classCategory: Yup.string().required('Class category is required'),
      class: Yup.string().required('Class is required'),
      section: Yup.string().required('Section is required'),
      name: Yup.string().required('Exam name is required'),
      studentsMarks: Yup.array().of(
        Yup.object({
          student: Yup.string(),
          marks: Yup.array().of(
            Yup.object({
              subject: Yup.string(),
              marks: Yup.number().required('Marks is required'),
            }),
          ),
        }),
      ),
    })
  }

  const getStudents = async (exam) => {
    try {
      const res = await getData(ACADEMICS + '/' + exam?.class + '/' + exam?.section)
      let dummyList = []
      res.data.data.forEach(student => {
        dummyList.push({
          studentId: student.student._id,
          admissionNumber: student.student.admissionNumber,
          studentName: capitalizeWords(student.student.firstName + ' ' + student.student.lastName),
          profilePic: student.student.profilePic?.Location || null,
          totalMarks: '',
          percentage: '',
          marks: exam.timeTable.map((subject) => ({
            subject: subject.subject,
            marks: '',
            passMark: subject.passMark * 1,
            totalMark: subject.totalMark * 1,
          }))
        })
      })
      setStudents(dummyList)
    } catch (error) {
      handleApiResponse(error)
    }
  }

  useEffect(() => {
    if (selectedExam) getStudents(selectedExam)
  }, [selectedExam])


  const handleSubmit = async (values) => {
    try {
      const response = await postData(MARKS, values)
      dispatch(fetchExamData())
      handleApiResponse(response.data.message, 'success')
      onClose()
    } catch (error) {
      handleApiResponse(error)
    }
  }

  return (
    <>
      <Formik
        initialValues={getInitialValues()}
        enableReinitialize
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="fixed inset-0" />
            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                  <DialogPanel
                    transition
                    className="pointer-events-auto w-screen max-w-6xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
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
                                      disabled
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomSelect
                                      label="Class Category"
                                      name="classCategory"
                                      options={categoryOptions}
                                      disabled
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomSelect
                                      label="Class"
                                      name="class"
                                      options={classOptions}
                                      disabled
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomSelect
                                      label="Section"
                                      name="section"
                                      options={sectionOptions.filter(section => section.class._id === values.class)}
                                      disabled
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomInput
                                      id="name"
                                      name="name"
                                      label="Exam Name"
                                      placeholder="Enter Exam name"
                                      disabled
                                    />
                                  </div>
                                </div>
                                {/* <div className=" sm-col-12  mt-2 flex justify-end">
                                  <button
                                    type="button"
                                    className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                                  >
                                    Search
                                  </button>
                                </div> */}
                              </div>

                              <div className="border-b border-gray-900/10 pb-4 mb-4">
                                {students.length > 0 ?
                                  <>
                                    <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                                      Enter Marks
                                    </h2>

                                    <div className="overflow-x-auto">
                                      <table className="mt-4 min-w-full table-fixed divide-y divide-gray-300 border border-gray-300">
                                        <thead className="bg-purple-100">
                                          <tr>
                                            <th
                                              scope="col"
                                              className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2 w-12"
                                            >
                                              <a href="#" className="group inline-flex">
                                                Roll No
                                              </a>
                                            </th>
                                            <th
                                              scope="col"
                                              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
                                            >
                                              <a href="#" className="group inline-flex">
                                                Student Name
                                              </a>
                                            </th>
                                            {selectedExam?.timeTable.map((subject, index) => (
                                              <th
                                                key={index}
                                                scope="col"
                                                className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32"
                                              >
                                                <a href="#" className="group inline-flex">
                                                  {subject.subjectName.toUpperCase()}
                                                </a>
                                                <div className='text-xs'>(Max Marks: {subject.totalMark})</div>
                                              </th>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                          {values.studentsMarks.map((student, studentIndex) => (
                                            <tr key={studentIndex} className="bg-gray-50">
                                              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                {studentIndex + 1}
                                              </td>
                                              <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm sm:pl-0">
                                                <div className="flex items-center">
                                                  {student.profilePic ?
                                                    <div className="size-9 shrink-0">
                                                      <img
                                                        alt=""
                                                        src={student.profilePic}
                                                        className="size-9 rounded-full"
                                                      />
                                                    </div> :
                                                    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                                      <span className="font-medium text-gray-600 dark:text-gray-300">{student.studentName.charAt(0)}</span>
                                                    </div>}
                                                  <div className="ml-4">
                                                    <div className="font-medium text-gray-900 text-purple-600">
                                                      {student.studentName}
                                                    </div>
                                                    <div className="mt-1 text-gray-500">{student.admissionNumber}</div>
                                                  </div>
                                                </div>
                                              </td>
                                              {student.marks.map((subject, subjectIndex) => (
                                                <td
                                                  key={subjectIndex}
                                                  className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                                                >
                                                  <CustomInput
                                                    name={`studentsMarks[${studentIndex}].marks[${subjectIndex}].marks`}
                                                    type="number"
                                                    onChange={(e) => {
                                                      if (e.target.value * 1 <= subject.totalMark) {
                                                        const newMarks = [...student.marks];
                                                        newMarks[subjectIndex].marks = e.target.value ? e.target.value * 1 : '';
                                                        setFieldValue(
                                                          `studentsMarks[${studentIndex}].marks`,
                                                          newMarks
                                                        );
                                                      }
                                                    }}
                                                  />
                                                </td>
                                              ))}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </> : <>
                                    <div className="flex justify-center items-center">
                                      <div className="text-3xl">No Students Found</div>
                                    </div>
                                  </>}
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
                          disabled={students.length == 0}
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

export default AddExamMarks
