"use client";
import {
  Dialog,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from "@heroicons/react/20/solid";
import {
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
  FunnelIcon
} from "@heroicons/react/24/outline";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteData, getData } from "../../../app/api";
import { setBankAccounts } from "../../../app/reducers/feeSlice";
import { BANK_ACCOUNTS, TRANSACTIONS } from "../../../app/url";
import { capitalizeWords, handleApiResponse, handleDownloadPDF } from "../../../commonComponent/CommonFunctions";
import ConfirmationModal from "../../../commonComponent/ConfirmationModal";
import BankCreation from "./BankCreation";
import CustomDate from "../../../commonComponent/CustomDate";
import Datepicker from "react-tailwindcss-datepicker";
import FilterComponent from "../../../commonComponent/FilterComponent";
import CustomSelect from "../../../commonComponent/CustomSelect";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];


export default function BankBookTab() {
  const dispatch = useDispatch();

  const { branchData } = useSelector((state) => state.appConfig)
  const { bankAccounts } = useSelector((state) => state.fees);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [showAddBank, setShowAddBank] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [chargeSheet, setChargeSheet] = useState({ openingBalance: 0, closingBalance: 0, totalDebit: 0, totalCredit: 0 });

  const [selectedDate, setSelectedData] = useState(moment().format("YYYY-MM-DD"));
  const [selectedAccount, setSelectedAccount] = useState("");
  const handleClose = () => setShowAddBank(false);

  const deleteBank = async () => {
    try {
      let res = await deleteData(BANK_ACCOUNTS + '/' + deleteId)
      handleApiResponse(res.data.message, 'success')
      getBanks()
      setDeleteConfirm(false)
      setDeleteId(null)
    } catch (e) {
      handleApiResponse(e)
    }
  }

  const getBanks = async () => {
    try {
      let res = await getData(BANK_ACCOUNTS)
      dispatch(setBankAccounts(res.data.data.filter((item) => item.mode === 'online')))
    } catch (e) {
      handleApiResponse(e)
    }
  }

  const columns = [
    { title: "Date", key: "date" },
    { title: "Category", key: "categoryName" },
    { title: 'Particulars', key: 'particulars' },
    { title: 'Bank', key: 'bank' },
    { title: 'Transaction Type', key: 'transactionType' },
  ];

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

  const getDayTransactions = async (date) => {
    try {
      let res = await getData(TRANSACTIONS + "/list?date=" + date + '&transactionMode=online')
      let dummyList = res.data.data.map((item) => {
        let categoryStr = item.type?.split('_').join(" ") || 'Student Fees'
        return ({
          ...item,
          categoryName: capitalizeWords(categoryStr),
          particulars: getParticulars(item),
          bank: item.transactionBank?.name
        })
      })
      setFilteredData(dummyList)
      setTransactionList(dummyList)
    } catch (e) {
      handleApiResponse(e)
    }
  }

  const getOpeningBalance = (records, banks) => {
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
        const existing = latestMap.get(record.transactionBank._id);
        if (!existing || new Date(record.updatedAt) < new Date(existing.updatedAt)) {
          latestMap.set(record.transactionBank._id, record);
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
      let bankAccounts = banks
      if (selectedAccount) {
        bankAccounts = banks.filter((item) => item._id === selectedAccount)
      }
      let openBalance = bankAccounts.reduce((acc, bank) => acc + bank.currentBalance, 0);
      setChargeSheet({ openingBalance: openBalance, closingBalance: openBalance, totalDebit: 0, totalCredit: 0 })
    }
  };


  useEffect(() => {
    getBanks()
    getDayTransactions(selectedDate)
  }, [])

  useEffect(() => {
    getOpeningBalance(filteredData, bankAccounts)
  }, [filteredData, bankAccounts])

  const handleSearch = (term) => {
    const filtered = transactionList.filter((item) =>
      columns.some((col) =>
        String(item[col.key]).toLowerCase().includes(term.toLowerCase()),
      ),
    )
    setFilteredData(filtered)
  }

  const handleFilter = (e) => {
    let filtered = transactionList
    let value = e.target.value
    if (value) {
      filtered = filtered.filter((rec) => (rec.transactionBank?._id === value))
    }
    setSelectedAccount(value)
    setFilteredData(filtered)
  }


  return (
    <>
      <div className="mt-4 flex justify-between">
        {/* active tab with count block */}
        <div className="sm:hidden"></div>
        <div className="hidden sm:block"></div>

        <div className="right-btns-blk space-x-4">
          <button
            type="button"
            onClick={() => setShowAddBank(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Bank
          </button>
        </div>
      </div>
      {/* Finaance overview cards */}
      <div className="f-overview-cards">
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bankAccounts.map((item) => (
            <div
              key={item.id}
              className="z-20 relative rounded-lg bg-white px-4 pb-4 pt-4 shadow ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <div className="absolute right-4 top-4">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <MenuButton className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                      <span className="sr-only">Open options</span>
                      <EllipsisVerticalIcon
                        aria-hidden="true"
                        className="size-5"
                      />
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <div className="py-1">
                      <Menu.Item>
                        {({ close }) => (
                          <button
                            onClick={() => {
                              setDeleteId(item._id)
                              setDeleteConfirm(true)
                              close()
                            }}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </MenuItems>
                </Menu>
              </div>
              <dt>
                <div className="absolute rounded-md bg-green-50">
                  <img src="/bank.png" className="h-12 w-12 object-contain" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-400">
                  Balance: {item.currentBalance || 'N/A'}
                </p>
                <p className="ml-16 truncate text-sm font-medium text-400">
                  A/C No: {`xxxxxx${item.accountNumber}`}
                </p>
                {item.accountType &&
                  <p className="ml-16 truncate text-sm font-medium text-gray-400">
                    {item.accountType}
                  </p>}
              </dt>
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

                    {/* <div className="relative rounded-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon aria-hidden="true" className="size-4 text-gray-400" />
                        </div>
                        <input
                          id="search"
                          name="search"
                          placeholder="Search"
                          onChange={(e) => handleSearch(e.target.value)}
                          className="block w-full rounded-md border-0 py-1 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 text-sm"
                        />
                      </div> */}

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
                            setSelectedAccount("")
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
                          popoverDirection="down"
                        />
                        <select
                          label="Select Account"
                          name="selectedAccount"
                          value={selectedAccount}
                          onChange={handleFilter}
                          className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                        >
                          <option value="">Select Account</option>
                          {bankAccounts.map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.name} - {item.accountNumber}
                            </option>
                          ))}
                        </select>
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
                          Bank
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
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> </th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> {chargeSheet.openingBalance}</th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> {chargeSheet.openingBalance}</th>
                    </tr>

                    {filteredData.length > 0 ? filteredData.map((item) => {
                      return (
                        <tr key={item._id}>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{moment(item.date).format('DD-MM-YYYY')}</td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.categoryName}</td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.particulars}</td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.transactionBank?.name}</td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.transactionType === 'debit' ? item.amount : '0'}</td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.transactionType === 'credit' ? item.amount : '0'}</td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.balance}</td>
                        </tr>
                      )
                    }) : <tr>
                      <td colSpan={7} className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 text-center">No Transactions Found</td>
                    </tr>}


                    <tr className="border-t border-gray-200">
                      <th className="bg-purple-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> </th>
                      <th className="bg-purple-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> Total</th>
                      <th className="bg-purple-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> </th>
                      <th className="bg-purple-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> </th>
                      <th className="bg-purple-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">{chargeSheet.totalDebit} </th>
                      <th className="bg-purple-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> {chargeSheet.totalCredit}</th>
                      <th className="bg-purple-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> {chargeSheet.totalCredit - chargeSheet.totalDebit}</th>
                    </tr>

                    <tr className="border-t border-gray-200">
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> {moment(selectedDate).format('DD-MM-YYYY')}</th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> By Closing Balance</th>
                      <th className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"> </th>
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
      <Dialog
        open={showAddBank}
        onClose={handleClose}
        className="relative z-50"
      >
        <div className="fixed inset-0" />
        <BankCreation onClose={handleClose} refreshData={getBanks} />
      </Dialog>

      <ConfirmationModal
        showModal={deleteConfirm}
        onYes={deleteBank}
        onCancel={() => { setDeleteConfirm(false); setDeleteId(null) }}
      />
    </>
  );
}