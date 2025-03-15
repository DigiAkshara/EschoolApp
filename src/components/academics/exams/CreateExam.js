import { DialogPanel, DialogTitle } from '@headlessui/react'
import { IdentificationIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Form, Formik } from 'formik'
import moment from 'moment'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { postData, updateData } from '../../../app/api'
import { fetchExamData } from '../../../app/reducers/examSlice'
import { EXAM } from '../../../app/url'
import { handleApiResponse } from '../../../commonComponent/CommonFunctions'
import CustomDate from '../../../commonComponent/CustomDate'
import CustomInput from '../../../commonComponent/CustomInput'
import CustomSelect from '../../../commonComponent/CustomSelect'
import ExamTimeTable from './ExamTimeTable'

function CreateExam({ onClose }) {
  const {
    boards:boardOptions,
    classes: classOptions,
    sections: sectionOptions,
  } = useSelector((state) => state.academics)
  const selectedExam = useSelector((state) => state.exams.selectedExam)
  const dispatch = useDispatch()

  const getInitialValues = () => {
    return {
      board: '',
      class: '',
      section: '',
      name: '',
      startDate: null,
      endDate: null,
      timeTable: [],
      ...(selectedExam && {
        _id: selectedExam._id,
        board: selectedExam.board?._id,
        class: selectedExam.class?._id,
        section: selectedExam.section?._id,
        name: selectedExam.name,
        startDate: selectedExam.startDate,
        endDate: selectedExam.endDate,
        timeTable: selectedExam.timeTable
      }),
    }
  }

  const getValidationSchema = () => {
    return Yup.object({
      board: Yup.string().required('Board is required'),
      class: Yup.string().required('Class is required'),
      section: Yup.string().required('Section is required'),
      name: Yup.string().required('Exam Name is required'),
      startDate: Yup.date().nullable().required('Exam Start Date  is required'),
      endDate: Yup.date().nullable().required('Exam End Date  is required'),
      timeTable: Yup.array().of(
        Yup.object({
          subject: Yup.string().required('Subject is required'),
          examDate: Yup.date().required('Date is required'),
          startTime: Yup.string().required('Start time is required'),
          endTime: Yup.string().required('End time is required'),
          passMark: Yup.string().required('Pass mark is required')
            .test('pass-mark-less-than-total-marks', 'Pass marks less than total marks',
              function (value) {
                const { totalMark } = this.parent // Access sibling field 'totalMark'
                if (value && (value * 1 >= totalMark * 1)) {
                  return false // Fail validation 
                }
                return true // Pass validation otherwise
              },
            ),
          totalMark: Yup.string().required('Total Mark is required'),
          syllabus: Yup.string().required('Syllabusis required'),
        }),
      ),
    })
  }

  const handleSubmit = async (values) => {
    try {
      let response = values._id ? await updateData(EXAM + '/' + values._id, values) : await postData(EXAM, values)
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
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => (
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
                              Add Exam
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
                                    <CustomSelect
                                      label="Section"
                                      name="section"
                                      options={sectionOptions.filter(
                                        (item) => item.class === values.class,
                                      )}
                                      required
                                      disabled={values.class ? false : true}
                                    />
                                  </div>

                                  <div className="sm:col-span-1">
                                    <CustomInput
                                      id="name"
                                      name="name"
                                      label="Exam Name"
                                      placeholder="Enter Exam name"
                                      required={true}
                                    />
                                  </div>
                                  <div className="sm:col-span-1">
                                    <CustomDate
                                      name="startDate"
                                      label="Exam Start Date"
                                      required={true}
                                      minDate={moment().format('MM-DD-YYYY')}
                                      onChange={(newValue) => {
                                        setFieldValue('startDate', newValue)
                                        setFieldValue('endDate', null)
                                      }}
                                    />
                                  </div>
                                  <div className="sm:col-span-1">
                                    <CustomDate
                                      name="endDate"
                                      label="Exam End Date"
                                      required={true}
                                      disabled={values.startDate ? false : true}
                                      minDate={values.startDate}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="border-b border-gray-900/10 pb-4 mb-4">
                                <ExamTimeTable
                                  values={values}
                                  setFieldValue={setFieldValue}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>

                              <div className="border-b border-gray-900/10 pb-4 mb-4">
                                <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
                                  Hall Tickets
                                </h2>
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                                >
                                  <IdentificationIcon
                                    aria-hidden="true"
                                    className="-ml-0.5 size-5"
                                  />
                                  Generate Hall Tickets
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

export default CreateExam
