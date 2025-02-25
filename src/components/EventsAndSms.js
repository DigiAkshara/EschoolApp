import { useState } from 'react'
import Submenu from './Submenu'
import Events from './sms/Events'
import Sms from './sms/Sms'
import Templates from './sms/Templates'
import WhatsApp from './sms/WhatsApp'

export default function EventsAndSms() {
  const [activeTab, setActiveTab] = useState(null)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'events':
        return <Events />
        case 'sms':
        return <Sms />
        case 'templates':
        return <Templates />
        case 'whatsapp':
        return <WhatsApp />
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
