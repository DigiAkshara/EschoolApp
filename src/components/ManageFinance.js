
'use client'

import React, { useRef, useState } from 'react'

import ManageFeeCollection from './ManageFeeCollection'
import ManageFeesOverview from './ManageFeesOverview'
import FinanceFeesStructure from './ManageFeesStructure'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}



const tabs = ['Overview','Fee Collections','Staff Salaries','Expenses','Fee Structures','School Bank Accounts','Discounts','Payrolls']



export default function ManageFinance() {
 
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const [value, setValue] = useState({
 
});

const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return <ManageFeesOverview />;
      case "Fee Collections":
        return <ManageFeeCollection />;
      case "Fee Structures":
        return <FinanceFeesStructure />;
     
      default:
        return <h2>No Content Available</h2>;
    }
  };



  return (
    
<div className="flow-root">
        {/* Primary Tabs */}
        <div>
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
              <select
                id="tabs"
                name="tabs"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
              >
                {tabs.map((tab) => (
                  <option key={tab} value={tab}>{tab}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav aria-label="Tabs" className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={classNames(
                        activeTab === tab
                          ? 'border-purple-500 text-purple-600'
                          :'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium',
                      )}
                      
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
        </div>
        {renderTabContent()}
  </div>
    
  )
}




