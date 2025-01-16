import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid'
import {ArrowDownTrayIcon} from '@heroicons/react/24/outline'
import {Form, Formik} from 'formik'
import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {getData, updateData} from '../../app/api'
import {
  ACADEMIC_YEAR,
  ATTENDANCE,
  CLASSES,
  HOLIDAYS,
  SECTIONS,
  STUDENT,
} from '../../app/url'
import {monthsName} from '../../commonComponent/CommonFunctions'
import CustomSelect from '../../commonComponent/CustomSelect'

function ManageStudentRegister() {
  const [academicYears, setAcademicYears] = useState([])
  const [holidaysData, setHolidaysData] = useState([])
  const [selectedAttendance, setSelectedAttendance] = useState(null)
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [openMenuDay, setOpenMenuDay] = useState(null) // Track the currently open menu
  const [students, setStudents] = useState([])
  const [studentList, setStudentList] = useState([])
  const [month, setMonth] = useState('1')
  const [year, setYear] = useState('2025')
  const [open, setOpen] = useState(false)

  const getInitialValues = () => {
    return {
      class: classes[0]?.value,
      section: sections[0]?.value,
      month: '1',
      academicYear: academicYears[0]?.value,
      attendance: '',
    }
  }

  const getValidationSchema = () => {
    return Yup.object({
      class: Yup.string(),
      section: Yup.string(),
      month: Yup.string(),
      year: Yup.string(),
      attendance: Yup.string(),
    })
  }

  useEffect(() => {
    academicYear()
    getClasses()
    getStudentData()
    getHolidayData()
  }, [])

  const academicYear = async () => {
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

  const getClasses = async () => {
    const res = await getData(CLASSES)
    const classData = res.data.data.map((item) => {
      return {
        label: item.name, // Displayed text in the dropdown
        value: item._id,
      }
    })
    setClasses(classData)
    if (classData.length > 0) {
      getSections(classData[0]?.value)
    }
  }

  const getSections = async (classId) => {
    try {
      const response = await getData(SECTIONS + '/' + classId)

      if (response.data?.data?.length > 0) {
        const sectionData = response.data.data.map((item) => ({
          label: item.section,
          value: item._id,
        }))

        setSections(sectionData)

        const firstSectionId = sectionData[0]?.value
        if (firstSectionId) {
          const filteredStudents = students?.filter(
            (student) =>
              student.classId === classId &&
              student.sectionId === firstSectionId,
          )

          setStudentList(filteredStudents)
        }
      } else {
        console.warn('No sections available for the selected class.')
        setSections([])
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
      setSections([])
    }
  }

  const getStudentData = async () => {
    try {
      const response = await getData(STUDENT + '/attendance')
      console.log('Response data for attendance:', response.data.data)

      // Process data
      const processedData = response.data.data.map((student) => {
        // Create an object to map dates to attendance statuses
        const attendanceMap = {}
        student.attendance.forEach((record) => {
<<<<<<< Updated upstream
          const date = new Date(record.date).getDate() // Extract day of the month
          attendanceMap[date] = record.attendanceStatus // Map day to status
        })
=======
          const date = new Date(record.date).getDate(); 
          attendanceMap[date] = record.attendanceStatus; 
        });
>>>>>>> Stashed changes

        return {
          id: student._id,
          name: `${student.firstName} ${student.lastName}`,
<<<<<<< Updated upstream
          profilePicture: student.profilePic || 'default-profile-pic-url', // Default picture if null
          attendance: attendanceMap, // Attendance map by date
        }
      })

      console.log('Processed student data:', processedData)
      // Set state with processed data
      setStudents(processedData)
=======
          profilePicture: student.profilePic || "default-profile-pic-url", 
          attendance: attendanceMap, 
        };
      });

      console.log("Processed student data:", processedData);
      setStudents(processedData);
