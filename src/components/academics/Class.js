'use client'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/20/solid'
import {
  ArrowDownTrayIcon,
  EllipsisHorizontalIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import {useEffect, useRef, useState} from 'react'

import React from 'react'
import {useDispatch} from 'react-redux'
import {useLocation, useNavigate} from 'react-router-dom'
import {getData} from '../../app/api'
import {setSelectedClass} from '../../app/reducers/classSlice'
import {NEWCLASS} from '../../app/url'
import {classCategory} from '../../commonComponent/CommonFunctions'
import ManageClass from './ManageClass'
import ManageViewClass from './ManageViewClass'
import {
  Button,
  Dialog,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'

const people = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
  // More people...
]

const tabs = [
  {name: 'Daily Time table', path: '#'},
  {name: 'Classes', path: '/classesNew'},
  {name: 'Exams', path: '/exams'},
  {name: 'Certificates', path: '/certificates'},
]

export default function Class() {
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  // const checkbox = useRef()
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedPeople, setSelectedPeople] = useState([])
  const [classData, setClassData] = useState([])
  const dispatch = useDispatch() // Get the dispatch function

  useEffect(() => {
    getClassData()
  }, [])

  const getClassData = async () => {
    try {
      const response = await getData(NEWCLASS)
      console.log('Response is:', response.data)

      if (response && response.data) {
        // Map through the fetched data to replace the category value with its label
        const transformedData = response.data.data.map((item) => {
          const categoryObject = classCategory.find(
            (cat) => cat.value === item.category,
          )
          return {
            ...item,
            category: categoryObject ? categoryObject.label : item.category, // Use label or fallback to original value
          }
        })

        setClassData(transformedData)
      }
    } catch (error) {
      console.error('Error fetching class data:', error)
    }
  }

  function toggleAll() {
    setSelectedPeople(checked || indeterminate ? [] : people)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }

  const [animal, setAnimal] = useState(null)

  const handleChange = (value) => {
    console.log('value:', value)
    setAnimal(value)
  }
  const handleClose = () => setOpen(false)
  const handleClose2 = () => setOpen2(false)

  const handleTabChange = (event) => {
    const selectedTab = tabs.find((tab) => tab.name === event.target.value)
    if (selectedTab) {
      navigate(selectedTab.path)
    }
  }

  const checkbox = useRef(null)

  useEffect(() => {
    if (checkbox.current) {
      checkbox.current.indeterminate =
        selectedPeople.length > 0 && selectedPeople.length < people.length
    }
  }, [selectedPeople, people])

  const groupedData = classData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {})

  const handleViewClick = (data) => {
    dispatch(setSelectedClass(data)) // Save selected class in Redux
    setOpen2(true) // Navigate to the "View More" page
  }

  return (
    <>
      <div className="mt-4 flex justify-between">
        <div className="text-lg text-gray-900 font-medium">Classes</div>

        <div className="right-btns-blk space-x-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Class
          </button>
        </div>
      </div>

      <div className="filter-badges-blk mt-4 flex flex-wrap gap-x-4">
        <span className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          Class:<span className="font-bold">1</span>
          <button
            type="button"
            className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
          >
            <span className="sr-only">Remove</span>
            <svg
              viewBox="0 0 14 14"
              className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
            >
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>
        </span>
        <span className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          Section:<span className="font-bold">A</span>
          <button
            type="button"
            className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
          >
            <span className="sr-only">Remove</span>
            <svg
              viewBox="0 0 14 14"
              className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
            >
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>
        </span>

        <Button className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
          Clear All
        </Button>
      </div>

      <div className="-mx-2 -my-2 mt-0 overflow-x-auto sm:-mx-6">
        <div className="inline-block min-w-full py-4 align-middle sm:px-6">
          <div className="relative">
            {selectedPeople.length > 0 && (
              <div className="absolute left-20 top-0 flex h-12 items-center space-x-3 bg-white sm:left-72">
                <button
                  type="button"
                  className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                >
                  Delete
                </button>
              </div>
            )}
            <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              <div className="relative table-tool-bar z-30">
                <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-3 sm:px-4">
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <div className="relative rounded-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon
                            aria-hidden="true"
                            className="size-4 text-gray-400"
                          />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Search"
                          className="block w-full rounded-md border-0 py-1 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 text-sm"
                        />
                      </div>
                    </div>

                    <div className="right-action-btns-blk space-x-4">
                      <button
                        type="button"
                        className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        <ArrowDownTrayIcon
                          aria-hidden="true"
                          className="size-5"
                        />
                      </button>
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <MenuButton className="relative inline-flex items-center rounded bg-white px-2 py-1 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            <FunnelIcon aria-hidden="true" className="size-5" />
                            Filters
                            <span className="flex items-center justify-center text-center absolute w-5 h-5 rounded-full bg-red-500 text-white font-medium text-xs -right-2 -top-2">
                              3
                            </span>
                          </MenuButton>
                        </div>

                        <MenuItems
                          transition
                          className="max-h-[430px] overflow-y-auto absolute right-0 z-10 mt-2 px-4 py-4 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                          <div className="grid gap-3 ">
                            <MenuItem className="group mb-2">
                              <div className="flex">
                                <FunnelIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                                <span className="pl-2">Select Filters</span>
                              </div>
                            </MenuItem>
                            <MenuItem>
                              <div className="">
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  Class Category
                                </label>
                                <div className="mt-2">
                                  <select
                                    id="location"
                                    name="location"
                                    defaultValue="2024-2025"
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                  >
                                    <option>Fee Name Title</option>
                                    <option>Canada</option>
                                    <option>Mexico</option>
                                  </select>
                                </div>
                              </div>
                            </MenuItem>

                            <MenuItem>
                              <div className="">
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  Class
                                </label>
                                <div className="mt-2">
                                  <select
                                    id="location"
                                    name="location"
                                    defaultValue="All"
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                  >
                                    <option>Fee Name Title</option>
                                    <option>Canada</option>
                                    <option>Mexico</option>
                                  </select>
                                </div>
                              </div>
                            </MenuItem>

                            <MenuItem>
                              <div className="">
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  Section
                                </label>
                                <div className="mt-2">
                                  <select
                                    id="location"
                                    name="location"
                                    defaultValue="All"
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                  >
                                    <option>Fee Name Title</option>
                                    <option>Canada</option>
                                    <option>Mexico</option>
                                  </select>
                                </div>
                              </div>
                            </MenuItem>
                            <MenuItem>
                              <div className="">
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  Class Teacher
                                </label>
                                <div className="mt-2">
                                  <select
                                    id="location"
                                    name="location"
                                    defaultValue="All"
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                  >
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                  </select>
                                </div>
                              </div>
                            </MenuItem>
                            <MenuItem>
                              <div className="">
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  Board
                                </label>
                                <div className="mt-2">
                                  <select
                                    id="location"
                                    name="location"
                                    defaultValue="All"
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                  >
                                    <option>Fee Name Title</option>
                                    <option>Canada</option>
                                    <option>Mexico</option>
                                  </select>
                                </div>
                              </div>
                            </MenuItem>

                            <MenuItem>
                              <div className="flex">
                                <button
                                  type="button"
                                  onClick={() => setOpen(false)}
                                  className="w-1/2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className=" w-1/2 ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                                >
                                  Apply
                                </button>
                              </div>
                            </MenuItem>
                          </div>
                        </MenuItems>
                      </Menu>
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-container-main overflow-y-auto max-h-[56vh]">
                {/* Table View */}

                <table className="table-auto min-w-full divide-y divide-gray-300">
                  <thead className="sticky top-0 bg-purple-100 z-20">
                    <tr>
                      <th className="relative px-7 sm:w-12 sm:px-6">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                          onChange={() => {}}
                        />
                      </th>
                      <th className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900">
                        Board
                      </th>
                      <th className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Class
                      </th>
                      <th className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Section
                      </th>
                      <th className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Total Students
                      </th>
                      <th className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Class Teacher
                      </th>
                      <th className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Time Table & Syllabus
                      </th>
                      <th className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white z-1">
                    {Object.entries(groupedData).map(([category, items]) => (
                      <>
                        {/* Category Row */}
                        <tr key={category} className="border-t border-gray-200">
                          <th
                            scope="colgroup"
                            colSpan={8}
                            className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                          >
                            {category}
                          </th>
                        </tr>

                        {/* Data Rows */}
                        {items.map((data, index) => (
                          <tr
                            key={data._id || index}
                            className="border-t border-gray-200"
                          >
                            <td className="relative px-7 sm:w-12 sm:px-6">
                              <input
                                type="checkbox"
                                className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                              />
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                              {data.board}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                              {data.class}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                              {data.section}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                              {data.totalStudents || '-'}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                              {data.classTeacher || '-'}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                              <a href="#" onClick={() => handleViewClick(data)}>
                                View
                              </a>
                            </td>
                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-3">
                              <Menu
                                as="div"
                                className="relative inline-block text-left"
                              >
                                <div>
                                  <MenuButton className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                                    <EllipsisHorizontalIcon
                                      aria-hidden="true"
                                      className="size-5"
                                    />
                                  </MenuButton>
                                </div>
                                <MenuItems className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none">
                                  <div className="py-1">
                                    <MenuItem>
                                      <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700"
                                      >
                                        Edit
                                      </a>
                                    </MenuItem>
                                    <MenuItem>
                                      <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700"
                                      >
                                        Delete
                                      </a>
                                    </MenuItem>
                                  </div>
                                </MenuItems>
                              </Menu>
                            </td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination">
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-3 py-3 sm:px-3">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <a
                      href="#"
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Previous
                    </a>
                    <a
                      href="#"
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Next
                    </a>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to{' '}
                        <span className="font-medium">10</span> of{' '}
                        <span className="font-medium">97</span> results
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
                        {/* Current: "z-10 bg-purple-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
                        <a
                          href="#"
                          aria-current="page"
                          className="relative z-10 inline-flex items-center bg-purple-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                        >
                          1
                        </a>
                        <a
                          href="#"
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          2
                        </a>
                        <a
                          href="#"
                          className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                        >
                          3
                        </a>
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                          ...
                        </span>
                        <a
                          href="#"
                          className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                        >
                          8
                        </a>
                        <a
                          href="#"
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          9
                        </a>
                        <a
                          href="#"
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          10
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Class */}

      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <div className="fixed inset-0" />

        <ManageClass onClose={handleClose} />
      </Dialog>

      <Dialog open={open2} onClose={setOpen2} className="relative z-50">
        <ManageViewClass onClose={handleClose2} />
      </Dialog>
    </>
  )
}
