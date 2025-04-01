import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { getData, updateData } from "../../app/api";
import { ATTENDANCE, HOLIDAYS } from "../../app/url";
import {
  handleApiResponse,
  monthsName,
} from "../../commonComponent/CommonFunctions";
import CustomSelect from "../../commonComponent/CustomSelect";
import PaginationComponent from "../../commonComponent/PaginationComponent";

function ManageStudentRegister() {
  const { academicYear } = useSelector((state) => state.appConfig);
  const { classes, sections } = useSelector((state) => state.students);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [openMenuDay, setOpenMenuDay] = useState(null); // Track the currently open menu
  const [studentList, setStudentList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cls, setCls] = useState(classes[0]?.value);
  const [section, setSection] = useState(sections.filter(
    (section) => section.class._id === classes[0]?.value
  )[0]?.value);
  const [month, setMonth] = useState(moment().month() + 1);
  const [year, setYear] = useState(moment().year());
  const [days, setDays] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [noOfWorkingDays, setNoOfWorkingDays] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const getInitialValues = () => {
    return {
      class: classes[0]?.value,
      section: sections.filter(
        (section) => section.class._id === classes[0]?.value
      )[0]?.value,
      month: moment().month() + 1,
      year: moment().year(),
      academicYear: academicYears[0]?.value,
      attendance: "",
    };
  };

  const getValidationSchema = () => {
    return Yup.object({
      class: Yup.string(),
      section: Yup.string(),
      month: Yup.number(),
      year: Yup.string(),
      attendance: Yup.string(),
    });
  };

  const getHolidays = async () => {
    try {
      let res = await getData(HOLIDAYS);
      setHolidays(res.data.data);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  useEffect(() => {
    getHolidays();
  }, []);

  useEffect(() => {
    if (academicYear) {
      setAcademicYears([{
        label: academicYear.year,
        value: academicYear._id
      }])
    }
  }, [academicYear])

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term === "") {
      setStudentList(filteredData);
    } else {
      const filtered = filteredData.filter((item) =>
        item.name.toLowerCase().includes(term.toLowerCase())
      );
      setStudentList(filtered);
    }
  };

  const getStudentData = async (month, year, cls, section) => {
    try {
      const response = await getData(
        ATTENDANCE + "?month=" +
        month +
        "&year=" +
        year +
        "&userType=student" +
        "&classId=" +
        cls +
        "&sectionId=" +
        section
      );
      let data = transformAttendanceData(response.data.data);
      setFilteredData(data)
      setStudentList(data);
    } catch (error) {
      handleApiResponse(error);
    }
  };

  function transformAttendanceData(data) {
    const result = {};
    const statusMap = {
      present: "P",
      absent: "A",
      "half-day": "F",
      leave: "L",
    };
    data.forEach((record) => {
      const formattedDate = moment(record.date).format("YYYY-MM-DD");
      record.attendance.forEach((att) => {
        if (!result[att.userId._id]) {
          result[att.userId._id] = {
            _id: record._id,
            userId: att.userId._id,
            name: att.userId.firstName + " " + att.userId.lastName,
            profilePic: att.userId.profilePic?.Location,
            category: att.userId.staffType,
            rollNumber: att.userId.rollNumber, // You can replace this with actual user names if available
            attendance: {},
            recordId: {},
            noOfLeaves: 0,
          };
        }
        let date = moment(formattedDate).format("DD");
        result[att.userId._id].recordId[date] = record._id
        result[att.userId._id].attendance[date] = isHoliday(record.date)
          ? "H"
          : statusMap[att.attendanceStatus] || "-";
        result[att.userId._id].noOfLeaves =
          result[att.userId._id].noOfLeaves +
          (att.attendanceStatus === "absent"
            ? 1
            : att.attendanceStatus === "half-day"
              ? 0.5
              : 0);
      });
    });

    return Object.values(result);
  }

  const isHoliday = (date) => {
    let isHoliday = false;
    let checkDate = moment(date).format("YYYY-MM-DD");
    for (let holiday of holidays) {
      let start = moment(holiday.startDate).format("YYYY-MM-DD");
      let end = moment(holiday.endDate).format("YYYY-MM-DD");
      // Check if the date falls within the holiday period
      if (moment(checkDate).isBetween(start, end, null, "[]")) {
        // '[]' includes start and end dates
        isHoliday = true;
      }
    }
    return isHoliday;
  }

  function getDaysOfMonth(month, year) {
    let start = moment(`${year}-${month}-01`, "YYYY-MM-DD");
    let end = start.clone().endOf("month");
    let daysArray = [];
    while (start.isSameOrBefore(end)) {
      daysArray.push({
        day: start.format("DD"), // Get day as 01, 02, ...
        dayName: start.format("ddd"), // Get short day name (Mon, Tue, ...)
      });
      start.add(1, "day"); // Move to the next day
    }
    setDays(daysArray);
  }

  const getWorkingDays = (month, year, holidays) => {
    let start = moment(`${year}-${month}-01`, "YYYY-MM-DD");
    let end = start.clone().endOf("month");
    let holidayDates = new Set();
    // Convert holiday start and end dates into a list of dates
    holidays.forEach((holiday) => {
      let holidayStart = moment(holiday.startDate);
      let holidayEnd = moment(holiday.endDate);

      while (holidayStart.isSameOrBefore(holidayEnd)) {
        holidayDates.add(holidayStart.format("YYYY-MM-DD"));
        holidayStart.add(1, "day");
      }
    });

    let workingDays = 0;

    // Loop through the days of the month
    while (start.isSameOrBefore(end)) {
      let isSunday = start.day() === 0; // Sunday (0 in Moment.js)
      let isHoliday = holidayDates.has(start.format("YYYY-MM-DD")); // Check if it's a holiday

      if (!isSunday && !isHoliday) {
        workingDays++; // Count only if it's not a Sunday or holiday
      }

      start.add(1, "day"); // Move to the next day
    }
    setNoOfWorkingDays(workingDays);
  };

  useEffect(() => {
    if (month && year) {
      getDaysOfMonth(parseInt(month), year);
      getWorkingDays(month, year, holidays);
    }
  }, [month, year]);

  useEffect(() => {
    if (month && year && cls && section) {
      getStudentData(month, year, cls, section);
    }
  }, [month, year, cls, section]);

  const handleAttendanceChange = (e) => {
    e.stopPropagation();
    setSelectedAttendance(e.target.value);
  };

  const getValue = (val) => {
    switch (val) {
      case "P":
        return "present";
      case "A":
        return "absent";
      case "F":
        return "half-day";
      default:
        return "L";
    }
  };

  const handleSave = async (id, day, userId) => {
    const formattedDate = new Date(year, month - 1, day);
    const payload = {
      id,
      userId,
      date: formattedDate,
      attendanceStatus: selectedAttendance,
    };
    try {
      const response = await updateData(ATTENDANCE, payload);
      getStudentData(month, year, cls, section);
      handleApiResponse(response.data.message, "success");
    } catch (error) {
      handleApiResponse(error);
    } finally {
      setOpenMenuDay(null);
      setSelectedAttendance("");
    }
  };

  return (
    <>
      <Formik
        initialValues={getInitialValues()}
        validationSchema={getValidationSchema()}
        enableReinitialize
      >
        {({ values, setFieldValue, errors }) => (
          <Form>
            <div className="shadow ring-1 ring-black/5 sm:rounded-lg px-3 py-3 mt-4 flex justify-between">
              <div className="left-form-blk flex space-x-4">
                <CustomSelect
                  name="class"
                  placeholder="Class"
                  value={values.class}
                  options={classes}
                  onChange={(e) => {
                    setFieldValue("class", e.target.value);
                    setFieldValue("section", "");
                    setCls(e.target.value);
                  }}
                />
                <CustomSelect
                  name="section"
                  placeholder=" Section"
                  options={sections.filter(
                    (section) => section.class._id === values.class
                  )}
                  onChange={(e) => {
                    setFieldValue("section", e.target.value);
                    setSection(e.target.value);
                  }}
                />
                <CustomSelect
                  name="month"
                  placeholder=" Month"
                  options={monthsName}
                  onChange={(e) => {
                    const selectedMonth = e.target.value;
                    setFieldValue("month", selectedMonth);
                    setMonth(selectedMonth);
                  }}
                />

                <CustomSelect
                  name="academicYear"
                  placeholder="Academic year"
                  options={academicYears}
                  onChange={(e) => {
                    const selectedYear = e.target.value;
                    setFieldValue("academicYear", selectedYear);
                    academicYears.forEach((year) => {
                      if (year.value === selectedYear) {
                        setYear(year.label.split("-")[1]);
                      }
                    });
                  }}
                />
              </div>

              <div className="content-item flex items-center">
                <dt className="text-sm/6 text-gray-500">No. Of Working Days</dt>
                <dd className="text-base text-gray-700 font-medium pl-2">
                  {noOfWorkingDays}
                </dd>
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
                  {" "}
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
                          type="text"
                          placeholder="Search"
                          value={searchTerm}
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
                            dayObj.day
                          ).getDay() === 0;

                        return (
                          <th
                            key={dayObj.day}
                            scope="col"
                            className={`px-2 py-2 text-left text-sm font-semibold text-gray-900 ${isSunday ? "w-16 bg-red-100" : "w-40"
                              }`}
                          >
                            <a href="#" className="flex flex-col items-center">
                              <div>{dayObj.dayName}</div>
                              <div>{dayObj.day}</div>
                            </a>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 bg-white">
                    {studentList.length === 0 ? (
                      <tr>
                        <td
                          colSpan={days.length + 2} // Adjust the colspan based on the total number of columns
                          className="whitespace-nowrap py-4 px-6 text-center text-sm text-gray-500"
                        >
                          No student data
                        </td>
                      </tr>
                    ) : (
                      studentList.map((student) => (
                        <tr key={student.userId}>
                          {/* Student Info */}
                          <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm">
                            <a
                              href="#"
                              className="text-purple-600 hover:text-purple-900"
                            >
                              <div className="flex items-center">
                                {student.profilePic ? (
                                  <div className="size-9 shrink-0">
                                    <img
                                      alt=""
                                      src={student.profilePic}
                                      className="size-9 rounded-full"
                                    />
                                  </div>
                                ) : (
                                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                    <span className="font-medium text-gray-600 dark:text-gray-300">
                                      {student.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
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
                            {student.noOfLeaves}
                          </td>

                          {days.map((dayObj) => {
                            const isSunday = dayObj.dayName === "Sun";
                            const attendanceValue =
                              student.attendance[dayObj.day] ||
                              (isSunday ? "S" : "-");

                            const attendanceClass = isSunday
                              ? "bg-red-100 text-gray-900" // Sundays
                              : attendanceValue === "P"
                                ? "text-gray-500" // Present
                                : attendanceValue === "A"
                                  ? "text-yellow-800 bg-yellow-100" // Absent
                                  : attendanceValue === "F"
                                    ? "text-gray-900 bg-blue-100" // Half Day
                                    : attendanceValue === "H"
                                      ? "text-red-500" // Sunday
                                      : "text-gray-500";

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
                                      onClick={() => {
                                        setOpenMenuDay(dayObj.day);
                                        let value = getValue(attendanceValue);
                                        setSelectedAttendance(value);
                                      }}
                                    >
                                      {attendanceValue}
                                    </MenuButton>
                                  </div>
                                  {openMenuDay == dayObj.day &&
                                    ["P", "A", "F"].includes(
                                      attendanceValue
                                    ) && (
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
                                                checked={
                                                  selectedAttendance ===
                                                  "present"
                                                }
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
                                                checked={
                                                  selectedAttendance ===
                                                  "absent"
                                                }
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
                                                checked={
                                                  selectedAttendance ===
                                                  "half-day"
                                                }
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
                                                onClick={() => {
                                                  setOpenMenuDay(null);
                                                  setSelectedAttendance("");
                                                }}
                                                className="w-1/2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                                              >
                                                Cancel
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleSave(
                                                    student.recordId[dayObj.day],
                                                    dayObj.day,
                                                    student.userId
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
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {studentList.length > 10 && (
                <PaginationComponent
                  totalCount={studentList.length}
                  currentPage={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default ManageStudentRegister;
