'use client'
import {DialogPanel, DialogTitle} from '@headlessui/react'
import {
  DocumentArrowDownIcon,
  EyeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {UserCircleIcon} from '@heroicons/react/24/solid'
import React from 'react'
import {useSelector} from 'react-redux'

function ManageViewClass({onClose}) {
  const selectedClass = useSelector((state) => state.class.selectedClass)
  console.log('redux class data :', selectedClass)

  const timetables = selectedClass?.timetables || []
  const syllabus = selectedClass?.syllabus || []

  // Utility to get subject and teacher details
  const getDayData = (day, daysData) => {
    const dayInfo = daysData[day.toLowerCase()]
    if (!dayInfo) return <div className="text-gray-500">N/A</div>

    // Example: Match subject label and return formatted content
    const subject =
      selectedClass.theorySubjects.find((s) => s.value === dayInfo.subject)
        ?.label || 'Unknown'
    return (
      <div className="flex flex-col">
        <span>{subject}</span>
        <span>{dayInfo.teacher}</span>
      </div>
    )
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
                        View Class Info
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
                                  {selectedClass.board}
                                </dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Class Category
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedClass.category}
                                </dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Class
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedClass.class}
                                </dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Section
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedClass.section}
                                </dd>
                              </div>
                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Class Teacher{' '}
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  nil
                                </dd>
                              </div>

                              <div className="content-item pb-2 border-b border-gray-300">
                                <dt className="text-sm/6 text-gray-500">
                                  Subjects
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {selectedClass.theorySubjects &&
                                  selectedClass.theorySubjects.length > 0
                                    ? selectedClass.theorySubjects.map(
                                        (subject, index) => (
                                          <span key={index} className="block">
                                            {subject.label}
                                          </span>
                                        ),
                                      )
                                    : 'No Subjects Available'}
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
                                Time Table
                              </div>
                            </div>
                          </div>

                          <div className="px-4 py-4 text-sm/6">
                            {/* <table className="min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
                            <thead className="bg-purple-100">
                              <tr>
                                
                                <th scope="col" className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 pl-4 w-18">
                                  <a href="#" className="group inline-flex">
                                  P. No
                                  </a>
                                </th>
                                                                    
                                <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900">
                                  <a href="#" className="group inline-flex">
                                  Period  Time
                                  </a>
                                </th>
                                <th scope="col" className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900">
                                  <a href="#" className="group inline-flex">
                                  Monday
                                  </a>
                                </th>
                                                                    
                                <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900">
                                  <a href="#" className="group inline-flex">
                                  Tuesday
                                  </a>
                                </th>
                                <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900">
                                  <a href="#" className="group inline-flex">
                                  Wednesday
                                  </a>
                                </th>
                                <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900">
                                  <a href="#" className="group inline-flex">
                                  Thursday
                                  </a>
                                </th>
                                <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900">
                                  <a href="#" className="group inline-flex">
                                  Friday
                                  </a>
                                </th>
                                <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900">
                                  <a href="#" className="group inline-flex">
                                  Saturday
                                  </a>
                                </th>
                                
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                <tr>
                                  
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 pl-4">1</td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">9:00 - 9:40</td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">9:00 - 9:40</td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                    <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                  </td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 flex flex-col">
                                    <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                  </td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                    <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                  </td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 flex flex-col">
                                    <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                  </td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                    <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                  </td>
                                  
                                </tr>
                                
                                
                                <tr className="border-t border-gray-200 bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 pl-4">3</td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">9:00 - 9:40</td>
                                  <td
                                      scope="colgroup"
                                      colSpan={6}
                                      className="whitespace-nowrap px-2 py-2 text-sm text-gray-900"
                                    >
                                      Lunch Break
                                  </td>

                                </tr>
                                
                                <tr>
                                  
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 pl-4">4</td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">9:00 - 9:40</td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">9:00 - 9:40</td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                    <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                  </td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 flex flex-col">
                                    <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                  </td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                    <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                  </td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 flex flex-col">
                                    <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                  </td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                    <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                  </td>
                                  
                                </tr>
                                
                            
                              
                              
                            </tbody>
                          </table> */}

                            <table className="min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
                              <thead className="bg-purple-100">
                                <tr>
                                  <th className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 pl-4 w-18">
                                    P. No
                                  </th>
                                  <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900">
                                    Period Time
                                  </th>
                                  {[
                                    'Monday',
                                    'Tuesday',
                                    'Wednesday',
                                    'Thursday',
                                    'Friday',
                                    'Saturday',
                                  ].map((day) => (
                                    <th
                                      key={day}
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                    >
                                      {day}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {timetables.map((timetable, index) => (
                                  <tr key={index}>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 pl-4">
                                      {timetable.period}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      {timetable.time}
                                    </td>
                                    {[
                                      'Monday',
                                      'Tuesday',
                                      'Wednesday',
                                      'Thursday',
                                      'Friday',
                                      'Saturday',
                                    ].map((day) => (
                                      <td
                                        key={day}
                                        className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                                      >
                                        {getDayData(day, timetable.days)}
                                      </td>
                                    ))}
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
                                Syllabus 2023-2024
                              </div>
                            </div>
                          </div>

                          {/* <div className="px-4 py-4 text-sm/6">
                            
                          <ul role="list" className="grid grid-cols-4 gap-x-6 gap-y-8">
                              <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                                <div className="flex items-center justify-between gap-x-4 px-4 py-4">
                                  <div className='flex items-center item-title-blk'>
                                      <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                                        <DocumentArrowDownIcon aria-hidden="true" className="size-5" />
                                      </div>
                                      <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
                                        <span>English</span>
                                      </div>
                                  </div>
                                  <a href='#' className='text-gray-400'>
                                    <EyeIcon aria-hidden="true" className="size-5" />
                                  </a>
                                </div>
                              </li>
                              <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                                <div className="flex items-center justify-between gap-x-4 px-4 py-4">
                                  <div className='flex items-center item-title-blk'>
                                      <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                                        <DocumentArrowDownIcon aria-hidden="true" className="size-5" />
                                      </div>
                                      <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
                                        <span>Telugu</span>
                                      </div>
                                  </div>
                                  <a href='#' className='text-gray-400'>
                                    <EyeIcon aria-hidden="true" className="size-5" />
                                  </a>
                                </div>
                              </li>
                              <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                                <div className="flex items-center justify-between gap-x-4 px-4 py-4">
                                  <div className='flex items-center item-title-blk'>
                                      <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                                        <DocumentArrowDownIcon aria-hidden="true" className="size-5" />
                                      </div>
                                      <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
                                        <span>Social</span>
                                      </div>
                                  </div>
                                  <a href='#' className='text-gray-400'>
                                    <EyeIcon aria-hidden="true" className="size-5" />
                                  </a>
                                </div>
                              </li>
                              <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                                <div className="flex items-center justify-between gap-x-4 px-4 py-4">
                                  <div className='flex items-center item-title-blk'>
                                      <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                                        <DocumentArrowDownIcon aria-hidden="true" className="size-5" />
                                      </div>
                                      <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
                                        <span>Science</span>
                                      </div>
                                  </div>
                                  <a href='#' className='text-gray-400'>
                                    <EyeIcon aria-hidden="true" className="size-5" />
                                  </a>
                                </div>
                              </li>



                           </ul>     
                                
                                
                             
                            
                          </div> */}
                          <div className="px-4 py-4 text-sm/6">
                            <ul
                              role="list"
                              className="grid grid-cols-4 gap-x-6 gap-y-8"
                            >
                              {syllabus.map((item, index) => (
                                <li
                                  key={item.id}
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
                                        <span>{item.subject}</span>{' '}
                                        {/* Displaying the subject name */}
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
                              ))}
                            </ul>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 px-4 py-4 bg-gray-100 w-full justify-end">
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
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </>
  )
}

export default ManageViewClass
