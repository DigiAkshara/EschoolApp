import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import CustomSelect from "../commonComponent/CustomSelect";
import { Field, ErrorMessage } from "formik";

function ManageClassTimetable() {
  const [rows, setRows] = useState([
    {
      period: 1,
      time: "",
      monday: { subject: "", teacher: "" },
      tuesday: { subject: "", teacher: "" },
      wednesday: { subject: "", teacher: "" },
      thursday: { subject: "", teacher: "" },
      friday: { subject: "", teacher: "" },
      saturday: { subject: "", teacher: "" },
    },
  ]);

  // Add a new row for a new period
  const addRow = () => {
    setRows([
      ...rows,
      {
        period: rows.length + 1,
        time: "",
        monday: { subject: "", teacher: "" },
        tuesday: { subject: "", teacher: "" },
        wednesday: { subject: "", teacher: "" },
        thursday: { subject: "", teacher: "" },
        friday: { subject: "", teacher: "" },
        saturday: { subject: "", teacher: "" },
      },
    ]);
  };

  // Remove a row (period) from the timetable
  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };
  // Handle changes in time or subject/teacher data
  const handleChange = (index, day, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][day][field] = value;
    setRows(updatedRows);
  };

  const handleTimeChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].time = value;
    setRows(updatedRows);
  };

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
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
            >
              <a href="#" className="group inline-flex">
                Period Time
              </a>
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
            >
              <a href="#" className="group inline-flex">
                Monday
              </a>
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
            >
              <a href="#" className="group inline-flex">
                Tuesday
              </a>
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
            >
              <a href="#" className="group inline-flex">
                Wednesday
              </a>
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
            >
              <a href="#" className="group inline-flex">
                Thursday
              </a>
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
            >
              <a href="#" className="group inline-flex">
                Friday
              </a>
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
            >
              <a href="#" className="group inline-flex">
                Saturday
              </a>
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-12"
            >
              <a href="#" className="group inline-flex"></a>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="relative px-7 sm:w-12 sm:px-6">{row.period}</td>

              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                <Field
                  name="startTime"
                  placeholder="Enter Time"
                  type="text"
                  className="mb-2 block w-full  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                />
                <ErrorMessage
                  name="time"
                  component="div"
                  className="text-red-500"
                />
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                <Field
                  name="subject"
                  as="select"
                  className="mb-2 block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                >
                  <option value="" label="Select Subject" />
                  <option value="math" label="Math" />
                  <option value="science" label="Science" />
                  <option value="english" label="English" />
                </Field>
                <ErrorMessage
                  name="subject"
                  component="div"
                  className="text-red-500"
                />
                <Field
                  name="teacher"
                  as="select"
                  className="mb-2 block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                >
                  <option value="" label="Select Teacher" />
                  <option value="rama" label="Rama Krishna" />
                  <option value="teacher2" label="Teacher 2" />
                  <option value="teacher3" label="Teacher 3" />
                </Field>
                <ErrorMessage
                  name="teacher"
                  component="div"
                  className="text-red-500"
                />
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                <Field
                  name="subject"
                  as="select"
                  className="mb-2 block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                >
                  <option value="" label="Select Subject" />
                  <option value="math" label="Math" />
                  <option value="science" label="Science" />
                  <option value="english" label="English" />
                </Field>
                <ErrorMessage
                  name="subject"
                  component="div"
                  className="text-red-500"
                />
                <Field
                  name="teacher"
                  as="select"
                  className="mb-2 block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                >
                  <option value="" label="Select Teacher" />
                  <option value="rama" label="Rama Krishna" />
                  <option value="teacher2" label="Teacher 2" />
                  <option value="teacher3" label="Teacher 3" />
                </Field>
                <ErrorMessage
                  name="teacher"
                  component="div"
                  className="text-red-500"
                />
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                <Field
                  name="subject"
                  as="select"
                  className="mb-2 block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                >
                  <option value="" label="Select Subject" />
                  <option value="math" label="Math" />
                  <option value="science" label="Science" />
                  <option value="english" label="English" />
                </Field>
                <ErrorMessage
                  name="subject"
                  component="div"
                  className="text-red-500"
                />
                <Field
                  name="teacher"
                  as="select"
                  className="mb-2 block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                >
                  <option value="" label="Select Teacher" />
                  <option value="rama" label="Rama Krishna" />
                  <option value="teacher2" label="Teacher 2" />
                  <option value="teacher3" label="Teacher 3" />
                </Field>
                <ErrorMessage
                  name="teacher"
                  component="div"
                  className="text-red-500"
                />
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                <Field
                  name="subject"
                  as="select"
                  className="mb-2 block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                >
                  <option value="" label="Select Subject" />
                  <option value="math" label="Math" />
                  <option value="science" label="Science" />
                  <option value="english" label="English" />
                </Field>
                <ErrorMessage
                  name="subject"
                  component="div"
                  className="text-red-500"
                />
                <Field
                  name="teacher"
                  as="select"
                  className="mb-2 block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                >
                  <option value="" label="Select Teacher" />
                  <option value="rama" label="Rama Krishna" />
                  <option value="teacher2" label="Teacher 2" />
                  <option value="teacher3" label="Teacher 3" />
                </Field>
                <ErrorMessage
                  name="teacher"
                  component="div"
                  className="text-red-500"
                />
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                <Field
                  name="subject"
                  as="select"
                  className="mb-2 block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                >
                  <option value="" label="Select Subject" />
                  <option value="math" label="Math" />
                  <option value="science" label="Science" />
                  <option value="english" label="English" />
                </Field>
                <ErrorMessage
                  name="subject"
                  component="div"
                  className="text-red-500"
                />
                <Field
                  name="teacher"
                  as="select"
                  className="mb-2 block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                >
                  <option value="" label="Select Teacher" />
                  <option value="rama" label="Rama Krishna" />
                  <option value="teacher2" label="Teacher 2" />
                  <option value="teacher3" label="Teacher 3" />
                </Field>
                <ErrorMessage
                  name="teacher"
                  component="div"
                  className="text-red-500"
                />
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                <Field
                  name="subject"
                  as="select"
                  className="mb-2 block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                >
                  <option value="" label="Select Subject" />
                  <option value="math" label="Math" />
                  <option value="science" label="Science" />
                  <option value="english" label="English" />
                </Field>
                <ErrorMessage
                  name="subject"
                  component="div"
                  className="text-red-500"
                />
                <Field
                  name="teacher"
                  as="select"
                  className="mb-2 block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                >
                  <option value="" label="Select Teacher" />
                  <option value="rama" label="Rama Krishna" />
                  <option value="teacher2" label="Teacher 2" />
                  <option value="teacher3" label="Teacher 3" />
                </Field>
                <ErrorMessage
                  name="teacher"
                  component="div"
                  className="text-red-500"
                />
              </td>
              

              
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                        <button onClick={() => removeRow(index)}><XMarkIcon aria-hidden="true" className="text-red-500 size-5" /></button>
                                    </td>
            </tr>
          ))}

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
  );
}

export default ManageClassTimetable;
