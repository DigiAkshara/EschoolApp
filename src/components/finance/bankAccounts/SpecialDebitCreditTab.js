'use client'
import { Dialog } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import React, { useState } from 'react';
import TableComponent from '../../../commonComponent/TableComponent';
import SpecialCreditsCreation from './SpecialCreditsCreation';


function SpecialDebitCreditTab() {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const tableData = [
    {
      date: "2024-02-05",
      type: "Credit",
      title: "Monthly Fee",
      reason: "Student fee payment",
      amount: "₹5,000",
      proof: "receipt_123.pdf",
    },
    {
      date: "2024-02-04",
      type: "Debit",
      title: "Library Books",
      reason: "Purchased new books",
      amount: "₹2,000",
      proof: "invoice_456.pdf",
    },
    {
      date: "2024-02-03",
      type: "Credit",
      title: "Donation",
      reason: "Received from Alumni",
      amount: "₹10,000",
      proof: "receipt_789.pdf",
    },
  ];

  const tableDataWithActions = tableData.map((item) => ({
    ...item,
    actions: [
      { label: "Edit", actionHandler: () => onHandleEdit(item) },
      { label: "Delete", actionHandler: () => onHandleDelete(item) },
    ],
  }));
  const [filteredData, setFilteredData] = useState(tableDataWithActions);


  const columns = [
    { title: "Date", key: "date" },
    { title: "Type", key: "type" },
    { title: 'Title', key: 'title' },
    { title: 'Reason', key: 'reason' },
    { title: 'Amount', key: 'amount' },
    { title: 'Proof', key: 'proof' },
    { title: 'Actions', key: 'actions' },
  ];

  const handleClose = () => setOpen(false);

  const onHandleEdit = (row) => {
    console.log("Editing:", row);
  };

  const onHandleDelete = (row) => {
    console.log("Deleting:", row);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


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
            Add Special Credits / Debits
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
          <SpecialCreditsCreation onClose={handleClose} />
        </Dialog>
      </div>

    </>
  )
}

export default SpecialDebitCreditTab



