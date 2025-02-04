import React, { useEffect, useState } from "react";
import {
  attendanceOptions,
  staffCategory,
} from "../../commonComponent/CommonFunctions";
import CustomDate from "../../commonComponent/CustomDate";
import CustomRadio from "../../commonComponent/CustomRadio";
import CustomSelect from "../../commonComponent/CustomSelect";
import CustomButton from "../../commonComponent/CustomButton";
import moment from "moment";

const AttendanceSidebar = ({
  values,
  setFieldValue,
  holidaysData,
  user,
  handleRadioChange,
  handleStaffCategory,
  handleClassChange,
  handleSectionChange,
  classes,
  sections,
  getSections,
  attendanceMessage,
  attendanceDates,
  staffAttendanceData,
  studentAttendance,
  setAttendanceMessage
}) => {

  const [holiday, setHoliday] = useState(false)
  const [attendanceMarked, setAttendanceMarked] = useState(false)

  useEffect(() => {
    checkHoliday();
    checkAttendanceForSelectedDate();
  }, [values.date, holidaysData, staffAttendanceData]);

 

  const checkHoliday = () => {
    const selectedDate =  moment(values.date).format('DD-MM-YYYY');
    const todayDate = moment().format('DD-MM-YYYY');
   
     const currentDate = selectedDate || todayDate;
    

    const isHolidayToday = holidaysData?.some((holiday) => {
      const holidayStart =moment(holiday.startDate).format('DD-MM-YYYY');
      const holidayEnd = moment(holiday.endDate).format('DD-MM-YYYY');
      return currentDate >= holidayStart && currentDate <= holidayEnd;
    });

    if (isHolidayToday) {
      setHoliday(true);
    } else {
      setHoliday(false);
    }
  };

  const checkAttendanceForSelectedDate = () => {
    const selectedDate = moment(values.date).format("YYYY-MM-DD");

    // Check if attendance has been marked for the selected date
    const isStaffMarked = staffAttendanceData?.some((staff) =>
      staff.attendance.some(
        (entry) => moment(entry.date).format("YYYY-MM-DD") === selectedDate
      )
    );
  
    // Check if attendance has been marked for the selected date (student)
    const isStudentMarked = studentAttendance?.some((student) =>
      student.attendance.some(
        (entry) => moment(entry.date).format("YYYY-MM-DD") === selectedDate
      )
    );
  
    // Set attendance status
    const isMarked = isStaffMarked || isStudentMarked;
    setAttendanceMarked(isMarked);

    if (isMarked) {
      setAttendanceMessage("Attendance already marked for this date.");
    } else {
      setAttendanceMessage("");
    }
  };


  const attendanceCounts = values.attendance.reduce(
    (acc, entry) => {
      switch (entry.attendanceStatus) {
        case "present":
          acc.present += 1;
          break;
        case "absent":
          acc.absent += 1;
          break;
        case "half-day":
          acc.halfDay += 1;
          break;
        case "leave":
          acc.leave += 1;
          break;
        default:
          break;
      }
      return acc;
    },
    { present: 0, absent: 0, halfDay: 0, leave: 0 }
  );

  return (
    <div className="bg-white border  rounded-lg p-6 w-full lg:w-1/4">
      <h2 className="text-xl font-semibold mb-4">
        {user === "staff"
          ? "Staff Attendance"
          : user === "student"
          ? "Student Attendance"
          : "Attendance"}
      </h2>

      {/* Date Picker */}
      <div className="mb-4">
        <CustomDate name="date" label=" Date"  required={true} />
      </div>

      {user === "staff" && (
        <div className="mb-4">
          <CustomSelect
            name="staffCategory"
            options={staffCategory}
            label="Select Staff Type"
            value={values.staffCategory}
            onChange={(e) => 
              handleStaffCategory(e, setFieldValue)}
          />
        </div>
      )}

      {!holiday && user === "student" && (
          <div className="mb-4">
          {/* Heading */}
          <h2 className="block text-sm/6 font-regular text-gray-900">Select Class and Section</h2>
        <div className="flex flex-col lg:flex-row mb-4 gap-2">
          
          <div className="w-full lg:w-1/2">
            <CustomSelect
              name="class"
              value={values.class}
              options={classes}
              onChange={(e) => {
                handleClassChange(e, values, setFieldValue);
                getSections(e.target.value); // Fetch and set sections
              }}
            />
          </div>

          
          <div className="w-full lg:w-1/2">
            <CustomSelect
              name="section"
              value={values.section}
              options={sections}
              onChange={(e) => {
                handleSectionChange(e, values, setFieldValue)
              }}
            />
          </div>
          
        </div>
        </div>
      )}

      {!holiday&& !attendanceMarked  && (
        <div className="mb-4">
        <CustomRadio
          name="allAttendance"
          label={
            user === "staff"
              ? "Set attendance for all Staffs"
              : "Set attendance for all Students"
          }
          options={
            user === "staff"
              ? [...attendanceOptions, { value: "leave", label: "Leave" }]
              : attendanceOptions
          }
          value={values.allAttendance}
          onChange={(e) => handleRadioChange(e, values, setFieldValue)}
        />
      </div>
      )}

      {/* <div className="mb-4">
        <CustomRadio
          name="allAttendance"
          label={
            user === "staff"
              ? "Set attendance for all Teachers"
              : "Set attendance for all Students"
          }
          options={
            user === "staff"
              ? [...attendanceOptions, { value: "leave", label: "Leave" }]
              : attendanceOptions
          }
          value={values.allAttendance}
          onChange={(e) => handleRadioChange(e, values, setFieldValue)}
        />
      </div> */}
      {!holiday && user === "student" && (
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sendSms"
              name="sendSms"
              className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              onChange={(e) => setFieldValue("sendSms", e.target.checked)}
            />
            <label
              htmlFor="sendSms"
              className="ml-2 block text-sm text-gray-900"
            >
              Send SMS
            </label>
          </div>
        </div>
      )}

      {!holiday && !attendanceMarked &&(
      <CustomButton type="submit" label="Save Attendance"  />

      )}
      {holiday && (
  <div className="mt-4 text-center text-red-500 font-semibold">
    Today Holiday
  </div>
)}
    
      <div className="mt-6">
        <ul>
          <li className="flex justify-between border-b border-gray-300 pb-2">
            <span>{user === "staff" ? "Total Teachers:" : "Strength:"}</span>{" "}
            <span>{values.attendance.length} </span>
          </li>
          <li className="flex justify-between border-b border-gray-300 pb-2">
            <span>Present:</span> <span>{attendanceCounts.present}</span>
          </li>
          <li className="flex justify-between border-b border-gray-300 pb-2">
            <span>Absent:</span> <span>{attendanceCounts.absent}</span>
          </li>
          <li className="flex justify-between border-b border-gray-300 pb-2">
            <span>Half Day:</span> <span>{attendanceCounts.halfDay}</span>
          </li>
          {user === "staff" && (
            <li className="flex justify-between border-b border-gray-300 pb-2">
              <span>Leave:</span> <span>{attendanceCounts.leave}</span>
            </li>
          )}
        </ul>
      </div>
      {/* Attendance Marked */}
      {attendanceMessage && (
        <div
          className={`mt-4 p-2 rounded-md ${
            attendanceMessage === "Attendance Marked"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {attendanceMessage}
        </div>
      )}
    </div>
  );
};

export default AttendanceSidebar;
