import { PlusIcon } from '@heroicons/react/20/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { FieldArray } from 'formik'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CustomSelect from '../../commonComponent/CustomSelect'

function ManageClassSyllabus({values, setFieldValue, touched, errors }) {
  const { academicYear } = useSelector((state) => state.appConfig)
  const [academicYearOptions, setAcademicYearOptions] = useState([])

  useEffect(() => {
    if (academicYear) {
      setAcademicYearOptions([{ label: academicYear.year, value: academicYear._id }])
    }
    if (values.syllabus && values.syllabus.length === 0) {
      setFieldValue('syllabus', [
        {
          id: 1,
          academicYear: '',
          subject: '',
          syllabusPic: null,
        },
      ])
    }
  }, [])


  const addRow = () => {
    let dummyList = [
      ...values.syllabus,
      {
        id: values.syllabus.length + 1, // Incrementing the ID for each new row
        academicYear: '',
        subject: '',
      },
    ]
    setFieldValue('syllabus', dummyList)
  }

  return (
    <>
      <h2 className="text-base/7 font-semibold text-gray-900 mb-2">Syllabus</h2>

      <table className="mt-4 min-w-full table-fixed divide-y divide-gray-300 border border-gray-300">
        <thead className="bg-purple-100">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2 w-12"
            >
              <a href="#" className="group inline-flex">
                S. No
              </a>
            </th>

            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
            >
              <a href="#" className="group inline-flex">
                Academic Year
              </a>
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
            >
              <a href="#" className="group inline-flex">
                Subject
              </a>
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
            >
              <a href="#" className="group inline-flex">
                Upload Syllabus
              </a>
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-12"
            ></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          <FieldArray name="syllabus">
            {({ remove }) =>
              values.syllabus.map((item, index) => (
                <tr key={item.id}>
                  <td className="relative px-7 sm:w-12 sm:px-6">{index + 1}</td>

                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    <CustomSelect
                      isLabelRequired={false}
                      label="Academic Year"
                      name={`syllabus.${index}.academicYear`}
                      options={academicYearOptions}
                    />
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    <CustomSelect
                      isLabelRequired={false}
                      label="Subject"
                      name={`syllabus.${index}.syllabusSubject`}
                      options={values.theorySubjects}
                    />
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 text-right">
                    <div className="flex items-center">
                      <PlusIcon
                        aria-hidden="true"
                        className="text-purple-500 size-5"
                      />
                      <label
                        htmlFor={`syllabus.${index}.syllabusPic`}
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"
                      >
                        <span>Choose a file </span>
                        <input
                          id={`syllabus.${index}.syllabusPic`}
                          name={`syllabus.${index}.syllabusPic`}
                          type="file"
                          className="sr-only"
                          onChange={(event) =>
                            setFieldValue(
                              `syllabus.${index}.syllabusPic`,
                              event.currentTarget.files[0],
                            )
                          }
                        />
                      </label>
                      {/* Error Message */}
                      {errors.syllabus &&
                        errors.syllabus[index] &&
                        errors.syllabus[index].syllabusPic &&
                        touched.syllabus &&
                        touched.syllabus[index] &&
                        touched.syllabus[index].syllabusPic && (
                          <div className="text-red-500 text-xs mt-1">
                            {errors.syllabus[index].syllabusPic}
                          </div>
                        )}
                    </div>
                  </td>
                  {index !== 0 && (
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      <button onClick={() => remove(index)}>
                        <XMarkIcon
                          aria-hidden="true"
                          className="text-red-500 size-5"
                        />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            }
          </FieldArray>
        </tbody>
      </table>
      <div className="flex items-center mt-2 w-full justify-end">
        <PlusIcon aria-hidden="true" className="text-purple-500 size-5" />
        <button
          onClick={addRow}
          className="text-purple-600 font-medium hover:text-purple-900"
        >
          Add Another Subject <span className="sr-only">add new subject</span>
        </button>
      </div>
    </>
  )
}

export default ManageClassSyllabus
