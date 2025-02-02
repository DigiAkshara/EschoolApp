import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { getData, updateData } from "../../app/api";
import { ACADEMIC_YEAR, ATTENDANCE, STAFF } from "../../app/url";
import {
  monthsName,
  staffCategory,
} from "../../commonComponent/CommonFunctions";
import CustomSelect from "../../commonComponent/CustomSelect";
import moment from "moment";

function ManageStaffRegister() {
  const [academicYears, setAcademicYears] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([])
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [openMenuDay, setOpenMenuDay] = useState(null); // Track the currently open menu
  const [staffs, setStaffs] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [month, setMonth] = useState("1");
  const [year, setYear] = useState("2025");

  const getInitialValues = () => {
    return {
      staffCategory: "teaching",
      month: "1",
      academicYear: academicYears[0]?.value,
      attendance: "",
    };
  };

  const getValidationSchema = () => {
    return Yup.object({
      staffCategory: Yup.string(),
      month: Yup.string(),
      year: Yup.string(),
      attendance: Yup.string(),
    });
  };

  useEffect(() => {
    academicYear();
    getStaffData();
  }, []);



  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term === "") {
      // If the search term is empty, reset the staff list to the original list
      setStaffList(filteredData);
    } else {
      // Filter staff list based on the search term
      const filtered = filteredData.filter((item) =>
        item.name.toLowerCase().includes(term.toLowerCase()) // Access 'name' property
      );
      setStaffList(filtered);
  };
}

  const academicYear = async () => {
    try {
      const academicYearRes = await getData(ACADEMIC_YEAR);
      if (academicYearRes.status === 200 || academicYearRes.status === 201) {
        let academicYearData = [
          {
            label: academicYearRes.data.data.year, // Displayed text in the dropdown
            value: academicYearRes.data.data._id,
          },
        ];
        setAcademicYears(academicYearData);
      } else {
        throw new Error(academicYearRes.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStaffData = async () => {
    try {
      const response = await getData(STAFF + "/attendance");
      console.log("[STAFF-REGISTER] data for attendance:", response.data.data);

      const processedData = response.data.data.map((staff) => {
        // Create an object to map dates to attendance statuses
        const attendanceMap = {};
        staff.attendance.forEach((record) => {
          const date = new Date(record.date).getDate(); 
          const statusMap = {
            present: "P",
            absent: "A",
            sick: "S",
            leave: "L",
          };
          attendanceMap[date] = statusMap[record.attendanceStatus] || "N/A";
        });

        return {
          _id: staff._id,
          name: `${staff.firstName} ${staff.lastName}`,
          profilePicture: staff.profilePic || "default-profile-pic-url", // Default picture if null
          category: staff.staffType,
          attendance: attendanceMap, 
        };
      });

      // console.log("Processed student data:", processedData);
      setStaffs(processedData);
      const staffData = processedData?.filter(
        (staffMember) => staffMember.category === "teaching"
      );
      setStaffList(staffData);
      setFilteredData(staffData)
    } catch (error) {
      console.error("Error getting data:", error);
    }
  };

  const handleStaffCategory = (e, setFieldValue) => {
    const category = e.target.value;
    const staffData = staffs.filter((staff) => staff.category === category);
    setFieldValue("staffCategory", category);
    setStaffList(staffData);
    setFilteredData(staffData)
  };

  const daysInMonth = (month, year) => {
    const daysArray = [];
    const date = new Date(year, month - 1, 1); 
    const lastDay = new Date(year, month, 0).getDate(); 

    for (let i = 1; i <= lastDay; i++) {
      const day = new Date(year, month - 1, i);
      const dayName = day.toLocaleString("en-us", { weekday: "short" }); // e.g., 'Wed'
      daysArray.push({
        day: i,
        dayName: dayName,
      });
    }

    return daysArray;
  };

  const days = daysInMonth(parseInt(month), year);
  // console.log("Days in the month:", days);



  const handleAttendanceChange = (e) => {
    e.preventDefault();
    setSelectedAttendance(e.target.value);
    console.log("Selected Attendance:", e.target.value);
  };


  const handleSave = async (day, id) => {
    const formattedDate = new Date(year, month - 1, day);
    console.log("formated date:",formattedDate, day);
    
    const payload = {
      userId: id, // Assuming staff has an _id field
      // date: moment(day).format("DD/MM/YYYY"), // Use the date or appropriate identifier
      date: formattedDate,
      attendanceStatus: selectedAttendance, // Selected attendance value
    };
    console.log("[Staff Payload]", payload);
    try {
      const response = await updateData(ATTENDANCE, payload);
      if (response.status === 200) {
        console.log("Attendance updated successfully");
        getStaffData();
      } else {
        console.error("Failed to update attendance");
      }
    } catch (error) {
      console.error("An error occurred while updating attendance", error);
    }
  };

  return (
    <>
      <Formik
        initialValues={getInitialValues()}
        validationSchema={getValidationSchema()}
        // onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, errors }) => (
          <Form>
            <div className="shadow ring-1 ring-black/5 sm:rounded-lg px-3 py-3 mt-4 flex justify-between">
              <div className="left-form-blk flex space-x-4">
                <CustomSelect
                  name="staffCategory"
                  options={staffCategory}
                  value={values.staffCategory}
                  onChange={(e) => handleStaffCategory(e, setFieldValue)}
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
                  {" "}
                  Leave: <span className="text-purple-700">L</span>
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
                          id="search"
                          name="search"
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
                          Staff Name
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
                            className={`px-2 py-2 text-left text-sm font-semibold text-gray-900 ${
                              isSunday ? "w-16 bg-red-100" : "w-40"
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
                    {staffList.length === 0 ? (
                      <tr>
                        <td
                          colSpan={days.length + 2} // Adjust the colspan based on the total number of columns
                          className="whitespace-nowrap py-4 px-6 text-center text-sm text-gray-500"
                        >
                          No staff data
                        </td>
                      </tr>
                    ) : (
                      staffList?.map((staff) => (
                        <tr key={staff.id}>
                          {/* staff Info */}
                          <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm">
                            <a
                              href="#"
                              className="text-purple-600 hover:text-purple-900"
                            >
                              <div className="flex items-center">
                                <div className="size-9 shrink-0">
                                  <img
                                    alt=""
                                    src={staff.profilePicture}
                                    className="size-9 rounded-full"
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-gray-900 text-purple-600">
                                    {staff.name}
                                  </div>
                                  <div className="mt-1 text-gray-500">
                                    {staff.rollNumber}
                                  </div>
                                </div>
                              </div>
                            </a>
                          </td>

                          {/* Total Absents */}
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                            0
                          </td>

                          {days.map((dayObj, index) => {
                            const isSunday = dayObj.dayName === "Sun";

                        
                            const attendanceValue =
                            staff.attendance[dayObj.day] ||
                            (isSunday ? "S" : "N/A");

                            
                            const attendanceClass = isSunday
                              ? "bg-red-100 text-gray-900" // Sundays
                              : attendanceValue === "P"
                              ? "text-gray-500" // Present
                              : attendanceValue === "A"
                              ? "text-yellow-800 bg-yellow-100" // Absent
                              : attendanceValue === "F"
                              ? "text-gray-900 bg-blue-100" // Half Day
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
                                      onClick={() =>
                                        setOpenMenuDay((prev) =>
                                          prev === dayObj.day
                                            ? null
                                            : dayObj.day
                                        )
                                      }
                                    >
                                      {attendanceValue}
                                    </MenuButton>
                                  </div>
                                  {openMenuDay === dayObj.day &&
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
                                            <label className="flex items-center text-sm text-gray-600 p-2">
                                              <input
                                                type="radio"
                                                name={`attendance-${dayObj.day}`}
                                                value="leave"
                                                onClick={(e) =>
                                                  handleAttendanceChange(e)
                                                }
                                                className="mr-2 text-indigo-600 focus:ring-indigo-500"
                                              />
                                              Leave: L
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
                                                    staff._id
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
                        Showing <span className="font-medium">1</span> to{" "}
                        <span className="font-medium">10</span> of{" "}
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
  );
}

export default ManageStaffRegister;
