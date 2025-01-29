import { DialogPanel, DialogTitle } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  DocumentArrowDownIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { capitalizeWords, handleApiResponse } from "../../../commonComponent/CommonFunctions";
import { ACADEMICS } from "../../../app/url";
import { getData } from "../../../app/api";

function ExamDetailsPage({ onClose }) {
  const [students, setStudents] = useState([]);
  const selectedExam = useSelector((state) => state.exams.selectedExam);
  const subjects = useSelector((state) => state.academics.subjects);

  const classId = selectedExam?.classObject._id;
  const sectionId = selectedExam?.sectionObject._id;

  useEffect(() => {
    getStudent();
     })
const getStudent = async () => {
  try {
   
    const response = await getData(ACADEMICS +"/"+ classId +"/"+ sectionId);
    if(response.data?.data) {
      const studentsData = response.data.data.map((item) => ({
        _id: item.student._id,
        pic: item.student.profilePic?.Location || "",
        name: `${item.student.firstName} ${item.student.lastName}`,
        admissionNo: item.student.admissionNumber,
        className: item.class?.name || "N/A",
        section: item.section || "N/A",
      }))
      console.log("student data", studentsData);
      
      setStudents(studentsData);
    console.log(response.data.data);
    }
     } catch (error) {
    handleApiResponse(error);
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
              className="pointer-events-auto w-screen max-w-7xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="bg-purple-900 px-3 py-3 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className=" text-base font-semibold text-white">
                        View Exams Info
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
                    <div className="form-content">
                      <ul
                        role="list"
                        className="grid grid-cols-1 gap-x-4 gap-y-4"
                      >
                        <li
                          key="12"
                          className="overflow-hidden rounded-xl border border-gray-300"
                        >
                          <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                            <div className="flex items-center item-title-blk">
                              <div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
                                <UserCircleIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              </div>
                              <div className="text-lg pl-4 font-medium text-gray-900">
                                Class Details
                              </div>
                            </div>
                          </div>

                          <div className="px-4 py-4 text-sm/6">
                            <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Board
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedExam?.board}
                                </dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Class Category
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedExam?.classCategory?.name}
                                </dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Class
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedExam?.className}
                                </dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Section
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedExam?.sectionName}
                                </dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Exam Name{" "}
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedExam?.examName}
                                </dd>
                              </div>

                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Exam Dates
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedExam?.examDates}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </li>

                        <li
                          key="12"
                          className="overflow-hidden rounded-xl border border-gray-300"
                        >
                          <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                            <div className="flex items-center item-title-blk">
                              <div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
                                <UserCircleIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              </div>
                              <div className="text-lg pl-4 font-medium text-gray-900">
                                {" "}
                                Exam Time Table
                              </div>
                            </div>
                          </div>

                          <div className="px-4 py-4 text-sm/6">
                            <table className="min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
                              <thead className="bg-purple-100">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Subject Name
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Exam Date
                                    </a>
                                  </th>

                                  <th
                                    scope="col"
                                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Exam Start and End Time
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Pass Marks
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Total Marks
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Syllabus
                                    </a>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {selectedExam?.timeTable.map((exam, index) => (
                                  <tr Key={index}>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 pl-4">
                                      {subjects.map((subject) => {
                                        if (subject.value === exam.subject) {
                                          return (
                                            <span>
                                              {capitalizeWords(subject.label)}
                                            </span>
                                          );
                                        }
                                      })}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      {exam.examDate}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      {exam.startTime} - {exam.endTime}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 pl-4">
                                      {exam.passMark}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      {exam.totalMark}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      {exam.syllabus}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </li>

                        <li
                          key="12"
                          className="overflow-hidden rounded-xl border border-gray-300"
                        >
                          <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                            <div className="flex items-center item-title-blk">
                              <div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
                                <UserCircleIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              </div>
                              <div className="text-lg pl-4 font-medium text-gray-900">
                                Hall Tickets
                              </div>
                            </div>
                          </div>

                          <div className="px-4 py-4 text-sm/6">
                            <ul
                              role="list"
                              className="grid grid-cols-4 gap-x-6 gap-y-8"
                            >
                              <li
                                key="12"
                                className="overflow-hidden rounded-xl border border-gray-300"
                              >
                                <div className="flex items-center justify-between gap-x-4 px-4 py-4">
                                  <div className="flex items-center item-title-blk">
                                    <div className="inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white">
                                      <DocumentArrowDownIcon
                                        aria-hidden="true"
                                        className="size-5"
                                      />
                                    </div>
                                    <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
                                      <span>{selectedExam?.examName} - {selectedExam?.className}-{selectedExam?.sectionName}</span>
                                    </div>
                                  </div>
                                  <a href="#" className="text-gray-400">
                                    <EyeIcon
                                      aria-hidden="true"
                                      className="size-5"
                                    />
                                  </a>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center justify-between px-4 py-4 bg-gray-100">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> out of{" "}
                      <span className="font-medium">122</span> results
                    </p>
                  </div>
                  <div>
                    <nav
                      aria-label="Pagination"
                      className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    >
                      <a
                        href="#"
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon
                          aria-hidden="true"
                          className="size-5"
                        />
                      </a>

                      <a
                        href="#"
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon
                          aria-hidden="true"
                          className="size-5"
                        />
                      </a>
                    </nav>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExamDetailsPage;
