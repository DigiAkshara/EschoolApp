'use client'
import { Dialog } from "@headlessui/react"
import { PlusIcon } from '@heroicons/react/20/solid'
import { DocumentCurrencyRupeeIcon, EnvelopeOpenIcon, UsersIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import TableComponent from '../../commonComponent/TableComponent'
import TemplateCreation from './TemplateCreation'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const stats = [
  { id: 1, name: 'Total Cash Received', stat: '1,897', icon: DocumentCurrencyRupeeIcon, change: '122', changeType: 'increase' },
  { id: 2, name: 'Expenses & Advances', stat: '2400', icon: EnvelopeOpenIcon, change: '5.4%', changeType: 'increase' },
  { id: 3, name: 'Closing Balance ', stat: '18000', icon: UsersIcon, change: '3.2%', changeType: 'decrease' },
  { id: 4, name: 'Other Income', stat: '60000', icon: DocumentCurrencyRupeeIcon, change: '3.2%', changeType: 'decrease' },

]


export default function Templates() {

  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const tableData = [
    {
      title: "Library Books",
      date: "2024-02-05",
      type: "Event",
      discription: "SMS description here",
      status: "Active",
      details: "",
    },
    {
      title: "Library Books",
      date: "2024-02-04",
      type: "SMS",
      discription: "SMS description here",
      status: "Active",
      details: "",
    },
    {
      title: "Donation",
      date: "2024-02-03",
      type: "SMS",
      discription: "SMS description here",
      status: "Inactive",
      details: "",
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
    { title: "Template Title", key: "title" },
    { title: "Type", key: "type" },
    { title: 'Date', key: 'date' },
    { title: 'Discription', key: 'discription' },
    { title: 'Status', key: 'status' },
    { title: 'Details', key: 'details' },
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
        <div className="text-lg text-gray-900 font-medium">Templates</div>

        <div className="right-btns-blk space-x-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Templates
          </button>
        </div>
      </div>

      <div className="-mx-2 -my-2 mt-0 overflow-x-auto sm:-mx-6">
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
        <Dialog open={open} onClose={handleClose} className="relative z-50">
          <div className="fixed inset-0" />
          <TemplateCreation onClose={handleClose} />
        </Dialog>
      </div>
    </>
  )
}



