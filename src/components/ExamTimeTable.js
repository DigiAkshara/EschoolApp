import React, { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import CustomDate from "../commonComponent/CustomDate";
import CustomInput from "../commonComponent/CustomInput";
import { FieldArray } from "formik";
import { getData } from "../app/api";
import { SUBJECTS } from "../app/url";


function ExamTimeTable({ values, setFieldValue }) {
  const [subjects, setSubjects] = useState();

  const getSubjects = async () => {
    const res = await getData(SUBJECTS);
    console.log("comming subject data is:", res.data);
    let dumpList = [];
    res.data.data.forEach((item) => {
      dumpList.push({
        subject: item.name,
        examDate: "",
        startTime: "",
        endTime: "",
        passMark: "",
        totalMark: "",
        syllabus: "",
      });
    });
    console.log("comming data is:", res.data);
    setFieldValue("timeTable", dumpList);
    setSubjects(res.data);
  };

  useEffect(() => {
    getSubjects();
  }, []);

  return (
    <>
      <h2 className="text-base/7 font-semibold text-gray-900 mb-2">
        Exam Time Table
      </h2>

      <table className="mt-4 min-w-full table-fixed divide-y divide-gray-300 border border-gray-300">
        <thead className="bg-purple-100">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2 w-12"
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
                Exam Date
              </a>
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32"
            >
              <a href="#" className="group inline-flex">
                Exam Start Time
              </a>
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32"
            >
              <a href="#" className="group inline-flex">
                Exam End Time
              </a>
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32"
            >
              <a href="#" className="group inline-flex">
                Pass Marks
              </a>
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32"
            >
              <a href="#" className="group inline-flex">
                Total Marks
              </a>
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
            >
              <a href="#" className="group inline-flex">
                Syllabus
              </a>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          <FieldArray name="timeTable">
            {() =>
              values.timeTable.map((item, index) => (
                <tr key={index}>
                  <td className="relative px-7 sm:w-12 sm:px-6">
                    {item.subject}
                  </td>

                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    <CustomDate name={`timeTable.${index}.examDate`} />
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                    <CustomInput
                      id={item.startTime}
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
                </tr>
              ))
            }
          </FieldArray>
        </tbody>
      </table>
    </>
  );
}

export default ExamTimeTable;
