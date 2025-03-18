import { useState } from 'react'
import Submenu from './Submenu'
import Help from '../components/Help'
import FAQ from '../components/FAQ'

const HelpFAQ = () => {
  const [activeTab, setActiveTab] = useState(null)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Help':
        return <Help />
      case 'FAQ':
        return <FAQ />
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
export default HelpFAQ
