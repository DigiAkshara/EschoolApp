import {PlusIcon} from '@heroicons/react/20/solid'
import {XMarkIcon} from '@heroicons/react/24/outline'
import {FieldArray} from 'formik'
import React, {useEffect, useState} from 'react'
import {getData} from '../../app/api'
import {SUBJECTS} from '../../app/url'
import {teacher} from '../../commonComponent/CommonFunctions'
import CustomInput from '../../commonComponent/CustomInput'
import CustomSelect from '../../commonComponent/CustomSelect'

function ManageClassTimetable({values, setFieldValue, subjects, teachers}) {
  // const [subjects, setSubjects] = useState()

  const daysOfWeek = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ]

  useEffect(() => {
    // getSubjects()
    setFieldValue('timetables', [
      {
        period: 1,
        time: '',
        days: daysOfWeek.reduce(
          (acc, day) => ({...acc, [day]: {subject: '', teacher: ''}}),
          {},
        ),
      },
    ])
  }, [])

  
  const [rows, setRows] = useState([
    {
      period: 1,
      time: '',
      days: daysOfWeek.reduce(
        (acc, day) => ({...acc, [day]: {subject: '', teacher: ''}}),
        {},
      ),
    },
  ])

  // Add a new row for a new period

  const addRow = () => {
    let dummyList = [
      ...rows,
      {
        period: rows.length + 1,
        time: '',
        days: daysOfWeek.reduce(
          (acc, day) => ({...acc, [day]: {subject: '', teacher: ''}}),
          {},
        ),
      },
    ]
    // setRows(dummyList);
    setFieldValue('timetables', dummyList)
  }

  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index)
    setRows(updatedRows)
    setFieldValue('timetables', updatedRows)
  }

  return (
    <>
      <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
        Create Time Table
      </h2>

      <table className="mt-4 min-w-full table-fixed divide-y divide-gray-300 border border-gray-300">
        <thead className="bg-purple-100">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2 w-12"
            >
              <a href="#" className="group inline-flex">
                P. No
              </a>
            </th>

            <th
              scope="col"
              className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900"
            >
              <a href="#" className="group inline-flex">
                Period Time
              </a>
            </th>
            {daysOfWeek.map((day) => (
              <th
                key={day}
                scope="col"
                className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
              >
                <a href="#" className="group inline-flex">
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </a>
              </th>
            ))}

            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-12"
            >
              <a href="#" className="group inline-flex"></a>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          <FieldArray name="timetables">
            {() =>
              values.timetables.map((item, index) => (
                <tr key={index}>
                  <td className="relative px-7 sm:w-12 sm:px-6">
                    {item.period}
                  </td>

                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    <CustomInput
                      // name={item.passMarks}
                      name={`timetables.${index}.time`}
                      placeholder="9:00-10:00 "
                    />
                  </td>
                  {daysOfWeek.map((day) => (
                    <td
                      key={day}
                      className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                    >
                      <CustomSelect
                        isLabelRequired={false}
                        label="Subject"
                        name={`timetables.${index}.days.${day}.subject`}
                        options={subjects}
                      />

                      <CustomSelect
                        isLabelRequired={false}
                        label="Teacher"
                        name={`timetables.${index}.days.${day}.teacher`}
                        options={teachers}
                      />
                    </td>
                  ))}

                  {item.period !== 1 && (
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      <button onClick={() => removeRow(index)}>
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
          Add Another Period <span className="sr-only">add new period</span>
        </button>
      </div>
    </>
  )
}

export default ManageClassTimetable
