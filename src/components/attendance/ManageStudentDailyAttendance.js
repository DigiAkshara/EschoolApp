import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { getData, postData } from "../../app/api";
import {  ACADEMICS, ATTENDANCE, CLASSES, HOLIDAYS, SECTIONS, STUDENT } from "../../app/url";
import { attendanceOptions } from "../../commonComponent/CommonFunctions";
import CustomRadio from "../../commonComponent/CustomRadio";
import AttendanceSidebar from "./AttendanceSidebar";

const ManageStudentDailyAttendance = () => {
  const [studentList, setStudentList] = useState([]);
  const [holidaysData, setHolidaysData] = useState([])
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [studentAttendance, setStudentAttendance] = useState([]);




  const getInitialValues = () => {
    return {
      date: new Date().toISOString().split("T")[0],
      class: classes[0]?.value,
      section: sections[0]?.value,
      allAttendance: "",
      attendance: []
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
    getClasses();
    getHolidayData();
    getStudentAttendance();
  }, []);



  const columns = [
    {title: 'Student Name', key: 'name'},
    {title: 'Admission Number', key: 'admissionNo'},
    {title: 'Attendance', key: 'attendance'},
    
  ]

  const getHolidayData = async () => {
    try {
      const response = await getData(HOLIDAYS)
      
      setHolidaysData(response.data.data)
    } catch (error) {
      console.error('Error getting data:', error)
    }
  }



  const getClasses = async () => {
    const res = await getData(CLASSES);
    const classData = res.data.data.map((item) => {
      return {
        label: item.name, // Displayed text in the dropdown
        value: item._id,
      };
    });
    setClasses(classData);
    if (classData.length > 0) {
      getSections(classData[0]?.value);
    }
  };


  const getSections = async (classId) => {
    try {
      const response = await getData(SECTIONS + "/" + classId);
  
      if (response.data?.data?.length > 0) {
        const sectionData = response.data.data.map((item) => ({
          label: item.section, 
          value: item._id, 
        }));
  
        setSections(sectionData);
  
        
        const firstSectionId = sectionData[0]?.value;
        if (firstSectionId) {
          await getStudents(classId, firstSectionId);
        }
      } else {
        console.warn("No sections available for the selected class.");
        setSections([]); 
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setSections([]); 
    }
  };
  


  const getStudents = async (classId, sectionID) => {
    try {
      const res = await getData(ACADEMICS+"/"+classId+"/"+sectionID);
  
      if (res.data?.data) {
        const stuData = res.data.data.map((item) => ({
          _id: item.student._id,
          pic: item.student.profilePic?.Location || "", 
          name: `${item.student.firstName} ${item.student.lastName}`,
          admissionNo: item.student.admissionNumber,
          className: item.class?.name || "N/A", 
          class: item.class?._id || null, 
          section: item.section || "N/A", 
        }));
  
        setStudentList(stuData);
      } else {
        console.warn("No data found for the specified class and section.");
        setStudentList([]); 
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setStudentList([]); 
    }
  };

  const getStudentAttendance = async () => {
    try {
      const response = await getData(STUDENT + "/attendance");
      setStudentAttendance(response.data.data)
    } catch (error) {
      console.error("Error getting data:", error);
    }
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

  const handleClassChange = (e, values, setFieldValue) => {
    const classValue = e.target.value;
    setFieldValue("class", classValue);
    getSections(classValue);
    
  };

  const handleSectionChange = (e, values, setFieldValue) => {
    const sectionValue = e.target.value;
    setFieldValue("section", sectionValue);
    getStudents(values.class, sectionValue);
    setFieldValue("attendance", studentList);
  };

  const paginatedData = studentList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )


  const handleSubmit = async (values) => {
        console.log("Form submitted with values:", values);
        values["userType"] = "student";

        const incompleteAttendance = values.attendance.some(
          (student) => !student.attendanceStatus
        );
      
        if (incompleteAttendance) {
          setAttendanceMessage("Please add attendance for all the students.");
          setTimeout(() => {
            setAttendanceMessage("");
          }, 5000);
          return; // Stop execution if validation fails
        }

    try {
      const response = await postData(ATTENDANCE, values);
      if (response.status === 201) {
        setAttendanceMessage("Attendance Marked");
      } else {
        setAttendanceMessage("Failed to mark attendance. Please try again.");
      }
      setTimeout(() => {
        setAttendanceMessage("");
      }, 5000);
        
         } catch (error) {
      console.error("Error while posting data:", error);
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
              <AttendanceSidebar
                values={values}
                holidaysData={holidaysData}
                classes={classes}
                handleRadioChange={handleRadioChange}
                setFieldValue={setFieldValue}
                handleClassChange={handleClassChange}
                handleSectionChange={handleSectionChange}
                sections={sections}
                getSections={getSections}
                attendanceMessage={attendanceMessage}
                setAttendanceMessage={setAttendanceMessage}
                studentAttendance={studentAttendance}
                user="student"
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
                                  id="email"
                                  name="email"
                                  type="email"
                                  placeholder="Search"
                                  // onChange={handleSearch}
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
                                    <tr
                                      key={student._id}
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
                                        {student.admissionNumber}
                                      </td>
                                    
                                      <td>
                                        <CustomRadio
                                          name={`attendance.${index}.attendanceStatus`}
                                          options={attendanceOptions}
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
                                <td colSpan={5} className="text-center px-2 py-3.5  text-sm font-semibold text-gray-900">
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

export default ManageStudentDailyAttendance;
