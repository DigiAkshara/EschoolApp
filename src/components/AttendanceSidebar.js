import React, { useEffect, useState } from "react";
import CustomSelect from "../commonComponent/CustomSelect";
import {
  attendanceOptions,
  sections,
  staffCategory,
} from "../commonComponent/CommonFunctions";
import CustomDate from "../commonComponent/CustomDate";
import CustomRadio from "../commonComponent/CustomRadio";

const AttendanceSidebar = ({
  values,
  setFieldValue,
  user,
  handleRadioChange,
  handleStaffCategory,
  handleClassChange,
  handleSectionChange,
  classes,
}) => {


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

  // console.log("values updated:", values);

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
        <CustomDate name="date" label=" Date" required={true} />
      </div>

      {user === "staff" && (
        <div className="mb-4">
          <CustomSelect
            name="staffCategory"
            options={staffCategory}
            value={values.staffCategory}
            onChange={(e) => handleStaffCategory(e, setFieldValue)}
          />
        </div>
      )}

      {user === "student" && (
        <div className="flex flex-col lg:flex-row mb-4 gap-2">
          <div className="w-full lg:w-1/2">
            <CustomSelect name="class" 
            value={classes.length > 0 ? classes[0].value : ""} 
            options={classes}
            onChange={(e) => handleClassChange(e,values, setFieldValue)}           
            />
          </div>

          
          <div className="w-full lg:w-1/2">
            <CustomSelect name="section" 
            value={values.section} 
            options={sections}
            onChange={(e) =>
              handleSectionChange(e,values, setFieldValue)
            }
             />
          </div>
        </div>
      )}

      <div className="mb-4">
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
      </div>
      {user === "student" && (
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

      {/* Save Button */}
      <button className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600">
        Save Attendance
      </button>
      {/* Summary */}
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
      <div className="mt-4 p-2 bg-green-100 text-green-600 rounded-md">
        Attendance Marked
      </div>
    </div>
  );
};

export default AttendanceSidebar;
