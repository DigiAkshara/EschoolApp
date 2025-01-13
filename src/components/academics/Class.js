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
import {NEW_CLASS} from '../../app/url'
import {classCategory} from '../../commonComponent/CommonFunctions'
import AddClass from './AddClass'
import ManageViewClass from './ManageViewClass'
import {
  Button,
  Dialog,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import TableComponent from '../../commonComponent/TableComponent'

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
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  useEffect(() => {
    getClassData()
  }, [])

  const getClassData = async () => {
    try {
      const response = await getData(NEW_CLASS)
      if (response && response.data) {
        // Map through the fetched data to replace the category value with its label
        const transformedData = response.data.data.map((item) => {
          const categoryObject = classCategory.find(
            (cat) => cat.value === item.category,
          )
          return {
            ...item,
            category: categoryObject ? categoryObject.label : item.category, // Use label or fallback to original value
            time_table:"View",
            className:item.class.name,
            sectionName:item.section.section,
            classTeacher:item.classTeacher?item.classTeacher.firstName + " " + item.classTeacher.lastName:"N/A",
            totalStudents:item.totalStudents||0,
            actions: [
              {label: 'Edit', actionHandler: onHandleEdit},
              {label: 'Delete', actionHandler: onDelete},
            ],
          }
        })

        setClassData(transformedData)
      }
    } catch (error) {
      console.error('Error fetching class data:', error)
    }
  }

  const onHandleEdit = async () => {
    console.log("edit")
  }

  const onDelete = () => {
    console.log('delete')
  }



  function toggleAll() {
    setSelectedPeople(checked || indeterminate ? [] : people)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }

  const handleClose = () => setOpen(false)
  const handleClose2 = () => setOpen2(false)

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

  const columns = [
    {key:'board', title: 'Board'},
    {key: 'className', title: 'Class'},
    {key: 'sectionName', title: 'Section'},
    {key: 'totalStudents', title: 'Total Students'},
    {key: 'classTeacher', title: 'Class Teacher'},
    {key: 'time_table', title: 'Time Table/ Syllabus'},
    {key: 'actions', title: 'Actions'},
  ]

  const handleAction = {
    edit: (item) => console.log('Edit:', item),
    delete: (item) => console.log('Delete:', item),
  }

  const paginatedData = classData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  const handlePageChange = (page) => {
    setCurrentPage(page)
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
                <TableComponent 
                  columns={columns}
                  data={paginatedData}
                  pagination={{
                    currentPage,
                    totalPages: Math.ceil(classData.length / rowsPerPage),
                    onPageChange: handlePageChange,
                  }}
                  modalColumn="time_table"
                  showModal={(data)=>handleViewClick(data)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Class */}

      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <div className="fixed inset-0" />

        <AddClass onClose={handleClose} />
      </Dialog>

      <Dialog open={open2} onClose={setOpen2} className="relative z-50">
        <ManageViewClass onClose={handleClose2} />
      </Dialog>
    </>
  )
}
