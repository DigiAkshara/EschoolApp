import { useState } from 'react'
import Submenu from './Submenu'
import Academics from './adminopertions/Academics'
import Branch from './adminopertions/Branch'
import Designation from './adminopertions/Designation'
import Finance from './adminopertions/Finance'
import Permissions from './adminopertions/Permissions'
import Profile from './adminopertions/Profile'
import ReceiptNames from './adminopertions/ReceiptNames'

const AdminOperations = () => {
  const [activeTab, setActiveTab] = useState(null)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile />
      case 'receipt_names':
          return <ReceiptNames />
      case 'permissions':
        return <Permissions />
      case 'designations':
        return <Designation />
      case 'academics':
        return <Academics />
      case 'branch':
        return <Branch />
      case 'finance':
        return <Finance />
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
export default AdminOperations
