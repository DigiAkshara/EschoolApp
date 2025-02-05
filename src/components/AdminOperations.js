import {useState} from 'react'
import Submenu from './Submenu'
import Permissions from './adminopertions/Permissions'
import Profile from './adminopertions/Profile'
import Designation from './adminopertions/Designation'
import Academics from './adminopertions/Academics'
import ClassAndSection from './adminopertions/ClassAndSection'
import RouteMap from './adminopertions/RouteMap'

const AdminOperations = () => {
  const [activeTab, setActiveTab] = useState(null)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
      return <Profile /> 
      case 'permissions':
        return <Permissions />
        case 'designations':
          return <Designation />
          case 'academics':
            return <Academics />
          case 'Route Map' :
            return <RouteMap />
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
