import {useState} from 'react'
import Submenu from './Submenu'
import Permissions from './adminopertions/Permissions'

const AdminOperations = () => {
  const [activeTab, setActiveTab] = useState(null)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'permissions':
        return <Permissions />
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
