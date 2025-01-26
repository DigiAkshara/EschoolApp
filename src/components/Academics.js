'use client'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchInitialAcademicData } from '../app/reducers/academicSlice'
import Class from './academics/Class'
import ManageCertificates from './academics/ManageCertificates'
import ManageDailyTimeTable from './academics/ManageDailyTimeTable'
import ManageExams from './academics/exams/ManageExams'
import Submenu from './Submenu'

export default function Academics() {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState(null)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'daily_time_tables':
        return <ManageDailyTimeTable />
      case 'classes':
        return <Class />
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
  },[dispatch])

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
