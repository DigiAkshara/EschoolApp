import { DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'
import { getData, postData, updateData } from '../../app/api'
import { SUBJECT, TIMETABLE } from '../../app/url'
import { capitalizeWords, handleApiResponse } from '../../commonComponent/CommonFunctions'
import CustomInput from '../../commonComponent/CustomInput'
import CustomSelect from '../../commonComponent/CustomSelect'
import ManageClassSyllabus from './ManageClassSyllabus'
import ManageClassTimetable from './ManageClassTimetable'

function AddClassTimeTable({ onClose, getClassData }) {
  const selectedClass = useSelector((state) => state.class.selectedClass)
  const {
    boards: boardOptions,
    classes: classOptions,
    sections: sectionOptions,
    teachers: teacherOptions,
  } = useSelector((state) => state.academics)
  const [subjects, setSubjects] = useState([])
  const [theorySubject, setTheorySubject] = useState('')
  const [labSubject, setLabSubject] = useState('')
  const [extraCurricular, setExtraCurricular] = useState('')

  useEffect(() => {
    getSubjects()
  }, [])

  const getSubjects = async () => {
    try {
      const res = await getData(SUBJECT)
      const subData = res.data.data.map((item) => {
        return {
          label: item.name,
          value: item._id,
          isDefault: item.isDefault,
          category: item.category,
        }
      })
      setSubjects(subData)
    } catch (error) {
      handleApiResponse(error)
    }
  }

  const getInitialValues = () => {
    return {
      board: '',
      class: '',
      section: '',
      classTeacher: '',
      theorySubjects: subjects.filter(
        (subject) => subject.isDefault && subject.category === 'theory',
      ),
      labSubjects: subjects.filter(
        (subject) => subject.isDefault && subject.category === 'lab',
      ),
      extraCurricularSubjects: subjects.filter(
        (subject) => subject.isDefault && subject.category === 'extraCurricular',
      ),
      timetables: [],
      syllabus: [],
      ...(selectedClass && {
        ...selectedClass,
        board: selectedClass.board._id,
        class: selectedClass.class._id,
        section: selectedClass.section._id,
        classTeacher: selectedClass.classTeacher._id
      }),
    }
  }

  const getValidationSchema = () => {
    return Yup.object({
      board: Yup.string().required('Board is required'),
      class: Yup.string().required('Class is required'),
      section: Yup.string().required('Section is required'),
      classTeacher: Yup.string(),
      theorySubjects: Yup.array(),
      labSubjects: Yup.array(),
      extraCurricularSubjects: Yup.array(),
      timetables: Yup.array().of(
        Yup.object({
          period: Yup.number(),
          startTime: Yup.string().nullable(),
          endTime: Yup.string().nullable(),
          days: Yup.object({
            monday: Yup.object({
              subject: Yup.string(),
              teacher: Yup.string(),
            }),
            tuesday: Yup.object({
              subject: Yup.string(),
              teacher: Yup.string(),
            }),
            wednesday: Yup.object({
              subject: Yup.string(),
              teacher: Yup.string(),
            }),
            thursday: Yup.object({
              subject: Yup.string(),
              teacher: Yup.string(),
            }),
            friday: Yup.object({
              subject: Yup.string(),
              teacher: Yup.string(),
            }),
            saturday: Yup.object({
              subject: Yup.string(),
              teacher: Yup.string(),
            }),
          }),
        }),
      ),
      syllabus: Yup.array().of(
        Yup.object({
          syllabusSubject: Yup.string(),
          academicYear: Yup.string(),
          syllabusPic: Yup.string().nullable(),
        }),
      ),
    })
  }

  const handleSubmit = async (values) => {
    try {
      let response = values._id ? await updateData(TIMETABLE + '/' + values._id, values) : await postData(TIMETABLE, values)
      handleApiResponse(response.data.message, 'success')
      getClassData()
      onClose()
    } catch (error) {
      handleApiResponse(error)
    }
  }

  const handleRemoveTheorySubject = (subjectId, values, setFieldValue) => {
    let updateList = values.theorySubjects.filter((subject) => subject.value !== subjectId)
    setFieldValue('theorySubjects', updateList)
  }

  const handleRemoveLabSubject = (subjectId, values, setFieldValue) => {
    let updateList = values.labSubjects.filter((subject) => subject.value !== subjectId)
    setFieldValue('labSubjects', updateList)
  }

  const handleRemoveExtraSubject = (subjectId, values, setFieldValue) => {
    let updateList = values.extraCurricularSubjects.filter((subject) => subject.value !== subjectId)
    setFieldValue('extraCurricularSubjects', updateList)
  }

  const handleAddTheorySubject = async (e, values, setFieldValue) => {
    e.preventDefault()
    const subjectName = theorySubject.trim()
    const isSubjectPresent = subjects.find(
      (subject) => subject.label.toLowerCase() === subjectName.toLowerCase(),
    )
    if (isSubjectPresent) {
      const isAdded = values.theorySubjects.some((subject) => subject.value === isSubjectPresent.value)
      if (isAdded) {
        handleApiResponse({ message: 'Subject already added' })
      } else {
        setFieldValue('theorySubjects', [...values.theorySubjects, isSubjectPresent])
      }
      setTheorySubject('')
    } else {
      try {
        const response = await postData(SUBJECT, {
          name: subjectName,
          category: 'theory',
        })
        const newTheorySubject = {
          label: response.data.data.name, // Adjust this based on the response
          category: response.data.data.category,
          value: response.data.data._id,
          isDefault: response.data.data.isDefault,
        }
        setFieldValue('theorySubjects', [...values.theorySubjects, newTheorySubject])
      } catch (error) {
        handleApiResponse(error)
      } finally {
        setTheorySubject('')
      }
    }
  }

  const handleAddLabSubject = async (e, values, setFieldValue) => {
    e.preventDefault()
    const subjectName = labSubject.trim()
    const isSubjectPresent = subjects.find(
      (subject) => subject.label.toLowerCase() === subjectName.toLowerCase(),
    )
    if (isSubjectPresent) {
      const isAdded = values.labSubjects.some((subject) => subject.value === isSubjectPresent.value)
      if (isAdded) {
        handleApiResponse({ message: 'Lab Subject already added' })
      } else {
        setFieldValue('labSubjects', [...values.labSubjects, isSubjectPresent])
      }
      setLabSubject('')
    } else {
      try {
        const response = await postData(SUBJECT, {
          name: subjectName,
          category: 'lab',
        })
        const newLabSubject = {
          label: response.data.data.name, // Adjust this based on the response
          category: response.data.data.category,
          value: response.data.data._id,
          isDefault: response.data.data.isDefault,
        }
        setFieldValue('labSubjects', [...values.labSubjects, newLabSubject])
      } catch (error) {
        handleApiResponse(error)
      } finally {
        setLabSubject('')
      }
    }
  }

  const handleAddExtraSubject = async (e, values, setFieldValue) => {
    e.preventDefault()
    const subjectName = extraCurricular.trim()
    const isSubjectPresent = subjects.find((subject) => subject.label === subjectName)
    if (isSubjectPresent) {
      const isAdded = values.extraCurricularSubjects.some((subject) => subject.value === isSubjectPresent.value)
      if (isAdded) {
        handleApiResponse({ message: 'Subject already added' })
      } else {
        setFieldValue('extraCurricularSubjects', [...values.extraCurricularSubjects, isSubjectPresent])
      }
      setExtraCurricular('')
    } else {
      try {
        const response = await postData(SUBJECT, {
          name: subjectName,
          category: 'extraCurricular',
        })
        const newLabSubject = {
          label: response.data.data.name, // Adjust this based on the response
          category: response.data.data.category,
          value: response.data.data._id,
          isDefault: response.data.data.isDefault,
        }
        setFieldValue('extraCurricularSubjects', [...values.extraCurricularSubjects, newLabSubject])
      } catch (error) {
        handleApiResponse(error)
      } finally {
        setExtraCurricular('')
      }
    }
  }

  return (
    <>
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
                      enableReinitialize
                    >
                      {({ values, setFieldValue, errors, touched }) => (
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
                                  name="section"
                                  label="Section"
                                  options={sectionOptions.filter((item) => item.class === values.class)}
                                  required
                                  disabled={values.class ? false : true}
                                />
                              </div>

                              <div className="sm:col-span-1">
                                <CustomSelect
                                  label="Class Teacher"
                                  name="classTeacher"
                                  options={teacherOptions.filter((item) => item.staffType === 'teaching')}
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
                                {values.theorySubjects.length > 0 ? (
                                  values.theorySubjects.map((subject) => (
                                    <span
                                      key={subject.value}
                                      className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                                    >
                                      {capitalizeWords(subject.label)}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemoveTheorySubject(
                                            subject.value,
                                            values,
                                            setFieldValue
                                          )
                                        }
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
                                  ))
                                ) : (
                                  <p className="text-red-500 text-sm">
                                    Need to select at least one theory subject.
                                  </p>
                                )}
                              </div>

                              <div className="flex add-sub-input-blk">
                                <CustomInput
                                  value={theorySubject}
                                  name="theorySubject"
                                  placeholder="Add New Subject"
                                  onChange={(e)=>setTheorySubject(e.target.value)}/>
                                <button
                                  className=" w-1/2 ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                                  onClick={(e) =>
                                    handleAddTheorySubject(e, values, setFieldValue)
                                  }
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
                                {values.labSubjects.map((subject) => (
                                  <span
                                    key={subject.value}
                                    className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                                  >
                                    {capitalizeWords(subject.label)}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveLabSubject(subject.value, values, setFieldValue)
                                      }
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
                                ))}
                              </div>

                              <div className="flex add-sub-input-blk">
                                <CustomInput
                                  name="labSubject"
                                  placeholder="Add New Lab"
                                  value={labSubject}
                                  onChange={(e)=>setLabSubject(e.target.value)}
                                />

                                <button
                                  className=" w-1/2 ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                                  onClick={(e) =>
                                    handleAddLabSubject(e, values, setFieldValue)
                                  }
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
                                {values.extraCurricularSubjects.map((subject) => (
                                  <span
                                    key={subject.value}
                                    className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                                  >
                                    {capitalizeWords(subject.label)}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveExtraSubject(subject.value, values, setFieldValue)
                                      }
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
                                ))}
                              </div>

                              <div className="flex add-sub-input-blk">
                                <CustomInput
                                  name="extracurricular"
                                  placeholder="Add New "
                                  value={extraCurricular}
                                  onChange={(e)=>setExtraCurricular(e.target.value)}
                                />
                                <button
                                  type="submit"
                                  className=" w-1/2 ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                                  onClick={(e) =>
                                    handleAddExtraSubject(e, values, setFieldValue)
                                  }
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="border-b border-gray-900/10 pb-4 mb-4">
                            <ManageClassTimetable
                              teachers={teacherOptions}
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
  )
}

export default AddClassTimeTable
