import {DialogPanel, DialogTitle} from '@headlessui/react'
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/20/solid'
import {
  ArrowsUpDownIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {UserCircleIcon} from '@heroicons/react/24/solid'
import React from 'react'
import {useSelector} from 'react-redux'

const tableData = [
  {
    rollNo: 1,
    name: 'Janet Baker',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    id: 112345,
    english: 87,
    telugu: 58,
    maths: 56,
    social: 66,
    science: 74,
    hindi: 43,
    marksObtained: 384,
    maxMarks: 550,
    percentage: '64%',
    result: 'Pass',
  },
  {
    rollNo: 2,
    name: 'Janet Baker',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    id: 112345,
    english: 87,
    telugu: 87,
    maths: 87,
    social: 87,
    science: 87,
    hindi: 87,
    marksObtained: 522,
    maxMarks: 600,
    percentage: '87%',
    result: 'Pass',
  },
  {
    rollNo: 3,
    name: 'Janet Baker',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    id: 112345,
    english: 44,
    telugu: 46,
    maths: 28,
    social: 22,
    science: 38,
    hindi: 37,
    marksObtained: 215,
    maxMarks: 550,
    percentage: '45%',
    result: 'Failed',
  },
]

function ExamMarkDetailsPage({onClose}) {
  const selectedExam = useSelector((state) => state.exams.selectedExam)
  console.log('redux data :', selectedExam)

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
                        View Exam Results
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
                                Exam Details
                              </div>
                            </div>
                          </div>

                          <div className="px-4 py-4 text-sm/6">
                            <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Board
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium"></dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Class Category
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium"></dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Class
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  Class 1
                                </dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Section
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium"></dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Subjects Included
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium"></dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Exam Name{' '}
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium"></dd>
                              </div>

                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Exam Dates
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium"></dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Class Total Pass Percentage
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium"></dd>
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
                                {' '}
                                Exam Results
                              </div>
                            </div>
                          </div>

                          <div className="px-4 py-4 text-sm/6">
                            {/* <table className="min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
                              <thead className="bg-purple-100">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Student Name
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
                              {selectedExam.timeTable.map((exam, index) => (

                                <tr Key={index}>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 pl-4">
                                  {exam.subject}
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
                            </table> */}
                            <table className="min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
                              <thead className="bg-purple-100">
                                <tr>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Roll no
                                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                        <ArrowsUpDownIcon
                                          aria-hidden="true"
                                          className="size-4"
                                        />
                                      </span>
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Student Name
                                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                        <ArrowsUpDownIcon
                                          aria-hidden="true"
                                          className="size-4"
                                        />
                                      </span>
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                  >
                                    <a href="#" className="group inline-flex">
                                      English (100)
                                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                        <ArrowsUpDownIcon
                                          aria-hidden="true"
                                          className="size-4"
                                        />
                                      </span>
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Telugu (100)
                                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                        <ArrowsUpDownIcon
                                          aria-hidden="true"
                                          className="size-4"
                                        />
                                      </span>
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Maths(100)
                                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                        <ArrowsUpDownIcon
                                          aria-hidden="true"
                                          className="size-4"
                                        />
                                      </span>
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Social(100)
                                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                        <ArrowsUpDownIcon
                                          aria-hidden="true"
                                          className="size-4"
                                        />
                                      </span>
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Science(100)
                                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                        <ArrowsUpDownIcon
                                          aria-hidden="true"
                                          className="size-4"
                                        />
                                      </span>
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Hindi(100)
                                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                        <ArrowsUpDownIcon
                                          aria-hidden="true"
                                          className="size-4"
                                        />
                                      </span>
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Mark Obt.
                                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                        <ArrowsUpDownIcon
                                          aria-hidden="true"
                                          className="size-4"
                                        />
                                      </span>
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Max Marks
                                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                        <ArrowsUpDownIcon
                                          aria-hidden="true"
                                          className="size-4"
                                        />
                                      </span>
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Per(%)
                                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                        <ArrowsUpDownIcon
                                          aria-hidden="true"
                                          className="size-4"
                                        />
                                      </span>
                                    </a>
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                  >
                                    <a href="#" className="group inline-flex">
                                      Result
                                      <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                                        <ArrowsUpDownIcon
                                          aria-hidden="true"
                                          className="size-4"
                                        />
                                      </span>
                                    </a>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white z-1">
                                {tableData.map((student, index) => (
                                  <tr key={index}>
                                    <td className="px-2 py-2 text-sm">
                                      {student.rollNo}
                                    </td>
                                    <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm sm:pl-0">
                                      <a
                                        href="#"
                                        className="text-purple-600 hover:text-purple-900"
                                      >
                                        <div className="flex items-center">
                                          <div className="size-9 shrink-0">
                                            <img
                                              src={student.imageUrl}
                                              alt={student.name}
                                              className="size-9 rounded-full"
                                            />
                                          </div>
                                          <div className="ml-4">
                                            <div className="font-medium text-gray-900 text-purple-600">
                                              {student.name}
                                            </div>
                                            <div className="mt-1 text-gray-500">
                                              {student.id}
                                            </div>
                                          </div>
                                        </div>
                                      </a>
                                    </td>

                                    <td className="px-2 py-2 text-sm">
                                      {student.english}
                                    </td>
                                    <td className="px-2 py-2 text-sm">
                                      {student.telugu}
                                    </td>
                                    <td className="px-2 py-2 text-sm">
                                      {student.maths}
                                    </td>
                                    <td className="px-2 py-2 text-sm">
                                      {student.social}
                                    </td>
                                    <td className="px-2 py-2 text-sm">
                                      {student.science}
                                    </td>
                                    <td className="px-2 py-2 text-sm">
                                      {student.hindi}
                                    </td>
                                    <td className="px-2 py-2 text-sm">
                                      {student.marksObtained}
                                    </td>
                                    <td className="px-2 py-2 text-sm">
                                      {student.maxMarks}
                                    </td>
                                    <td className="px-2 py-2 text-sm">
                                      {student.percentage}
                                    </td>
                                    <td className="px-2 py-2 text-sm">
                                      <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                          student.result === 'Pass'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}
                                      >
                                        {student.result}
                                      </span>
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
                                Progress Cards
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
                                      <span>Unit 1 - Class 1A</span>
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
                      Showing <span className="font-medium">1</span> out of{' '}
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
  )
}

export default ExamMarkDetailsPage
