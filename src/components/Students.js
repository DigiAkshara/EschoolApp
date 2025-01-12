import { useState } from 'react'
import StudentDetails from './students/StudentDetails'
import Submenu from './Submenu'

export default function Students() {
  const [activeTab, setActiveTab] = useState(null)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'student_details':
        return <StudentDetails />
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
