'use client'
import React, { useEffect, useState } from 'react'
import Submenu from './Submenu'
import FinanceReports from './reportsAnalytics/financeReports/FinanceReports'
import { useDispatch } from 'react-redux'
import { fetchInitialAcademicData } from '../app/reducers/academicSlice'

export default function ReportsAnalytics() {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState(null)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'finance_reports':
        return <FinanceReports />
      default:
        return <h2>No Content Available</h2>
    }
  }

  useEffect(() => {
    dispatch(fetchInitialAcademicData())
  }, [])

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
