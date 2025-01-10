import React from "react";
import CustomSelect from "../commonComponent/CustomSelect";
import {
  attendanceOptions,
  staffCategory,
} from "../commonComponent/CommonFunctions";
import CustomDate from "../commonComponent/CustomDate";
import CustomRadio from "../commonComponent/CustomRadio";

const AttendanceSidebar = ({ values, setFieldValue, user, handleRadioChange  }) => {


  console.log("values updated:", values);

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
            defaultValue="teacher"
          />
        </div>
      )}

      {user === "student" && (
        <div className="flex flex-col lg:flex-row mb-4 gap-2">
          {/* Select box for Class */}
          <div className="w-full lg:w-1/2">
            <select
              id="class"
              name="class"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value="class1" // Set the initial value
            >
              <option value="class1">Class 1</option>
            </select>
          </div>

          {/* Select box for Section */}
          <div className="w-full lg:w-1/2">
            <select
              id="section"
              name="section"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value="A" // Set the initial value
            >
              <option value="A">Section A</option>
            </select>
          </div>
        </div>
      )}

      {/* <div className="mb-4">
        <div className="flex flex-wrap">
          <div className="sm:col-span-2">
            <CustomRadio
              name="allAttendance"
              label={
                user === "staff"
                  ? "Set attendance for all Teachers"
                  : "Set attendance for all Students"
              }
              options={
                user === "staff"
                  ? [...attendanceStatus, { value: "leave", label: "Leave" }]
                  : attendanceStatus
              }
              onChange={(e) => {
                const status = e.target.value; 
               
                const updatedStaff = values.attendance.map((data) => ({
                  ...data,
                  attendanceStatus: status,
                }));

                setFieldValue("attendance", updatedStaff); 
              }}
            />
          </div>
          
        </div>
      </div> */}

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
        // onChange={handleRadioChange}
        onChange= {(e)=>handleRadioChange(e,values,setFieldValue)}
        
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
            <span>20</span>
          </li>
          <li className="flex justify-between border-b border-gray-300 pb-2">
            <span>Present:</span> <span>18</span>
          </li>
          <li className="flex justify-between border-b border-gray-300 pb-2">
            <span>Absent:</span> <span>1</span>
          </li>
          <li className="flex justify-between border-b border-gray-300 pb-2">
            <span>Half Day:</span> <span>0</span>
          </li>
          {user === "staff" && (
            <li className="flex justify-between border-b border-gray-300 pb-2">
              <span>Leave:</span> <span>1</span>
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
