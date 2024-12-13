import React, { useState } from 'react'
import Datepicker from "react-tailwindcss-datepicker";
import CustomDate from '../commonComponent/CustomDate';

function ExamTimeTable() {
    const [value, setValue] = useState({});
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
                                        <a
                                          href="#"
                                          className="group inline-flex"
                                        >
                                          Subject
                                        </a>
                                      </th>

                                      <th
                                        scope="col"
                                        className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
                                      >
                                        <a
                                          href="#"
                                          className="group inline-flex"
                                        >
                                          Exam Date
                                        </a>
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
                                      >
                                        <a
                                          href="#"
                                          className="group inline-flex"
                                        >
                                          Exam Start and End Time
                                        </a>
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32"
                                      >
                                        <a
                                          href="#"
                                          className="group inline-flex"
                                        >
                                          Pass Marks
                                        </a>
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-32"
                                      >
                                        <a
                                          href="#"
                                          className="group inline-flex"
                                        >
                                          Total Marks
                                        </a>
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-48"
                                      >
                                        <a
                                          href="#"
                                          className="group inline-flex"
                                        >
                                          Syllabus
                                        </a>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 bg-white">
                                    <tr>
                                      <td className="relative px-7 sm:w-12 sm:px-6">
                                        English
                                      </td>

                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      <CustomDate
                                      name="EED"
                                    //   label="Exam End Date"
                                    //   required={true}
                                    />
                                        
                                      </td>
                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                        
                                        <input
                                          id="time"
                                          name="time"
                                          type="time"
                                          label='Exam Start and End Time'
                                          placeholder="Enter time"
                                          autoComplete="email"
                                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                        /> 
                                      </td>

                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                        <input
                                          id="email"
                                          name="email"
                                          type="email"
                                          placeholder="Pass Marks"
                                          autoComplete="email"
                                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                        />
                                      </td>

                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                        <input
                                          id="email"
                                          name="email"
                                          type="email"
                                          placeholder="Total Marks"
                                          autoComplete="email"
                                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                        />
                                      </td>

                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                        <input
                                          id="email"
                                          name="email"
                                          type="email"
                                          placeholder="Syllabus"
                                          autoComplete="email"
                                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="relative px-7 sm:w-12 sm:px-6">
                                        Telugu
                                      </td>

                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                        <Datepicker
                                          inputClassName="inline-block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                          primaryColor={"purple"}
                                          useRange={false}
                                          asSingle={true}
                                          value={value}
                                          onChange={(newValue) =>
                                            setValue(newValue)
                                          }
                                        />
                                      </td>
                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                        <input
                                          id="email"
                                          name="email"
                                          type="email"
                                          placeholder="Enter"
                                          autoComplete="email"
                                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                        />
                                      </td>

                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                        <input
                                          id="email"
                                          name="email"
                                          type="email"
                                          placeholder="Pass Marks"
                                          autoComplete="email"
                                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                        />
                                      </td>

                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                        <input
                                          id="email"
                                          name="email"
                                          type="email"
                                          placeholder="Total Marks"
                                          autoComplete="email"
                                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                        />
                                      </td>

                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                        <input
                                          id="email"
                                          name="email"
                                          type="email"
                                          placeholder="Syllabus"
                                          autoComplete="email"
                                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
    </>
  )
}

export default ExamTimeTable