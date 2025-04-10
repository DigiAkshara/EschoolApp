'use client'
import React, {useEffect, useState} from 'react'
import ManageFeeCollection from './finance/ManageFeeCollection'
import ManageFeesOverview from './finance/ManageFeesOverview'
import Submenu from './Submenu'
import FeesList from './finance/FeesList'
import Expenses from './finance/expenses/Expenses'
import SchoolBankAccounts from './finance/bankAccounts/SchoolBankAccounts'
import { useDispatch } from 'react-redux'
import { fetchInitialFeeData } from '../app/reducers/feeSlice'

export default function Finance() {
  const dispatch= useDispatch()
  const [activeTab, setActiveTab] = useState(null)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ManageFeesOverview />
      case 'fee_collections':
        return <ManageFeeCollection />
      case 'fee_structures':
        return <FeesList />
      case 'expenses':
        return <Expenses/>
      case 'bank_accounts':
          return <SchoolBankAccounts/>
      default:
        return <h2>No Content Available</h2>
    }
  }
  useEffect(() => {
    dispatch(fetchInitialFeeData())
  }, [])

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
