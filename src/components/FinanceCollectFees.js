import { DialogPanel, DialogTitle } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { ChatBubbleBottomCenterTextIcon, PhoneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import FinancCollectFeesDetails from "./FinancCollectFeesDetails";
import FinanceCollectFeeHistory from "./FinanceCollectFeeHistory";

function FinanceCollectFees({ onClose }) {
  const [open2, setOpen2] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const feeInfoTabs = [
    {
      name: "Fee Details",
      coponent: <FinancCollectFeesDetails />,
      current: true,
    },
    {
      name: "Fee History",
      coponent: <FinanceCollectFeeHistory />,
      current: false,
    },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const people2 = [
    {
      name: "Janet Baker",
      title: "12345678 | 1A",
      email: "janecooper@example.com",
      telephone: "+1-202-555-0170",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
    },
    // More people...
  ];

  return (
    <>
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-7xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                <div className="flex min-h-0 flex-1 flex-col ">
                  <div className="bg-purple-900 px-3 py-3 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className=" text-base font-semibold text-white">
                        Collect Fee{" "}
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={onClose}
                          className="relative rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6 overflow-y-auto">
                    <div className="student-big-card-blk">
                      <div className="flex w-full justify-between space-x-6 p-6 col-span-1 rounded-lg bg-white shadow border border-gray-300">
                        {people2.map((person2) => (
                          <img
                            alt=""
                            src={person2.imageUrl}
                            className="size-36 shrink-0 rounded-full bg-gray-300"
                          />
                        ))}
                        <div className="flex-1 truncate">
                          <div className="flex justify-between space-x-3">
                            <h3 className="truncate text-lg font-medium text-gray-900">
                              Janet Baker
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
                                  Academic year
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  2023-2024
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Admission No
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  12345678
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Class & Section
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  2 / A
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Roll No
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  12
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">DOB</dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  12-10-2014
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Gender
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  Female
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Father Name
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  John Deakin
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Father Mobile
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  9887654345
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
                          <label htmlFor="tabsfeeInfoTabs" className="sr-only">
                            Select a tab
                          </label>
                          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                          <select
                            id="feeInfoTabs"
                            name="feeInfoTabs"
                            onChange={(e) =>
                              setActiveTab(
                                feeInfoTabs.findIndex(
                                  (tab) => tab.name === e.target.value
                                )
                              )
                            }
                            defaultValue={feeInfoTabs[0].name}
                            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                          >
                            {feeInfoTabs.map((tab) => (
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
                              {feeInfoTabs.map((tab, index) => (
                                <button
                                  key={index}
                                  onClick={() => setActiveTab(index)}
                                  className={classNames(
                                    activeTab === index
                                      ? "border-purple-500 text-purple-600"
                                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                    "whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium"
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
                        {/* Fee details */}
                        {activeTab === 0 && (
                          <div className="overflow-hidden rounded-xl ">
                            <FinancCollectFeesDetails />
                          </div>
                        )}
                        {activeTab === 1 && (
                          <div className="overflow-hidden rounded-xl ">
                            <FinanceCollectFeeHistory />
                          </div>
                        )}
                       
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center justify-between px-4 py-4 bg-gray-100">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> out of{" "}
                      <span className="font-medium">122</span> results
                    </p>
                  </div>
                  <div>
                    <nav
                      aria-label="Pagination"
                      className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    >
                      <a
                        href="#"
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon
                          aria-hidden="true"
                          className="size-5"
                        />
                      </a>

                      <a
                        href="#"
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon
                          aria-hidden="true"
                          className="size-5"
                        />
                      </a>
                    </nav>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </>
  );
}

export default FinanceCollectFees;
