import {
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { FieldArray, Form, Formik } from "formik";
import moment from "moment";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { postData } from "../../app/api";
import { ATTENDANCE } from "../../app/url";
import {
  attendanceOptions,
  handleApiResponse,
} from "../../commonComponent/CommonFunctions";
import CustomRadio from "../../commonComponent/CustomRadio";
import PaginationComponent from "../../commonComponent/PaginationComponent";
import AttendanceSidebar from "./AttendanceSidebar";

const StudentDailyAttendance = () => {
  const { classes, sections } = useSelector((state) => state.students);
  const studentList = useSelector((state) => state.attendance.students);
  const [currentPage, setCurrentPage] = useState(1);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const getInitialValues = () => {
    return {
      userType: "student",
      date: moment().format("YYYY-MM-DD"),
      class: classes[0]?.value,
      section: sections.filter(
        (section) => section.class === classes[0]?.value
      )[0]?.value,
      allAttendance: "",
      attendance: [],
    };
  };

  const getValidationSchema = () => {
    return Yup.object({
      class: Yup.string(),
      section: Yup.string(),
      date: Yup.date().nullable().required("Date is required"),
      allAttendance: Yup.string(),
      attendance: Yup.array().of(
        Yup.object({
          attendanceStatus: Yup.string(),
        })
      ),
    });
  };

  const handleRadioChange = (e, values, setFieldValue) => {
    const selectedStatus = e.target.value;
    setFieldValue("allAttendance", selectedStatus);
    let updatedAttendance = values.attendance.map((data) => ({
      ...data,
      attendanceStatus: selectedStatus,
    }));
    setFieldValue("attendance", updatedAttendance);
  };

  const updateAttendance = (e, index, values, setFieldValue) => {
    let updatedAttendance = JSON.parse(JSON.stringify(values.attendance));
    updatedAttendance[index].attendanceStatus = e.target.value;
    setFieldValue("attendance", updatedAttendance);
  };

  const handleClassChange = (e, setFieldValue) => {
    const classValue = e.target.value;
    setFieldValue("class", classValue);
    setFieldValue("section", "");
    setFieldValue("allAttendance", "");
    setAttendanceMarked(false)
  };

  const handleSectionChange = (e, values, setFieldValue) => {
    const sectionValue = e.target.value;
    setFieldValue("section", sectionValue);
    setFieldValue("allAttendance", "");
    setAttendanceMarked(false)
  };

  const handleSubmit = async (values) => {
    setAttendanceMarked(false)
    const incompleteAttendance = values.attendance.some(
      (student) => !student.attendanceStatus
    );
    if (incompleteAttendance) {
      handleApiResponse({message:"Please add attendance for all the students."});
      return; // Stop execution if validation fails
    }
    try {
      const response = await postData(ATTENDANCE, values);
      setAttendanceMarked(true)
      handleApiResponse(response.data.message, "success");
    } catch (error) {
      handleApiResponse(error);
    }
  };

  const handleSearch = (e, setFieldValue) => {
    const query = e.target.value?.toLowerCase();
    const fileteredData = studentList.filter((student) =>
      student.name.toLowerCase().includes(query)
    );
    setFieldValue("attendance", fileteredData);
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
              <AttendanceSidebar
                values={values}
                classes={classes}
                sections={sections}
                handleRadioChange={handleRadioChange}
                setFieldValue={setFieldValue}
                handleClassChange={handleClassChange}
                handleSectionChange={handleSectionChange}
                user="student"
                attendanceMarkedValue={attendanceMarked}
              />

              {/* Main Content */}
              <div className="-mx-2 -my-2  mt-0 overflow-x-auto sm:-mx-6  w-full lg:w-3/4">
                <div className="inline-block min-w-full align-middle sm:px-6 ">
                  {/* <div className="relative"> */}
                  <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
                    <div className="relative table-tool-bar z-30">
                      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-3 sm:px-4">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                          <div className="flex items-center gap-4">
                            <div className="relative rounded-md  inline-block  ">
                              <input
                                name="search"
                                placeholder="Search"
                                onChange={(e) => handleSearch(e, setFieldValue)}
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
                          {values.attendance && values.attendance.length > 0 ? (
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
                                        {student.pic ? (
                                          <div className="h-9 w-9 shrink-0">
                                            <img
                                              alt="Staff"
                                              src={student.pic}
                                              className="h-9 w-9 rounded-full"
                                            />
                                          </div>
                                        ) : (
                                          <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                            <span className="font-medium text-gray-600 dark:text-gray-300">
                                              {student.name.charAt(0)}
                                            </span>
                                          </div>
                                        )}
                                        {/* Staff Details */}
                                        <div className="ml-4">
                                          <div className="font-medium text-gray-900 text-purple-600">
                                            {student.name}{" "}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      {student.admissionNo}
                                    </td>

                                    <td>
                                      <CustomRadio
                                        name={`attendance.${index}.attendanceStatus`}
                                        options={[
                                          ...attendanceOptions
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
                              <td
                                colSpan={5}
                                className="text-center px-2 py-3.5  text-sm font-semibold text-gray-900"
                              >
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
                  {/* </div> */}
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default StudentDailyAttendance;
