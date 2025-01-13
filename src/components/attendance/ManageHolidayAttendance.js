import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react'
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/20/solid'
import {
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'
import {Form, Formik} from 'formik'
import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {getData, postData} from '../../app/api'
import {ACADEMIC_YEAR, HOLIDAYS} from '../../app/url'
import {
  capitalizeWords,
  formatDateRange,
} from '../../commonComponent/CommonFunctions'
import ManageHolidaySidebar from './ManageHolidaySidebar'

const ManageHolidayAttendance = () => {
  const [academicYears, setAcademicYears] = useState([])
  const [holidaysData, setHolidaysData] = useState([])
  const [studentList, setStudentList] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 5

  const getInitialValues = () => {
    return {
      academicYear: '',
      startDate: '',
      endDate: '',
      name: '',
    }
  }

  const getValidationSchema = () => {
    return Yup.object({
      academicYear: Yup.string().required('Academic year is required'),
      startDate: Yup.date().nullable().required(' Date  is required'),
      endDate: Yup.date().nullable().required(' Date  is required'),
      name: Yup.string().required(' Holiday name is required'),
    })
  }

  useEffect(() => {
    academicyear()
    getHolidayData()
  }, [])

  const academicyear = async () => {
    try {
      const academicYearRes = await getData(ACADEMIC_YEAR)
      if (academicYearRes.status === 200 || academicYearRes.status === 201) {
        let academicYearData = [
          {
            label: academicYearRes.data.data.year, // Displayed text in the dropdown
            value: academicYearRes.data.data._id,
          },
        ]
        setAcademicYears(academicYearData)
      } else {
        throw new Error(academicYearRes.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setFilteredData(
      studentList.filter((student) =>
        student.name.toLowerCase().includes(query),
      ),
    )
  }

  const getHolidayData = async () => {
    try {
      const response = await getData(HOLIDAYS)
      setHolidaysData(response.data.data)
    } catch (error) {
      console.error('Error getting data:', error)
    }
  }

  const handleSubmit = async (values) => {
    try {
      const response = await postData(HOLIDAYS, values)
      if (response.data) {
        setHolidaysData((prevData) => [...prevData, response.data.data])
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const formatHolidayDate = (startDate, endDate) => {
    const formatStartDate = formatDateRange(startDate)
    const formatEndDate = formatDateRange(endDate)
    return formatStartDate === formatEndDate
      ? formatStartDate
      : `${formatStartDate} to ${formatEndDate}`
  }

  return (
    <>
      <Formik
        initialValues={getInitialValues()}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
      >
        {({values, setFieldValue, errors, touched}) => (
          <Form>
            <div className="flex flex-col lg:flex-row gap-6 mt-4 min-h-screen">
              {/* Sidebar */}
              <ManageHolidaySidebar
                values={values}
                academicYears={academicYears}
              />

              {/* Main Content */}
              <div className="-mx-2 -my-2  mt-0 overflow-x-auto sm:-mx-6  w-full lg:w-3/4">
                <div className="inline-block min-w-full align-middle sm:px-6 ">
                  <div className="relative">
                    <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
                      <div className="relative table-tool-bar z-30">
                        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-3 sm:px-4">
                          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                              <div className="relative rounded-md  inline-block  ">
                                <input
                                  id="email"
                                  name="email"
                                  type="email"
                                  placeholder="Search"
                                  onChange={handleSearch}
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
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="table-container-main overflow-y-auto max-h-[56vh]">
                        {/* Table View */}
                        <table className="table-auto min-w-full divide-y divide-gray-300">
                          <thead className="sticky top-0 bg-purple-100 z-20">
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                              >
                                <a href="#" className="group inline-flex">
                                  Si.No.
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
                                  Holiday
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
                                className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                <a href="#" className="group inline-flex">
                                  Date
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
                                className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                <a href="#" className="group inline-flex">
                                  No.of Days
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
                                className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                <a href="#" className="group inline-flex">
                                  Actions
                                </a>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white z-1">
                            {holidaysData.map((holiday, index) => (
                              <tr key={holiday.id} className="bg-gray-50 ">
                                <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm sm:pl-2">
                                  {index + 1}
                                </td>
                                <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm sm:pl-2">
                                  {capitalizeWords(holiday.name)}
                                </td>
                                <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm sm:pl-2">
                                  {formatHolidayDate(
                                    holiday.startDate,
                                    holiday.endDate,
                                  )}
                                </td>
                                <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm sm:pl-2">
                                  {Math.ceil(
                                    (new Date(holiday.endDate) -
                                      new Date(holiday.startDate)) /
                                      (1000 * 60 * 60 * 24),
                                  )}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-3">
                                  <Menu
                                    as="div"
                                    className="relative inline-block text-left"
                                  >
                                    <div>
                                      <MenuButton className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                                        <span className="sr-only">
                                          Open options
                                        </span>
                                        <EllipsisHorizontalIcon
                                          aria-hidden="true"
                                          className="size-5"
                                        />
                                      </MenuButton>
                                    </div>

                                    <MenuItems
                                      transition
                                      className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                    >
                                      <div className="py-1">
                                        <MenuItem>
                                          <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                          >
                                            Edit
                                          </a>
                                        </MenuItem>
                                        <MenuItem>
                                          <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
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
                                Showing <span className="font-medium">1</span>{' '}
                                to <span className="font-medium">10</span> of{' '}
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
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default ManageHolidayAttendance
