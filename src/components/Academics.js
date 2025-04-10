'use client'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchInitialAcademicData } from '../app/reducers/academicSlice'
import ManageCertificates from './academics/ManageCertificates'
import ManageDailyTimeTable from './academics/ManageDailyTimeTable'
import ManageExams from './academics/exams/ManageExams'
import Submenu from './Submenu'
import ClassTimeTable from './academics/ClassTimeTable'

export default function Academics() {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState(null)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'daily_time_tables':
        return <ClassTimeTable />
      case 'exams':
        return <ManageExams />
      case 'certificates':
        return <ManageCertificates />
      default:
        return <h2>No Content Available</h2>
    }
  }


  useEffect(() => {
    dispatch(fetchInitialAcademicData())
  },[])

  return (
    <div className="flow-root">
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
