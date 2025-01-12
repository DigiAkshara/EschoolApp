import {PlusIcon} from '@heroicons/react/20/solid'
import {XMarkIcon} from '@heroicons/react/24/outline'
import {FieldArray} from 'formik'
import React, {useEffect, useState} from 'react'
import CustomDate from '../../commonComponent/CustomDate'
import CustomInput from '../../commonComponent/CustomInput'
import CustomSelect from '../../commonComponent/CustomSelect'
import {getData} from '../../app/api'
import {SUBJECTS} from '../../app/url'

function ExamTimeTable({values, setFieldValue}) {
  const [subjectOptions, setSubjectOptions] = useState([])

  const getSubjects = async () => {
    const res = await getData(SUBJECTS)
    const subData = res.data.data.map((item) => {
      return {
        label: item.name, // Displayed text in the dropdown
        value: item._id,
      }
    })
    setSubjectOptions(subData)
  }
  console.log('subjectOptions:::::::::::::::::::', subjectOptions)

  useEffect(() => {
    getSubjects()

    setFieldValue('timeTable', [
      {
        subject: '',
        examDate: '',
        startTime: '',
        endTime: '',
        passMark: '',
        totalMark: '',
        syllabus: '',
      },
    ])
  }, [])

  // const [rows, setRows] = useState([
  //   {
  //     subject: "",
  //     examDate: "",
  //     startTime: "",
  //     endTime: "",
  //     passMark: "",
  //     totalMark: "",
  //     syllabus: "",
  //   },
  // ]);

  const addRow = () => {
    let dummyList = [
      ...values.timeTable,
      {
        subject: '',
        examDate: '',
        startTime: '',
        endTime: '',
        passMark: '',
        totalMark: '',
        syllabus: '',
      },
    ]
    // setRows(dummyList);
    setFieldValue('timeTable', dummyList)
  }

  return (
    <>
      <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
        Exam Time Table
      </h2>

      <table className="mt-4 min-w-full table-fixed divide-y divide-gray-300 border border-gray-300">
        <thead className="bg-purple-100">
          <tr>
            <th className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2 w-48">
              Subject
            </th>
            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48">
              Exam Date
            </th>
            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32">
              Exam Start Time
            </th>
            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32">
              Exam End Time
            </th>
            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32">
              Pass Marks
            </th>
            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32">
              Total Marks
            </th>
            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48">
              Syllabus
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          <FieldArray name="timeTable">
            {({remove}) => (
              <>
                {values.timeTable.map((item, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      <CustomSelect
                        name={`timeTable.${index}.subject`}
                        options={subjectOptions}
                      />
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      <CustomDate name={`timeTable.${index}.examDate`} />
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      <CustomInput
                        name={`timeTable.${index}.startTime`}
                        type="time"
                      />
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      <CustomInput
                        name={`timeTable.${index}.endTime`}
                        type="time"
                      />
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      <CustomInput
                        name={`timeTable.${index}.passMark`}
                        placeholder="Pass Marks"
                      />
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      <CustomInput
                        name={`timeTable.${index}.totalMark`}
                        placeholder="Total Marks"
                      />
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      <CustomInput
                        name={`timeTable.${index}.syllabus`}
                        placeholder="Syllabus"
                      />
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
                ))}
              </>
            )}
          </FieldArray>
        </tbody>
      </table>
      <div className="flex items-center mt-2 w-full justify-end">
        <PlusIcon aria-hidden="true" className="text-purple-500 size-5" />
        <button
          onClick={addRow}
          className="text-purple-600 font-medium hover:text-purple-900"
        >
          Add Another Exam <span className="sr-only">add new period</span>
        </button>
      </div>
    </>
  )
}

export default ExamTimeTable
