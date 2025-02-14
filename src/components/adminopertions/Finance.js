import React, { useState } from 'react'
import Subjects from './Subjects'
import BreakTime from './BreakTime'
import CreditDebit from './CreditDebit'
import Debit from './Debit'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Finance() {
    const [activeTab, setActiveTab] = useState(0)
    
    const tabs2 = [
      {
        name: 'Credit & Debit',
        component: <CreditDebit />,
        current: true,
      }
    ]
    
    const handleTabChange = (index) => {
      setActiveTab(index) 
    }
  return (
    <>
    <div className="flow-root">
      {/* Primary Tabs */}
      <div className="mt-4 flex justify-between">
        <div className="text-lg text-gray-900 font-medium">
          <div className="sm:hidden">
            <label htmlFor="tabs2" className="sr-only">
              Select a tab
            </label>
            {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
            <select
              id="tabs2"
              name="tabs2"
              value={activeTab}
              onChange={(e) => handleTabChange(e.target.value)}
              className="block w-full rounded-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            >
              {tabs2.map((tab, index) => (
                <option key={tab.name} value={index}>
                  {tab.name}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav aria-label="Tabs2" className="flex space-x-4">
              {tabs2.map((tab, index) => (
                <button
                  key={tab.name}
                  onClick={() => handleTabChange(index)}
                  className={classNames(
                    activeTab === index
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-500 hover:text-gray-700',
                    'rounded-full px-3 py-2 text-sm font-medium',
                  )}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      {tabs2[activeTab].component}
    </div>
    </>
  )
}

export default Finance