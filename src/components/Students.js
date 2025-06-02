import { useState } from 'react'
import Submenu from './Submenu'
import StudentTabs from './students/StudentTabs'

export default function Students() {
  const [activeTab, setActiveTab] = useState(null)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'student_details':
        return <StudentTabs />
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
