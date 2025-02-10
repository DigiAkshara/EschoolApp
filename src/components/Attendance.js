'use client'
import React, {useEffect, useState} from 'react'
import StaffAttendance from './attendance/StaffAttendance'
import StudentAttendance from './attendance/StudentAttendance'
import HolidayAttendance from './attendance/HolidayAttendance'
import Submenu from './Submenu'
import { getData } from '../app/api'
import { HOLIDAYS } from '../app/url'
import { useDispatch } from 'react-redux'
import { updateHolidays } from '../app/reducers/attendanceSlice'
import { handleApiResponse } from '../commonComponent/CommonFunctions'
import { fetchInitialStudentData } from '../app/reducers/studentSlice'

export default function Attendance() {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState(null)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'staff_attendance':
        return <StaffAttendance />
      case 'student_attendance':
        return <StudentAttendance />
      case 'holiday_entry':
        return <HolidayAttendance />
      default:
        return <h2>No Content Available</h2>
    }
  }

  const getHolidays = async () => {
      try {
        let res = await getData(HOLIDAYS)
        dispatch(updateHolidays(res.data.data))
      } catch (error) {
        handleApiResponse(error)
      }
    }

  useEffect(()=>{
    dispatch(fetchInitialStudentData());
    getHolidays()
  },[])

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
