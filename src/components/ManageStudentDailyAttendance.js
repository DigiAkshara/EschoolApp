import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { FieldArray, Form, Formik } from "formik";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import AttendanceSidebar from "./AttendanceSidebar";
import { getData } from "../app/api";
import { ACADEMICS, STAFF } from "../app/url";
import { attendanceOptions, designations, gender } from "../commonComponent/CommonFunctions";
import CustomRadio from "../commonComponent/CustomRadio";

const ManageStudentDailyAttendance = () => {
  const [date, setDate] = useState("");
  const teacherOptions = ["Set attendance for all Teachers"];
  const [studentList, setStudentList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [globalAttendance, setGlobalAttendance] = useState({});
  const [attendance, setAttendance] = useState({});

  const getInitialValues = () => {
    return {
      date: "",
      class: "",
      section: "",
      allAttendance:"",
      attendance: studentList.map((item) => ({
        name: item.name,
        admissionNo: item.admissionNo,
        pic: item.pic,
        attendanceStatus: "present",
      })),
    };
  };

  const getValidationSchema = () => {
    return Yup.object({
      class: Yup.string(),
      section: Yup.string(),
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
    getStudents();
  }, []);

  const getStudents = async () => {
    try {
      const student = await getData(ACADEMICS);
      const studentRes = student.data.data;
      const studentData = studentRes.map((item) => {
        return {
          _id: item.student._id,
          pic: item.student.profilePic?.Location,
          name: item.student.firstName + " " + item.student.lastName,
          admissionNo: item.student.admissionNumber,
          class: item.class?.name,
          section: item.section,
          phoneNumber: item.student.fatherDetails.mobileNumber,
          date: item.student.DOB,
          aadharNo: item.student.aadharNumber,
          gender: gender.find((gender) => gender.value === item.student.gender)
            .label,
        };
      });
      setStudentList(studentData);
      setFilteredData(studentData);
      setAttendance(
        Object.fromEntries(studentData.map((student) => [student._id, ""]))
      );
      setGlobalAttendance(
        Object.fromEntries(studentData.map((student) => [student._id, ""]))
      );
    } catch (error) {
      console.log(error);
    }
  };

  //   const handleSaveAttendance = () => {

  //     console.log("Attendance saved:", attendanceData);
  //     // Send `attendanceData` to the backend.
  //   };

  const handleAttendanceChange = (staffId, status) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [staffId]: status, // Updates the status for the specific staff member
    }));
  };

  useEffect(() => {
    // Merge the globalAttendance with individual attendance states
    const updatedAttendance = studentList.reduce((acc, student) => {
      acc[student._id] =
        globalAttendance[student._id] || attendance[student._id];
      return acc;
    }, {});
    setAttendance(updatedAttendance);
  }, [globalAttendance]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setFilteredData(
      studentList.filter((student) =>
        student.name.toLowerCase().includes(query)
      )
    );
  };

  const handleSubmit = (values) => {
    // alert("Form submitted successfully!");
    console.log("Form submitted with values:", values);
  };

  return (
    <>
      <Formik
        initialValues={getInitialValues()}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            <div className="flex flex-col lg:flex-row gap-6 mt-4 min-h-screen">
              
              <AttendanceSidebar
                values={values}
                teacherOptions={teacherOptions}
                user="student"
                setGlobalAttendance={setGlobalAttendance}
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
                                className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                <a href="#" className="group inline-flex">
                                  Admission No.
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
                                  values.attendance.map((student, index) => (
                              <tr key={student._id} className="bg-gray-50">
                                
                                <td className="relative px-7 sm:w-12 sm:px-6">
                                  <div className="absolute inset-y-0 left-0 w-0.5 bg-purple-600" />
                                  <input
                                    type="checkbox"
                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                                  />
                                </td>

                                
                                <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm sm:pl-0">
                                  <div className="flex items-center">
                                    {/* Staff Image */}
                                    <div className="h-9 w-9 shrink-0">
                                      <img
                                        alt="Staff"
                                        src="https://stu-images.mos.ap-southeast-2.sufybkt.com/1734344416163.jpeg"
                                        className="h-9 w-9 rounded-full"
                                      />
                                    </div>
                                    {/* Staff Details */}
                                    <div className="ml-4">
                                      <div className="font-medium text-gray-900 text-purple-600">
                                        {student.name}{" "}
                                        
                                      </div>
                                      {/* <div className="mt-1 text-gray-500">
                                {student.email}{" "}
                                
                              </div> */}
                                    </div>
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                  {student.admissionNo}
                                </td>
                                {/* <td>
                                  {["Present", "Absent", "Half Day"].map(
                                    (option) => (
                                      <label
                                        key={`${
                                          student._id
                                        }-${option.toLowerCase()}`}
                                        className="me-3"
                                      >
                                        <input
                                          type="radio"
                                          name={`attendance-${student._id}`}
                                          value={option
                                            .toLowerCase()
                                            .replace(" ", "-")} // Format: present, absent, half-day, leave
                                          checked={
                                            attendance[student._id] ===
                                            option
                                              .toLowerCase()
                                              .replace(" ", "-")
                                          }
                                          className="me-1"
                                          onChange={() =>
                                            handleAttendanceChange(
                                              student._id,
                                              option
                                                .toLowerCase()
                                                .replace(" ", "-")
                                            )
                                          }
                                        />
                                        {option}
                                      </label>
                                    )
                                  )}
                                </td> */}
                                
                                  {/* <div className="sm:col-span-2 flex flex-row space-x-4">
                                    {["Present", "Absent", "Half Day"].map(
                                      (option) => (
                                        <CustomRadio
                                          key={`attendance-${
                                            student._id
                                          }-${option.toLowerCase()}`}
                                          name={`attendance-${student._id}`}
                                          options={[
                                            {
                                              value: option
                                                .toLowerCase()
                                                .replace(" ", "-"),
                                              label: option,
                                            },
                                          ]}
                                          defaultValue='present'

                                        />
                                      )
                                    )}
                                  </div> */}
                                   <td>
                                        <CustomRadio
                                          name={`attendance.${index}.attendanceStatus`}
                                          options={[
                                            ...attendanceOptions,
                                            { value: "leave", label: "Leave" },
                                          ]}
                                          value={values.attendance[index].attendanceStatus}
                                          onChange={(value) =>
                                            setFieldValue(`attendance.${index}.attendanceStatus`, value)
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

export default ManageStudentDailyAttendance;
