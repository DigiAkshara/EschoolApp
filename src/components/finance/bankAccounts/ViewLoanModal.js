import { DialogPanel, DialogTitle } from '@headlessui/react'
import {
  ChatBubbleBottomCenterTextIcon,
  PhoneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import moment from 'moment'
import React from 'react'
import { capitalizeWords } from '../../../commonComponent/CommonFunctions'

const ViewLoanModal = ({ data, onClose }) => {
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
                        View Loan or Advance
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
                        {data?.staff?.profilePic ? <img
                          alt=""
                          src={data?.staff?.profilePic?.Location}
                          className="size-36 shrink-0 rounded-full bg-gray-300"
                        /> :
                          <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                            <span className="font-medium text-gray-600 dark:text-gray-300">
                              {data?.staff?.firstName?.charAt(0)}
                            </span>
                          </div>}
                        <div className="flex-1 truncate">
                          <div className="flex justify-between space-x-3">
                            <h3 className="truncate text-lg font-medium text-gray-900">
                              {capitalizeWords(data?.staff?.firstName + " " + data?.staff?.lastName)}
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
                                  {data?.staff?.empId}
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Designation
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {data?.staff?.designation?.name || 'N/A'}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-content">
                      <div className="student-tab-info-blk py-4">
                        {/* Loan details */}
                        <div className="overflow-hidden rounded-xl ">
                          <div className="py-4 text-sm/6">
                            <div className="flex-1 truncate">
                              <div className="student-hdr-info-items-blk mt-2">
                                <dl className="grid grid-flow-col auto-cols-min gap-8">
                                  <div className="sm:col-span-1">
                                    <dt className="text-sm/6 text-gray-500">
                                      Loan Issued Date
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                      {moment(data?.issuedDate).format('DD-MM-YYYY')}
                                    </dd>
                                  </div>
                                  <div className="sm:col-span-1">
                                    <dt className="text-sm/6 text-gray-500">
                                      Issued Loan Amount
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                      {data?.loanAmount}/-
                                    </dd>
                                  </div>
                                  <div className="sm:col-span-1">
                                    <dt className="text-sm/6 text-gray-500">
                                      Paid Loan Amount
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                      {data?.paidAmount}/-
                                    </dd>
                                  </div>
                                  <div className="sm:col-span-1">
                                    <dt className="text-sm/6 text-gray-500">
                                      Total Outstanding Loan Amount
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                      {data?.loanAmount * 1 - data?.paidAmount * 1}/-
                                    </dd>
                                  </div>
                                  <div className="sm:col-span-1">
                                    <dt className="text-sm/6 text-gray-500">
                                      Status
                                    </dt>
                                    <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                      {capitalizeWords(data?.status)}
                                    </dd>
                                  </div>
                                </dl>
                              </div>
                            </div>
                            <hr className="my-4" />
                            <div className="py-4 text-sm/6">
                              <table className="min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
                                <thead className="bg-purple-100">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Payment Date
                                      </a>
                                    </th>

                                    <th
                                      scope="col"
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Paid Amount
                                      </a>
                                    </th>
                                    <th
                                      scope="col"
                                      className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Payment Mode
                                      </a>
                                    </th>

                                    <th
                                      scope="col"
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Bank Details
                                      </a>
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Payment Proof
                                      </a>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                  {data?.repayTransactions.length > 0 ?
                                    data?.repayTransactions.map((item) => (
                                      <tr key={item._id}>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                          {moment(item.date).format('DD-MM-YYYY')}
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                          {item.amount}/-
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                          {capitalizeWords(item.transactionMode)}
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                          {item.transactionMode==='online'?<span>{item.transactionBank?.name}-{item.transactionBank?.accountNumber} </span>:'-'}
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                                          {item.proof ? <a href={item.proof.Location} target="_blank">View</a>:"-"}
                                        </td>
                                      </tr>)) :
                                    <tr> <td colSpan={5} className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 text-center">No Repayments</td></tr>}
                                </tbody>
                              </table>
                            </div>
                          </div>
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

export default ViewLoanModal
