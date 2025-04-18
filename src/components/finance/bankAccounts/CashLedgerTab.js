'use client'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ArrowDownIcon, ArrowUpIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { ArrowDownTrayIcon, ArrowsUpDownIcon, DocumentCurrencyRupeeIcon, EnvelopeOpenIcon, FunnelIcon, UsersIcon } from '@heroicons/react/24/outline'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { getData } from '../../../app/api'
import { BANK_ACCOUNTS, TRANSACTIONS } from '../../../app/url'
import { capitalizeWords, handleApiResponse } from '../../../commonComponent/CommonFunctions'
import Datepicker from 'react-tailwindcss-datepicker'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const stats = [
  { id: 1, name: 'Total Cash Received', stat: '1,897', icon: DocumentCurrencyRupeeIcon, change: '122', changeType: 'increase' },
  { id: 2, name: 'Expenses & Advances', stat: '2400', icon: EnvelopeOpenIcon, change: '5.4%', changeType: 'increase' },
  { id: 3, name: 'Closing Balance ', stat: '18000', icon: UsersIcon, change: '3.2%', changeType: 'decrease' },
  { id: 4, name: 'Other Income', stat: '60000', icon: DocumentCurrencyRupeeIcon, change: '3.2%', changeType: 'decrease' },

]

const people = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
  // More people...
]

