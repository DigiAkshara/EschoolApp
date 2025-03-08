'use client'
import React, { useState } from 'react'
import Submenu from './Submenu'
import FinanceReports from './reportsAnalytics/financeReports/FinanceReports'

export default function ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState(null)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'finance_reports':
        return <FinanceReports />
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