>>>>>>> Stashed changes
    } catch (error) {
      console.error('Error getting data:', error)
    }
  }

  // const getStudentData = async (classId, sectionID) => {
  //   try {
  //     const response = await getData(STUDENT+"/attendance" +"/" + classId + "/" + sectionID);
  //     console.log("Response data for attendance:", response.data.data);

  //     // Process data
  //     const processedData = response.data.data.map((student) => {
  //       // Create an object to map dates to attendance statuses
  //       const attendanceMap = {};
  //       student.attendance.forEach((record) => {
  //         const date = new Date(record.date).getDate(); // Extract day of the month
  //         // Convert attendanceStatus to shorthand
  //         const statusMap = {
  //           present: "P",
  //           absent: "A",
  //           sick: "S",
  //           leave: "L",
  //           // Add other mappings if necessary
  //         };
  //         attendanceMap[date] = statusMap[record.attendanceStatus] || "N/A";
  //       });

  //       return {
  //         id: student._id,
  //         name: `${student.firstName} ${student.lastName}`,
  //         profilePicture: student.profilePic || "default-profile-pic-url", // Default picture if null
  //         attendance: attendanceMap, // Attendance map by date
  //       };
  //     });

  //     console.log("Processed student data:", processedData);
  //     // Set state with processed data
  //     setStudents(processedData);
  //   } catch (error) {
  //     console.error("Error getting data:", error);
  //   }
  // };

  const handleClassChange = (e, values, setFieldValue) => {
    const classValue = e.target.value
    setFieldValue('class', classValue)
    getSections(classValue)
  }

  const handleSectionChange = (e, values, setFieldValue) => {
    const sectionValue = e.target.value
    setFieldValue('section', sectionValue)
    // getStudents(values.class, sectionValue);
    const filteredStudents = students.filter(
      (student) =>
        student.classId === values.class && student.sectionId === sectionValue,
    )
    setStudentList(filteredStudents)
  }

  const daysInMonth = (month, year) => {
    const daysArray = []
    const date = new Date(year, month - 1, 1) // month - 1 because JavaScript months are 0-based
    const lastDay = new Date(year, month, 0).getDate() // last day of the month

    for (let i = 1; i <= lastDay; i++) {
      const day = new Date(year, month - 1, i)
      const dayName = day.toLocaleString('en-us', {weekday: 'short'}) // e.g., 'Wed'
      daysArray.push({
        day: i,
        dayName: dayName,
      })
    }

    return daysArray
  }

  const days = daysInMonth(parseInt(month), year)
  // console.log("Days in the month:", days);

  const getHolidayData = async () => {
    try {
      const response = await getData(HOLIDAYS)
      console.log('Response data for holidays:', response.data.data)

      setHolidaysData(response.data.data)
    } catch (error) {
      console.error('Error getting data:', error)
    }
  }

  const isHoliday = (date) => {
    return holidaysData.some(
      (holiday) =>
        new Date(holiday.startDate) <= new Date(date) &&
        new Date(holiday.endDate) >= new Date(date),
    )
  }

  const handleAttendanceChange = (e) => {
    e.preventDefault()
    setSelectedAttendance(e.target.value)
    console.log('Selected Attendance:', e.target.value)
  }

  const handleSave = async (day, id) => {
    const formattedDate = new Date(day)
    const payload = {
      studentID: id, // Assuming staff has an _id field
      date: formattedDate, // Use the date or appropriate identifier
      status: selectedAttendance,
      userType: 'student',
    }
    console.log('[STUDENT Payload]', payload)
    try {
      const response = await updateData(ATTENDANCE, payload)
      if (response.status === 200) {
        console.log('Attendance updated successfully')
      } else {
        console.error('Failed to update attendance')
      }
    } catch (error) {
      console.error('An error occurred while updating attendance', error)
    }
  }

  const handleSubmit = (values) => {
    console.log('Form submitted with values:', values)
  }

  return (
    <>
      <Formik
        initialValues={getInitialValues()}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({values, setFieldValue, errors}) => (
          <Form>
            <div className="shadow ring-1 ring-black/5 sm:rounded-lg px-3 py-3 mt-4 flex justify-between">
              <div className="left-form-blk flex space-x-4">
                <CustomSelect
                  name="class"
                  placeholder=" Class"
                  options={classes}
                  onChange={(e) => {
                    handleClassChange(e, values, setFieldValue)
                    getSections(e.target.value) // Fetch and set sections
                  }}
                />
                <CustomSelect
                  name="section"
                  placeholder=" Section"
                  options={sections}
                  onChange={(e) => {
                    handleSectionChange(e, values, setFieldValue)
                  }}
                />
                <CustomSelect
                  name="month"
                  placeholder=" Month"
                  options={monthsName}
                  onChange={(e) => {
                    const selectedMonth = e.target.value
                    setFieldValue('month', selectedMonth)
                    setMonth(selectedMonth)
                  }}
                />

                <CustomSelect
                  name="academicYear"
                  placeholder="Academic year"
                  options={academicYears}
                />
              </div>

              <div className="content-item flex items-center">
                <dt className="text-sm/6 text-gray-500">No. Of Working Days</dt>
                <dd className="text-base text-gray-700 font-medium pl-2">24</dd>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <div className="text-lg text-gray-900 font-medium">
                Student Attendance Register
              </div>
              <div className="flex right-btns-blk space-x-4">
                <div className="">
                  Present: <span className="">P</span>
                </div>
                <div className="">
                  Absent: <span className="text-yellow-800">A</span>
                </div>
                <div className="">
                  Half Day: <span className="text-blue-800">F</span>
                </div>
                <div className="">
                  {' '}
                  Holiday: <span className="text-purple-700">H</span>
                </div>
              </div>
            </div>

            {/* /Removed overflow-x-auto cloass */}
            <div className="shadow ring-1 ring-black/5 sm:rounded-lg">
              {/* /Removed overflow-hidden cloass */}
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-container-main overflow-y-auto overflow-x-auto max-h-[56vh]">
                {/* Table View */}
                <table className="table-auto min-w-full divide-y divide-gray-300">
                  <thead className="bg-purple-100">
                    <tr>
                      <th
                        scope="col"
                        className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-40"
                      >
                        <a href="#" className="group inline-flex">
                          Student Name
                        </a>
                      </th>

                      <th
                        scope="col"
                        className="px-2 py-2 text-left text-sm font-semibold text-gray-900 w-14"
                      >
                        <a href="#" className="group inline-flex">
                          Total Absents
                        </a>
                      </th>

                      {days.map((dayObj, index) => {
                        // Determine if the current day is a Sunday
                        const isSunday =
                          new Date(
                            2025,
                            parseInt(month) - 1,
                            dayObj.day,
                          ).getDay() === 0

                        return (
                          <th
                            key={dayObj.day}
                            scope="col"
                            className={`px-2 py-2 text-left text-sm font-semibold text-gray-900 ${
                              isSunday ? 'w-16 bg-red-100' : 'w-40'
                            }`}
                          >
                            <a href="#" className="flex flex-col items-center">
                              <div>{dayObj.dayName}</div>
                              <div>{dayObj.day}</div>
                            </a>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 bg-white">
                    {studentList.map((student) => (
                      <tr key={student.id}>
                        {/* Student Info */}
                        <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm">
                          <a
                            href="#"
                            className="text-purple-600 hover:text-purple-900"
                          >
                            <div className="flex items-center">
                              <div className="size-9 shrink-0">
                                <img
                                  alt=""
                                  src={student.profilePicture}
                                  className="size-9 rounded-full"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900 text-purple-600">
                                  {student.name}
                                </div>
                                <div className="mt-1 text-gray-500">
                                  {student.rollNumber}
                                </div>
                              </div>
                            </div>
                          </a>
                        </td>

                        {/* Total Absents */}
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          0
                        </td>

                        {/* {days.map((dayObj, index) => {
                          // Check if the day is a Sunday
                          const isSunday = dayObj.dayName === "Sun";
                          const attendanceValue =
                            student.attendance[dayObj.day] ||
                            (isSunday ? "S" : "N/A");
                          const attendanceClass = isSunday
                            ? "bg-red-100 text-gray-900"
                            : attendanceValue === "P"
                            ? "text-gray-500" // Present
                            : attendanceValue === "A"
                            ? "text-yellow-800 bg-yellow-100"
                            : attendanceValue === "S"
                            ? "text-gray-900 bg-red-100"
                            : attendanceValue === "F"
                            ? "text-gray-900 bg-blue-100"
                            : "text-gray-500";

                          return (
                            <td
                              key={dayObj.day}
                              className={`whitespace-nowrap px-2 py-2 text-sm text-center ${attendanceClass}`}
                            >
                              {attendanceValue}
                            </td>
                          );
                        })} */}
                        {days.map((dayObj, index) => {
                          const isSunday = dayObj.dayName === 'Sun'

                          const isHoliday = holidaysData?.some(
                            (holiday) =>
                              new Date(holiday.date).getDate() === dayObj.day,
                          )

                          const attendanceValue = isHoliday
                            ? 'H'
                            : student.attendance[dayObj.day] ||
                              (isSunday ? 'S' : 'N/A')

                          const attendanceClass = isHoliday
                            ? 'text-green-800 bg-green-100' // Holidays
                            : isSunday
                            ? 'bg-red-100 text-gray-900' // Sundays
                            : attendanceValue === 'P'
                            ? 'text-gray-500' // Present
                            : attendanceValue === 'A'
                            ? 'text-yellow-800 bg-yellow-100' // Absent
                            : attendanceValue === 'F'
                            ? 'text-gray-900 bg-blue-100' // Half Day
                            : 'text-gray-500'

                          return (
                            <td
                              key={dayObj.day}
                              className={`whitespace-nowrap px-2 py-2 text-sm text-center ${attendanceClass}`}
                            >
                              <Menu
                                as="div"
                                className="relative inline-block text-left"
                              >
                                <div>
                                  <MenuButton
                                    className="flex items-center rounded-full text-gray-400"
                                    onClick={() =>
                                      setOpenMenuDay((prev) =>
                                        prev === dayObj.day ? null : dayObj.day,
                                      )
                                    }
                                  >
                                    {attendanceValue}
                                  </MenuButton>
                                </div>
                                {openMenuDay === dayObj.day &&
                                  ['P', 'A', 'F'].includes(attendanceValue) && (
                                    <MenuItems className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                      <div className="py-1">
                                        <MenuItem>
                                          <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700"
                                          >
                                            Update Attendance
                                          </a>
                                        </MenuItem>
                                        <MenuItem>
                                          <label className="flex items-center text-sm text-gray-600 p-2">
                                            <input
                                              type="radio"
                                              name={`attendance-${dayObj.day}`}
                                              value="present"
                                              onClick={(e) =>
                                                handleAttendanceChange(e)
                                              }
                                              className="mr-2 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            Present: P
                                          </label>
                                        </MenuItem>
                                        <MenuItem>
                                          <label className="flex items-center text-sm text-gray-600 p-2">
                                            <input
                                              type="radio"
                                              name={`attendance-${dayObj.day}`}
                                              value="absent"
                                              onClick={(e) =>
                                                handleAttendanceChange(e)
                                              }
                                              className="mr-2 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            Absent: A
                                          </label>
                                        </MenuItem>
                                        <MenuItem>
                                          <label className="flex items-center text-sm text-gray-600 p-2">
                                            <input
                                              type="radio"
                                              name={`attendance-${dayObj.day}`}
                                              value="half-day"
                                              onClick={(e) =>
                                                handleAttendanceChange(e)
                                              }
                                              className="mr-2 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            Half Day: F
                                          </label>
                                        </MenuItem>
                                        <MenuItem>
                                          <div className="flex p-4">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setOpenMenuDay(null)
                                              }
                                              className="w-1/2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleSave(
                                                  dayObj.day,
                                                  student.id,
                                                )
                                              }
                                              className="w-1/2 ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
                                            >
                                              Save
                                            </button>
                                          </div>
                                        </MenuItem>
                                      </div>
                                    </MenuItems>
                                  )}
                              </Menu>
                            </td>
                          )
                        })}
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
          </Form>
        )}
      </Formik>
    </>
  )
}

export default ManageStudentRegister
