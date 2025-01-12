import React from 'react'
import CustomDate from '../../commonComponent/CustomDate'
import CustomInput from '../../commonComponent/CustomInput'
import CustomSelect from '../../commonComponent/CustomSelect'

const ManageHolidaySidebar = ({academicYears}) => {
  return (
    <div className="bg-white border  rounded-lg p-6 w-full lg:w-1/4">
      <h2 className="text-xl font-semibold mb-4">Holiday Entry</h2>

      {/* Date Picker */}
      <div className="mb-4">
        <CustomSelect
          name="academicYear"
          label="Academic year"
          options={academicYears}
          required={true}
        />
      </div>

      <div className="mb-4">
        <CustomDate
          name="startDate"
          label="Holiday From Date"
          required={true}
        />
      </div>
      <div className="mb-4">
        <CustomDate name="endDate" label="Holiday To Date" required={true} />
      </div>

      <div className="mb-4">
        <CustomInput
          name="name"
          label="Holiday Title"
          placeholder="Enter Holiday Title"
          required={true}
        />
      </div>

      {/* Save Button */}
      <button className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600">
        Add Holiday
      </button>

      {/* Attendance Marked */}
      <div className="mt-4 p-2 bg-green-100 text-green-600 rounded-md">
        Holiday Marked
      </div>
    </div>
  )
}

export default ManageHolidaySidebar