export default function CashLedger() {

  const [filteredData, setFilteredData] = useState([]);

  const [offileAccounts, setOffileAccounts] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [chargeSheet, setChargeSheet] = useState({ openingBalance: 0, closingBalance: 0, totalDebit: 0, totalCredit: 0 });

  const [selectedDate, setSelectedData] = useState(moment().format("YYYY-MM-DD"));

   const getBanks = async () => {
      try {
        let res = await getData(BANK_ACCOUNTS)
        setOffileAccounts(res.data.data.filter((item) => item.mode === 'offline'))
      } catch (e) {
        handleApiResponse(e)
      }
    }

  const getDayTransactions = async (date) => {
    try {
      let res = await getData(TRANSACTIONS + "/list?date=" + date + '&transactionMode=offline')
      let dummyList = res.data.data.map((item) => {
        let categoryStr = item.type?.split("_").join(" ") || 'Student Fees'
        return ({
          ...item,
          categoryName: capitalizeWords(categoryStr),
          particulars: getParticulars(item),
        })
      })
      setFilteredData(dummyList)
      setTransactionList(dummyList)
    } catch (e) {
      handleApiResponse(e)
    }
  }

    useEffect(() => {
      getOpeningBalance(filteredData, offileAccounts)
    }, [filteredData, offileAccounts])

  const getOpeningBalance = (records, offileAccounts) => {
    if (records.length > 0) {
      const latestMap = new Map();
      let totalCredit = 0;
      let totalDebit = 0;
      for (const record of records) {
        if (record.transactionType === 'credit') {
          totalCredit += record.amount * 1;
        } else {
          totalDebit += record.amount * 1;
        }
        const existing = latestMap.get(record._id);
        if (!existing || new Date(record.updatedAt) < new Date(existing.updatedAt)) {
          latestMap.set(record._id, record);
        }
      }

      let items = Array.from(latestMap.values())
      let openBalance = 0;
      for (let i = 0; i < items.length; i++) {
        openBalance += items[i].balance * 1;
        if (items[i].transactionType === 'credit') {
          openBalance -= items[i].amount * 1;
        } else {
          openBalance += items[i].amount * 1;
        }
      }
      const closeBalance = openBalance + (totalCredit - totalDebit)
      setChargeSheet({ openingBalance: openBalance, closingBalance: closeBalance, totalDebit: totalDebit, totalCredit: totalCredit })
    } else {
      let openBalance = offileAccounts.reduce((acc, bank) => acc + bank.currentBalance, 0);
      setChargeSheet({ openingBalance: openBalance, closingBalance: openBalance, totalDebit: 0, totalCredit: 0 })
    }
  };

  useEffect(() => {
    getDayTransactions(selectedDate)
    getBanks()
  }, [])

  const getParticulars = (item) => {
    let title = ''
    if (item.type === 'loan') {
      title = item.title
    } else if (item.type === 'repayment') {
      title = item.loanId?.title
    } else if (item.type === 'other_income') {
      title = item.reason||""
    } else if (item.type === 'expense') {
      title = item.category?.name
      if(!item.category?.name.includes("Other")){
        title = title + ", "+ item.subCategory?.name
      }
    } else if (item.fees.length > 0) {
      item.fees.forEach((fee) => (
        title += `${fee.fee?.name}: ${fee.amount}, `
      ))
      title = title.slice(0, -2);
    }
    return title
  }
  return (
    <>
      <div className='f-overview-cards'>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-4 shadow ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <dt>
                <div className="absolute rounded-md bg-green-50 p-3">
                  <item.icon aria-hidden="true" className="size-6 text-green-500" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                <p
                  className={classNames(
                    item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                    'ml-2 flex items-baseline text-sm font-semibold',
                  )}
                >
                  {item.changeType === 'increase' ? (
                    <ArrowUpIcon aria-hidden="true" className="size-5 shrink-0 self-center text-green-500" />
                  ) : (
                    <ArrowDownIcon aria-hidden="true" className="size-5 shrink-0 self-center text-red-500" />
                  )}

                  <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                  {item.change}
                </p>

              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="-mx-2 -my-2 mt-0 overflow-x-auto sm:-mx-6">
        <div className="inline-block min-w-full py-4 align-middle sm:px-6">
          <div className="relative">
            <div className="shadow ring-1 ring-black/5 sm:rounded-lg">{/* /Removed overflow-hidden cloass */}
              <div className='relative table-tool-bar z-30'>
                <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-3 sm:px-4">
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div 
                    className="relative rounded-md"
                    // className='right-action-btns-blk space-x-4'
                    >
                      <div className='flex items-center space-x-2'>
                        <Datepicker
                          value={{ startDate: selectedDate, endDate: selectedDate }}
                          onChange={(newValue) => {
                            let value = newValue.startDate ? moment(newValue.startDate).format('YYYY-MM-DD') : null
                            setSelectedData(value || moment().format('YYYY-MM-DD'))
                            getDayTransactions(value || moment().format('YYYY-MM-DD'))
                          }}
                          inputClassName="inline-block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm/6"
                          primaryColor={'purple'}
                          required={false}
                          maxDate={moment().toDate()}
                          asSingle={true}
                          displayFormat="DD/MM/YYYY"
                          useRange={false}
                          placeholder="Select Date"
                          popoverDirection='down'
                        />
                        
                      </div>


                    </div>
                  </div>
                </div>
              </div>

              <div className='table-container-main max-h-[56vh]'>

                {/* Table View */}
                <table className="table-auto min-w-full divide-y divide-gray-300">
                  <thead className="sticky top-0 bg-purple-100 z-20">
                    <tr>
                      <th scope="col" className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2">
                        <a href="#" className="group inline-flex">
                          Date
                        </a>
                      </th>
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                          Category
                        </a>
                      </th>
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                          Particulars
                        </a>
                      </th>
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                          Debit
                        </a>
                      </th>
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                          Credit
                          
                        </a>
                      </th>
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                          Closing Balance
                        
                        </a>
                      </th>

                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white z-1">
                    <tr className="border-t border-gray-200">
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> {moment(selectedDate).format('DD-MM-YYYY')}</th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> To Opening Cash Balance</th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> </th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> </th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> {chargeSheet.openingBalance}</th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> {chargeSheet.openingBalance}</th>
                    </tr>

                    {filteredData.length > 0 ? filteredData.map((item) => (
                      <tr key={item._id} >
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{moment(item.date).format('DD-MM-YYYY')}</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.categoryName}</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.particulars}</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.transactionType === 'debit' ? item.amount : '0'}</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.transactionType === 'credit' ? item.amount : '0'}</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.balance}</td>
                      </tr>
                    )) : <tr>
                      <td colSpan={6} className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 text-center">No Transactions Found</td>
                    </tr>}

                    <tr className="border-t border-gray-200">
                      <th className="bg-purple-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> </th>
                      <th className="bg-purple-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> Total</th>
                      <th className="bg-purple-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> </th>
                      <th className="bg-purple-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">{chargeSheet.totalDebit} </th>
                      <th className="bg-purple-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> {chargeSheet.totalCredit}</th>
                      <th className="bg-purple-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> {chargeSheet.totalCredit - chargeSheet.totalDebit}</th>
                    </tr>

                    <tr className="border-t border-gray-200">
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">{moment(selectedDate).format('DD-MM-YYYY')}</th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> By Closing Balance</th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> </th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> </th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> {chargeSheet.closingBalance}</th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> {chargeSheet.closingBalance}</th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}



