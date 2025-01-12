'use client'
import React, {useState} from 'react'
import ManageStaffAttendance from './attendance/ManageStaffAttendance'
import ManageStudentAttendance from './attendance/ManageStudentAttendance'
import ManageHolidayAttendance from './attendance/ManageHolidayAttendance'
import Submenu from './Submenu'

export default function Attendance() {
  const [activeTab, setActiveTab] = useState(null)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'staff_attendance':
        return <ManageStaffAttendance />
      case 'student_attendance':
        return <ManageStudentAttendance />
      case 'holiday_entry':
        return <ManageHolidayAttendance />
      default:
        return <h2>No Content Available</h2>
    }
  }

  return (
    <div className="flow-root">
      {/* Primary Tabs */}
      <Submenu
        activeTab={activeTab}
        handleTab={(value) => {
          setActiveTab(value)
        }}
      />
      {renderTabContent()}
    </div>
  )
}
