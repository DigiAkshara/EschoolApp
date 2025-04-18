'use client'
import { Dialog } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import moment from "moment";
import React, { useEffect, useState } from 'react';
import { getData } from "../../../app/api";
import { TRANSACTIONS } from "../../../app/url";
import { capitalizeWords, handleApiResponse, handleDownloadPDF } from "../../../commonComponent/CommonFunctions";
import TableComponent from '../../../commonComponent/TableComponent';
import SpecialCreditsCreation from './SpecialCreditsCreation';
import FilterComponent from "../../../commonComponent/FilterComponent";
import { useSelector } from "react-redux";


function DebitCreditTab() {
  const { branchData } = useSelector((state) => state.appConfig)
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [filteredData, setFilteredData] = useState([]);
  const [transactionList, setTransactionList] = useState([]);


  const columns = [
    { title: "Date", key: "date" },
    { title: "Type", key: "transactionType" },
    { title: "Mode", key: "transactionMode" },
    { title: "Category", key: "type" },
    { title: 'Sub Category', key: 'subCategory' },
    { title: 'Reason', key: 'reason' },
    { title: 'Amount', key: 'amount' },
    { title: 'Proof', key: 'proof' },
  ];

  const filterForm = {
    date: "",
    transactionType: '',
    transactionMode: ''
  }

  const filters = {
    transactionType: { options: [{ value: "debit", label: "Debit" }, { value: "credit", label: "Credit" }] },
    transactionMode: { options: [{ value: "offline", label: "Offline" }, { value: "online", label: "Online" }] }
  }

  const handleClose = () => setOpen(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  const handleSearch = (term) => {
    const filtered = transactionList.filter((item) =>
      columns.some((col) =>
        String(item[col.key]).toLowerCase().includes(term.toLowerCase()),
      ),
    )
    setCurrentPage(1)
    setFilteredData(filtered)
  }

  const handleFilter = (values) => {
    let filtered = transactionList
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((rec) => {
          return rec[key].toLowerCase().includes(value.toLowerCase())
        }
        )
      }
    })
    setCurrentPage(1)
    setFilteredData(filtered)
  }
  const handleReset = (updatedValues) => {
    setFilteredData(transactionList)
    updatedValues('transactionType', '')
    updatedValues('transactionMode', '')
    updatedValues('date', null)
  }

  const downloadList = () => {
    handleDownloadPDF(filteredData, "Transaction_details", [
      { label: "Date", key: "date" },
      { label: "Type", key: "transactionType" },
      { label: "Mode", key: "transactionMode" },
      { label: "Category", key: "type" },
      { label: 'Sub Category', key: 'subCategory' },
      { label: 'Reason', key: 'reason' },
      { label: 'Amount', key: 'amount' },
    ], "Transaction Details", branchData, undefined, "landscape");
  };

  const getCategoryTitle = (item) => {
    let title = ''
    if (item.type === 'loan') {
      title = item.title
    } else if (item.type === 'repayment') {
      title = item.loanId?.title
    } else if (item.type === 'other_income') {
      title = ''
    } else if (item.type === 'expense') {
      title = item.category?.name
    } else if (item.fees.length > 0) {
      item.fees.forEach((fee) => (
        title += `${fee.fee?.name}: ${fee.amount}, `
      ))
      title = title.slice(0, -2);
    }
    return title
  }
  const getReason = (item) => {
    let title = item.reason || ''
    if (item.type === 'expense') {
      title = item.category?.name.includes('Other') ? item.reason : item.subCategory?.name
    }
    return title
  }

  const getAllTransactions = async () => {
    try {
      let res = await getData(TRANSACTIONS + '/list')
      let dummyList = res.data.data.map((item) => {
        let titleStr = (item.type === 'loan') ? item.title : item.type === 'repayment' ? item.loanId?.title : ""
        if (item.fees.length > 0) {
          item.fees.forEach((fee) => (
            titleStr += `${fee.fee?.name}: ${fee.amount}, `
          ))
          titleStr = titleStr.slice(0, -2);
        }
        return ({
          ...item,
          type: item.studentFee ? 'Student Fees' : item.type?.split('_').join(" "),
          subCategory: getCategoryTitle(item),
          date: item.date,
          reason: getReason(item),
          proof: item.proof ? (
            <a href={item.proof.Location} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a>) : '-'
        })
      })
      setTransactionList(dummyList);
      setFilteredData(dummyList);
    } catch (error) {
      handleApiResponse(error);
    }
  }

  useEffect(() => {
    getAllTransactions();
  }, [])

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );


  return (
    <>
      <div className="mt-4 flex justify-between">
        {/* active tab with count block */}
        <div className="sm:hidden"></div>
        <div className="hidden sm:block"></div>

        <div className="right-btns-blk space-x-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Credits / Debits
          </button>
        </div>
      </div>
      <div className="-mx-2 -my-2 mt-0 sm:-mx-6">
        <div className="inline-block min-w-full py-4 align-middle sm:px-6">
          <div className="relative">
            <div className="shadow ring-1 ring-black/5 sm:rounded-lg">
              <FilterComponent
                onSearch={handleSearch}
                filters={filters}
                filterForm={filterForm}
                handleFilter={handleFilter}
                handleReset={handleReset}
                downloadList={downloadList}
              />
              <TableComponent
                checkColumn={false}
                columns={columns}
                data={paginatedData}
                pagination={{
                  currentPage,
                  totalCount: filteredData.length,
                  onPageChange: handlePageChange,
                }}
              />

            </div>
          </div>
        </div>
        {/* Student Onboarding Modal */}
        <Dialog open={open} onClose={handleClose} className="relative z-50">
          <div className="fixed inset-0" />
          <SpecialCreditsCreation onClose={handleClose} refreshData={getAllTransactions} />
        </Dialog>
      </div>

    </>
  )
}

export default DebitCreditTab



