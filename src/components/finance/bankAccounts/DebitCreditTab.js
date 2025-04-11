'use client'
import { Dialog } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import moment from "moment";
import React, { useEffect, useState } from 'react';
import { getData } from "../../../app/api";
import { TRANSACTIONS } from "../../../app/url";
import { capitalizeWords, handleApiResponse } from "../../../commonComponent/CommonFunctions";
import TableComponent from '../../../commonComponent/TableComponent';
import SpecialCreditsCreation from './SpecialCreditsCreation';


function DebitCreditTab() {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [filteredData, setFilteredData] = useState([]);
  const [transactionList, setTransactionList] = useState([]);


  const columns = [
    { title: "Date", key: "date" },
    { title: "Type", key: "transactionType" },
    { title: 'Title', key: 'title' },
    { title: 'Reason', key: 'reason' },
    { title: 'Amount', key: 'amount' },
    { title: 'Proof', key: 'proof' },
    // { title: 'Actions', key: 'actions' },
  ];

  const handleClose = () => setOpen(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getAllTransactions = async () => {
    try {
      let res = await getData(TRANSACTIONS + '/list')
      let dummyList = res.data.data.map((item) => {
        return ({
          ...item,
          transactionType:capitalizeWords(item.transactionType),
          date:item.date,
          title: item.category ? item.category.name : item.fees.map((fee, index) => (
            <span key={index}>
              {capitalizeWords(fee.fee.name)} : {fee.amount}
              {index + 1 === item.fees.length ? "." : ", "}
            </span>
          )),
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

              <TableComponent
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



