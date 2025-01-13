import {DialogPanel, DialogTitle} from '@headlessui/react'
import {XMarkIcon} from '@heroicons/react/24/outline'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import * as Yup from 'yup'
import {getData, postData} from '../../app/api'
import {CLASS_CATEGORIES, CLASSES, NEW_CLASS, SECTIONS, STAFF, SUBJECTS} from '../../app/url'
import {board, capitalizeWords, classCategory} from '../../commonComponent/CommonFunctions'
import CustomInput from '../../commonComponent/CustomInput'
import CustomSelect from '../../commonComponent/CustomSelect'
import ManageClassSyllabus from './ManageClassSyllabus'
import ManageClassTimetable from './ManageClassTimetable'

function AddClass({onClose}) {
  const [subjects, setSubjects] = useState([])
  const [classCategories, setClassCategories] = useState([])
  const [teacherOptions, setTeacherOptions] = useState([])
  const [sectionOptions, setSectionOptions] = useState([])
  const [theorySubject, setTheorySubject] = useState([])
  const [labSubject, setLabSubject] = useState([])
  const [extraCurricular, setExtraCurricular] = useState([])
  const [classOptions, setClassOptions] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getClassCategories()
    getSections()
    getTeachers()
    getClass()
    getSubjects()
  }, [])

  const getClass = async () => {
    const res = await getData(CLASSES)
    const classData = res.data.data.map((item) => {
      return {
        label: item.name, // Displayed text in the dropdown
        value: item._id,
        category: item.classCategory
      }
    })
    setClassOptions(classData)
  }

  const getSections = async () => {
    const res = await getData(SECTIONS)
    const sectionsData = res.data.data.map((item) => {
      return {
        label: item.section, // Displayed text in the dropdown
        value: item._id,
        class: item.class
      }
    })
    setSectionOptions(sectionsData)
  }

  const getClassCategories = async () => {
    try{
      const res = await getData(CLASS_CATEGORIES)
      if (res.status === 200 || res.status === 201) {
        const categoryData = res.data.data.map((item) => {
          return {
            label: item.name, // Displayed text in the dropdown
            value: item._id,
          }
        })
        setClassCategories(categoryData)
      } else {
        throw new Error(res.message)
      }
    }catch(error){
      console.log(error)
    }
  }


  const getTeachers = async () => {
    try{
      const res = await getData(STAFF)
      if (res.status === 200 || res.status === 201) {
        const teacherData = res.data.data.map((item) => {
          return {
            label: item.firstName +' '+ item.lastName, // Displayed text in the dropdown
            value: item._id,
          }
        })
        setTeacherOptions(teacherData)
      } else {
        throw new Error(res.message)
      }
    }catch(error){
      console.log(error)
    }
  }

  const getSubjects = async () => {
    try {
      const res = await getData(SUBJECTS)
      const fetchedSubjects = res.data.data
      const subData = fetchedSubjects.map((item) => {
        return {
          label: item.name,
          value: item._id,
          isDefault: item.isDefault,
          category: item.category,
        }
      })
      setSubjects(subData)
      const defaultSubjects = subData.filter((subject) => subject.isDefault)
      const theorySubjects = defaultSubjects.filter(
        (subject) => subject.category === 'theory',
      )
      const labSubjects = defaultSubjects.filter(
        (subject) => subject.category === 'lab',
      )
      const extracurricularSubjects = defaultSubjects.filter(
        (subject) => subject.category === 'extraCurricular',
      )

      // Set state for categorized subjects
      setTheorySubject(theorySubjects)
      setLabSubject(labSubjects)
      setExtraCurricular(extracurricularSubjects)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const getInitialValues = () => {
    return {
      board: '',
      category: '',
      class: '',
      section: '',
      classTeacher: '',
      theorySubject: '',
      labSubject: '',
      extracurricular: '',
      timetables: [],
      syllabus: [],
    }
  }

  const getValidationSchema = () => {
    return Yup.object({
      board: Yup.string().required('Board is required'),
      category: Yup.string().required('Class category is required'),
      class: Yup.string().required('Class is required'),
      section: Yup.string().required('Section is required'),
      classTeacher: Yup.string(),
      theorySubject: Yup.string(),
      labSubject: Yup.string(),
      extracurricular: Yup.string(),

      timetables: Yup.array().of(
        Yup.object({
          period: Yup.number(),
          time: Yup.string(),
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
    const processedValues = {
      ...values,
      theorySubjects: theorySubject.length > 0 ? theorySubject : '',
      extracurricular: extraCurricular.length > 0 ? extraCurricular : '',
      labSubject: labSubject.length > 0 ? labSubject : '',
    }
    try {
      let response = await postData(NEW_CLASS, processedValues)
      if (response.status === 201) {
        // navigate('/academics-class')
        // alert(response.statusText)
        onClose()
      } else {
        alert(response.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemoveTheorySubject = (subjectId) => {
    setTheorySubject((prevSubjects) =>
      prevSubjects.filter((subject) => subject.value !== subjectId),
    )
  }

  const handleRemoveLabSubject = (subjectId) => {
    setLabSubject((prevSubjects) =>
      prevSubjects.filter((subject) => subject.value !== subjectId),
    )
  }

  const handleRemoveExtraSubject = (subjectId) => {
    setExtraCurricular((prevSubjects) =>
      prevSubjects.filter((subject) => subject.value !== subjectId),
    )
  }

  const handleAddTheorySubject = async (e, values, setFieldValue) => {
    e.preventDefault()
    const subjectName = values.theorySubject.trim()
    const isSubjectPresent = subjects.some(
      (subject) => subject.label === subjectName,
    )
    if (isSubjectPresent) {
      setTheorySubject((prev) => [...prev, {label: subjectName}])      
    } else {
      try {
        const response = await postData(SUBJECTS, {
          name: subjectName,
          category: 'theory',
        })
        if (response.status === 200 || response.status === 201) {
          const newTheorySubject = {
            label: response.data.data.name, // Adjust this based on the response
            category: response.data.data.category,
            value: response.data.data._id,
            isDefault: response.data.data.isDefault,
          }
          setTheorySubject((prev) => [...prev, newTheorySubject])
        } else {
          console.error('Unexpected response status:', response.status)
        }
      } catch (error) {
        console.error('Error adding subject to backend:', error)
      }
    }
    setFieldValue('theorySubject', '')
  }

  const handleAddLabSubject = async (e, values, setFieldValue) => {
    e.preventDefault()
    const subjectName = values.labSubject.trim()
    const isSubjectPresent = subjects.some(
      (subject) => subject.label === subjectName,
    )
    if (isSubjectPresent) {
      setLabSubject((prev) => [...prev, {label: subjectName}])
    } else {
      try {
        const response = await postData(SUBJECTS, {
          name: subjectName,
          category: 'lab',
        })
        if (response.status === 200 || response.status === 201) {
          const newLabSubject = {
            label: response.data.data.name, // Adjust this based on the response
            category: response.data.data.category,
            value: response.data.data._id,
            isDefault: response.data.data.isDefault,
          }
          setLabSubject((prev) => [...prev, newLabSubject])
        } else {
          console.error('Unexpected response status:', response.status)
        }
      } catch (error) {
        console.error('Error adding subject to backend:', error)
      }
    }
    setFieldValue('labSubject', '')
  }

  const handleAddExtraSubject = async (e, values, setFieldValue) => {
    e.preventDefault()
    const subjectName = values.extracurricular.trim()
    const isSubjectPresent = subjects.some(
      (subject) => subject.label === subjectName,
    )
    if (isSubjectPresent) {
      setExtraCurricular((prev) => [...prev, {label: subjectName}])
    } else {
      try {
        const response = await postData(SUBJECTS, {
          name: subjectName,
          category: 'extraCurricular',
        })
        if (response.status === 200 || response.status === 201) {
          const newLabSubject = {
            label: response.data.data.name, // Adjust this based on the response
            category: response.data.data.category,
            value: response.data.data._id,
            isDefault: response.data.data.isDefault,
          }
          setExtraCurricular((prev) => [...prev, newLabSubject])
        } else {
          console.error('Unexpected response status:', response.status)
        }
      } catch (error) {
        console.error('Error adding subject to backend:', error)
      }
    }
    setFieldValue('extracurricular', '')
  }

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
                      {({values, setFieldValue, errors, touched}) => (
                        <Form>
                          {console.log(values)}
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
                                  options={classCategories}
                                  required
                                />
                              </div>
                              <div className="sm:col-span-1">
                                <CustomSelect
                                  label="Class"
                                  name="class"
                                  options={classOptions.filter((item) => item.category === values.category)}
                                  required
                                  disabled={values.category ? false : true}
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
                                  options={teacherOptions}
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
                                {theorySubject.length > 0 ? (
                                  theorySubject.map((subject) => (
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
                                <div className="">
                                  <Field
                                    name="theorySubject"
                                    type="text"
                                    placeholder="Add New Subject"
                                    className="block w-52 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                  />
                                  {/* <ErrorMessage
                                    name="theorySubject"
                                    component="div"
                                    className="text-red-500"
                                  /> */}
                                </div>

                                <button
                                  type="submit"
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
                                {labSubject.map((subject) => (
                                  <span
                                    key={subject.value}
                                    className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                                  >
                                    {capitalizeWords(subject.label)}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveLabSubject(subject.value)
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
                                {extraCurricular.map((subject) => (
                                  <span
                                    key={subject.value}
                                    className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                                  >
                                    {capitalizeWords(subject.label)}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveExtraSubject(subject.value)
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
                              subjects={theorySubject}
                              teachers={teacherOptions}
                              values={values}
                              setFieldValue={setFieldValue}
                            />
                          </div>
                          <div className="pb-4 mb-4">
                            <ManageClassSyllabus
                              subjects={theorySubject}
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

export default AddClass
