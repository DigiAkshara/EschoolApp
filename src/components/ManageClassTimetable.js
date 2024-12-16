import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import CustomSelect from "../commonComponent/CustomSelect";
import { SUBJECTS } from "../app/url";
import { getData } from "../app/api";
import CustomInput from "../commonComponent/CustomInput";
import { FieldArray } from "formik";



function ManageClassTimetable({ values, setFieldValue }) {
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const [subjects, setSubjects] = useState();

  useEffect(() => {
    getSubjects();
  }, []);

  const getSubjects = async () => {
    const res = await getData(SUBJECTS);
    console.log("comming subject data is:", res.data);

    const subData = res.data.data.map((item) => {
      return {
        label: item.name, // Displayed text in the dropdown
        value: item._id,
      };
    });
    setSubjects(subData);
  };
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
        days: daysOfWeek.reduce(
          (acc, day) => ({
            ...acc,
            [day]: { subject: "", teacher: "" },
          }),
          {}
        ),
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
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="relative px-7 sm:w-12 sm:px-6">{row.period}</td>

              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                <CustomInput name={`time-${index}`} type="time" />
              </td>
              {daysOfWeek.map((day) => (
              <td key={day} className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                <CustomSelect name={`subject-${day}-${index}`}  options={subjects} />

                <CustomSelect name={`teacher-${day}-${index}`} options={subjects} />
              </td>
              ))}
              
              {row.period !== 1 && (
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
