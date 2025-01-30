import { DialogPanel, DialogTitle } from '@headlessui/react'
import {
  ChatBubbleBottomCenterTextIcon,
  PhoneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import CollectLoanDetails from './CollectLoanDetails'
import CollectLoanHistory from './CollectLoanHistory'

const CollectLoanModal = ({ onClose }) =>{
  const [activeTab, setActiveTab] = useState(0)
  const loanData = null
  const infoTabs = [
    {
      name: 'Loan or Advance Details',
      coponent: <CollectLoanDetails/>,
      current: true,
    },
    {
      name: 'Payment History',
      coponent: "",
      current: false,
    },
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <>
      <div className="fixed inset-0" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-5xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
                    >
              <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                <div className="flex min-h-0 flex-1 flex-col ">
                  <div className="bg-purple-900 px-3 py-3 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-base font-semibold text-white">
                        Collect Loan or Advance
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={onClose}
                          className="relative rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon
                            aria-hidden="true"
                            className="size-6"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6 overflow-y-auto">
                    <div className="student-big-card-blk">

                      <div className="flex w-full justify-between space-x-6 p-6 col-span-1 rounded-lg bg-white shadow border border-gray-300">
                        {loanData?.profilePic ? <img
                          alt=""
                          src={loanData.profilePic.Location}
                          className="size-36 shrink-0 rounded-full bg-gray-300"
                        /> :
                          <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                            <span className="font-medium text-gray-600 dark:text-gray-300">
                                {/* {studentData.student.firstName.charAt(0)} */}
                              s
                            </span>
                          </div>}
                        <div className="flex-1 truncate">
                          <div className="flex justify-between space-x-3">
                            <h3 className="truncate text-lg font-medium text-gray-900">
                              Jane Cooper
                            </h3>
                            <div className="right-contact-btns grid grid-cols-2 gap-4">
                              <button
                                type="button"
                                className="rounded bg-white px-2 py-1 text-xs font-semibold text-purple-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              >
                                <ChatBubbleBottomCenterTextIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              </button>
                              <button
                                type="button"
                                className="rounded bg-white px-2 py-1 text-xs font-semibold text-purple-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              >
                                <PhoneIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              </button>
                            </div>
                          </div>
                          <div className="student-hdr-info-items-blk mt-2">
                            <dl className="grid grid-flow-col auto-cols-min gap-8">
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Staff ID
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Designation
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-content">
                      <div>
                        <div className="sm:hidden">
                          <label
                            htmlFor="tabsinfoTabs"
                            className="sr-only"
                          >
                            Select a tab
                          </label>
                          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                          <select
                            id="infoTabs"
                            name="infoTabs"
                            onChange={(e) =>
                              setActiveTab(
                                infoTabs.findIndex(
                                  (tab) => tab.name === e.target.value,
                                ),
                              )
                            }
                            defaultValue={infoTabs[0].name}
                            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                          >
                            {infoTabs.map((tab) => (
                              <option key={tab.name}>{tab.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="hidden sm:block">
                          <div className="border-b border-gray-200">
                            <nav
                              aria-label="Tabs"
                              className="-mb-px flex space-x-8"
                            >
                              {infoTabs.map((tab, index) => (
                                <button
                                  key={index}
                                  onClick={() => setActiveTab(index)}
                                  className={classNames(
                                    activeTab === index
                                      ? 'border-purple-500 text-purple-600'
                                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                    'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium',
                                  )}
                                >
                                  {tab.name}
                                </button>
                              ))}
                            </nav>
                          </div>
                        </div>
                      </div>

                      <div className="student-tab-info-blk py-4">
                        {/* Loan details */}
                        <div className="overflow-hidden rounded-xl ">
                        {activeTab === 0 && (
                            <CollectLoanDetails onClose={onClose} />)}
                        {activeTab === 1 && (
                          <CollectLoanHistory onClose={onClose} />
                        )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </>
  )
}

export default CollectLoanModal
