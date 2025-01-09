import React from "react";
import CustomSelect from "../commonComponent/CustomSelect";
import { staffCategory } from "../commonComponent/CommonFunctions";
import CustomDate from "../commonComponent/CustomDate";

const AttendanceSidebar = ({ date, setDate, handleSaveAttendance, user, setGlobalAttendance  }) => {  

  const handleRadioChange = (e) => {
    const selectedStatus = e.target.value;
    setGlobalAttendance((prevAttendance) => {
      return Object.keys(prevAttendance).reduce((acc, studentId) => {
        acc[studentId] = selectedStatus;
        return acc;
      }, {});
    });
  };

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
            value="teacher"
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

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          {user === "staff"
            ? "Set attendance for all Teacher"
            : "Set attendance for all students"}
        </label>
        
        <div className="flex flex-wrap gap-4 mt-2">
  {user === "staff" ? (
    ["Present", "Absent", "Half Day", "Leave"].map((status) => (
      <label key={status} className="flex items-center gap-2 text-gray-700">
        <input
          type="radio"
          name="attendance"
          className="text-purple-500 focus:ring-purple-500"
          value={status}
          onChange={handleRadioChange}
        />
        {status}
      </label>
    ))
  ) : (
    ["Present", "Absent", "Half Day"].map((status) => (
      <label key={status} className="flex items-center gap-2 text-gray-700">
        <input
          type="radio"
          name="attendance"
          className="text-purple-500 focus:ring-purple-500"
          value={status}
          onChange={handleRadioChange}
        />
        {status}
      </label>
    ))
  )}
</div>

      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveAttendance}
        className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600"
      >
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
