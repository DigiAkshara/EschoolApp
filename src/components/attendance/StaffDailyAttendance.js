import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { getData, postData } from "../../app/api";
import { ATTENDANCE, STAFF } from "../../app/url";
import {
  attendanceOptions,
  designations,
  handleApiResponse,
} from "../../commonComponent/CommonFunctions";
import CustomRadio from "../../commonComponent/CustomRadio";
import AttendanceSidebar from "./AttendanceSidebar";
import moment from "moment";
import PaginationComponent from "../../commonComponent/PaginationComponent";

const StaffDailyAttendance = () => {
  const [staffList, setStaffList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [attendanceDates, setAttendanceDates] = useState([]);
  const [staffAttendanceData, setStaffAttendanceData] = useState([]);

  const getInitialValues = () => {
    return {
      userType: 'staff',
      date: moment().format("YYYY-MM-DD"),
      staffCategory: "teaching",
      allAttendance: "",
      attendance: staffList.filter((staff) => staff.category === "teaching"),
    };
  };

  const getValidationSchema = () => {
    return Yup.object({
      staffCategory: Yup.string(),
      date: Yup.date().nullable().required(" Date  is required"),
      allAttendance: Yup.string(),
      attendance: Yup.array().of(
        Yup.object({
          attendanceStatus: Yup.string(),
        })
      ),
    });
  };
  useEffect(() => {
    getStaff();
    getStaffData();
  }, []);

  const getStaffData = async () => {
    try {
      const response = await getData(STAFF + "/attendance");
      setStaffAttendanceData(response.data.data); // Store fetched attendance data
    } catch (error) {
      handleApiResponse(error)
    }
  };


  const getStaff = async () => {
    try {
      const response = await getData(STAFF)
      let data = response.data.data.map((item, index) => ({
        _id: item._id,
        pic: item.profilePic?.Location,
        name: item.firstName + " " + item.lastName,
        email: item.email,
        empId: item.empId,
        category: item.staffType,
        date: item.DOJ,
        phoneNumber: item.mobileNumber,
        class: item.class,
      }));
      setStaffList(data);
    } catch (error) {
      handleApiResponse(error)
    }

  };

  const handleStaffCategory = (e, setFieldValue) => {
    const category = e.target.value;
    const staffData = staffList.filter((staff) => staff.category === category);
    setFieldValue("staffCategory", category);
    setFieldValue("attendance", staffData);
  };

  const handleSearch = (e,setFieldValue) => {
    const query = e.target.value?.toLowerCase();
    const staffData = staffList.filter((staff) => staff.name.toLowerCase().includes(query));
    setFieldValue("attendance", staffData);
  };

  const handleRadioChange = (e, values, setFieldValue) => {
    const selectedStatus = e.target.value;
    setFieldValue("allAttendance", selectedStatus);
    const updatedAttendance = values.attendance.map((data) => ({
      ...data,
      attendanceStatus: selectedStatus,
    }));
    setFieldValue("attendance", updatedAttendance);
  };

  const updateAttendance = (e, index, values, setFieldValue) => {
    const updatedAttendance = [...values.attendance];
    updatedAttendance[index].attendanceStatus = e.target.value;
    setFieldValue("attendance", updatedAttendance);
  };

  const handleSubmit = async (values) => {
    // Check if any staff has a missing attendanceStatus
    const incompleteAttendance = values.attendance.some(
      (staff) => !staff.attendanceStatus
    );

    if (incompleteAttendance) {
      setAttendanceMessage("Please mark attendance for all staff members.");
      setTimeout(() => {
        setAttendanceMessage("");
      }, 5000);
      return; // Stop submission if validation fails
    }

    try {
      const response = await postData(ATTENDANCE, values);
      handleApiResponse(response.data.message, "success");
      getStaffData();
    } catch (error) {
      handleApiResponse(error)
    }
  };

  return (
    <>
      <Formik
        initialValues={getInitialValues()}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, errors }) => (
          <Form>
            <div className="flex flex-col lg:flex-row gap-6 mt-4 min-h-screen">
              {/* Sidebar */}
              <AttendanceSidebar
                values={values}
                user="staff"
                setFieldValue={setFieldValue}
                handleRadioChange={handleRadioChange}
                handleStaffCategory={handleStaffCategory}
                attendanceMessage={attendanceMessage}
                setAttendanceMessage={setAttendanceMessage}
                attendanceDates={attendanceDates}
                staffAttendanceData={staffAttendanceData}
              />

              {/* Main Content */}
              <div className="-mx-2 -my-2  mt-0 overflow-x-auto sm:-mx-6  w-full lg:w-3/4">
                <div className="inline-block min-w-full align-middle sm:px-6 ">
                  <div className="relative">
                    <div className="shadow ring-1 ring-black/5 sm:rounded-lg">
                      <div className="relative table-tool-bar z-30">
                        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-3 sm:px-4">
                          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                              <div className="relative rounded-md  inline-block">
                                <input
                                  name="search"
                                  placeholder="Search"
                                  onChange={(e)=>handleSearch(e, setFieldValue)}
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

                      <div className="table-container-main max-h-[56vh]">
                        {/* Table View */}
                        <table className="table-auto min-w-full divide-y divide-gray-300">
                          <thead className="sticky top-0 bg-purple-100 z-20">
                            <tr>
                              <th
                                scope="col"
                                className="relative px-7 sm:w-12 sm:px-6"
                              >
                                <input
                                  type="checkbox"
                                  className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                                // ref={checkbox}
                                // checked={checked}
                                // onChange={toggleAll}
                                />
                              </th>
                              <th
                                scope="col"
                                className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                              >
                                <a href="#" className="group inline-flex">
                                  Staff Name
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
                                  Staff ID
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
                                  Attendance
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
                            {values.attendance && values.attendance.length > 0 ? (
                              <FieldArray name="attendance">
                                {() =>
                                  values.attendance.map((staff, index) => (
                                    <tr
                                      key={staff.staffId}
                                      className="bg-gray-50"
                                    >
                                      <td className="relative px-7 sm:w-12 sm:px-6">
                                        <div className="absolute inset-y-0 left-0 w-0.5 bg-purple-600" />
                                        <input
                                          type="checkbox"
                                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                                        />
                                      </td>

                                      <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm sm:pl-0">
                                        <div className="flex items-center">
                                          {staff.pic ? <div className="h-9 w-9 shrink-0">
                                            <img
                                              alt="Staff"
                                              src={staff.pic}
                                              className="h-9 w-9 rounded-full"
                                            />
                                          </div> : <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                            <span className="font-medium text-gray-600 dark:text-gray-300">{staff.name.charAt(0)}</span>
                                          </div>}
                                          <div className="ml-4">
                                            <div className="font-medium text-gray-900 text-purple-600">
                                              {staff.name}{" "}
                                            </div>
                                            <div className="mt-1 text-gray-500">
                                              {staff.email}{" "}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                        {staff.empId}
                                      </td>

                                      <td>
                                        <CustomRadio
                                          name={`attendance.${index}.attendanceStatus`}
                                          options={[
                                            ...attendanceOptions,
                                            { value: "leave", label: "Leave" },
                                          ]}
                                          value={
                                            values.attendance[index]
                                              .attendanceStatus
                                          }
                                          onChange={(e) =>
                                            updateAttendance(
                                              e,
                                              index,
                                              values,
                                              setFieldValue
                                            )
                                          }
                                        />
                                      </td>
                                    </tr>
                                  ))
                                }
                              </FieldArray>
                            ) : (
                              <tr>
                                <td colSpan={3} className="text-center">
                                  No student data Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {values.attendance.length > 10 && (
                        <PaginationComponent
                          totalCount={values.attendance.length}
                          currentPage={currentPage}
                          onPageChange={(page) => setCurrentPage(page)}
                        />
                      )}
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
};

export default StaffDailyAttendance;
