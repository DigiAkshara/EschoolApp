import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { FieldArray, Form, Formik, useFormikContext } from "formik";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import AttendanceSidebar from "./AttendanceSidebar";
import { getData } from "../app/api";
import { ACADEMICYEAR, STAFF } from "../app/url";
import {
  attendanceOptions,
  designations,
} from "../commonComponent/CommonFunctions";
import CustomRadio from "../commonComponent/CustomRadio";

const ManageStaffDailyAttendance = () => {

  const [staffList, setStaffList] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const getInitialValues = () => {
    return {
      date: "",
      staffCategory: "teacher",
      allAttendance: "",
      attendance: staffList.map((item) => ({
        name: item.name,
        staffId: item.empId,
        email: item.email,
        pic: item.pic,
        attendanceStatus: "present",
      })),
    };
  };

  const getValidationSchema = () => {
    return Yup.object({
      staffCategory: Yup.string(),
      date: Yup.date().nullable().required(" Date  is required"),
      allAttendance:Yup.string(),
      attendance: Yup.array().of(
        Yup.object({
           attendanceStatus: Yup.string(),
       
        })
      ),
    });
  };
  console.log("values are:", getInitialValues());

  useEffect(() => {
    getStaff();
  }, []);

  const getStaff = async () => {
    const response = await getData(STAFF);
    if (response.status === 200) {
      console.log("comming values are:", response.data);

      let data = response.data.data.map((item, index) => ({
        _id: item._id,
        pic: item.profilePic?.Location,
        name: item.firstName + " " + item.lastName,
        email: item.email,
        empId: item.empId,
        date: item.DOJ,
        phoneNumber: item.mobileNumber,
        designation: designations.find(
          (designations) => designations.value === item.designation
        ).label,
        class: item.class,
      }));
      setStaffList(data);
      setFilteredData(data);
    }
  };

 
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setFilteredData(
      staffList.filter((staff) => staff.name.toLowerCase().includes(query))
    );
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
  }


  const handleSubmit = (values) => {
    console.log("submitting with values:", values);
    
  }
  
  
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
                            {values.attendance.length >= 0 ? (
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
                                          <div className="h-9 w-9 shrink-0">
                                            <img
                                              alt="Staff"
                                              src={staff.pic}
                                              className="h-9 w-9 rounded-full"
                                            />
                                          </div>
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
                                        {staff.staffId}
                                      </td>

                                      <td>
                                        <CustomRadio
                                          name={`attendance.${index}.attendanceStatus`}
                                          options={[
                                            ...attendanceOptions,
                                            { value: "leave", label: "Leave" },
                                          ]}
                                          value={values.attendance[index].attendanceStatus}
                                          onChange={(e) => updateAttendance(e, index, values, setFieldValue)}
                                            
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
                                Showing <span className="font-medium">1</span>{" "}
                                to <span className="font-medium">10</span> of{" "}
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
  );
};

export default ManageStaffDailyAttendance;
