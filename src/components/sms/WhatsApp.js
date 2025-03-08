'use client'
import { Dialog } from "@headlessui/react"
import { PlusIcon } from '@heroicons/react/20/solid'
import { DocumentCurrencyRupeeIcon, EnvelopeOpenIcon, UsersIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import TableComponent from '../../commonComponent/TableComponent'
import SmsSending from './SmsSending'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const stats = [
  { id: 1, name: 'Total Messages Available ', stat: '1,3000', icon: DocumentCurrencyRupeeIcon, },
  { id: 2, name: 'Total Used', stat: '2400', icon: EnvelopeOpenIcon, },
  { id: 3, name: 'Messages Sent Today', stat: '25', icon: UsersIcon, },
  { id: 4, name: 'SMS at Queue', stat: '10', icon: DocumentCurrencyRupeeIcon, },

]


export default function WhatsApp() {

  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const tableData = [
    {
      title: "Fee Reminder",
      date: "2024-02-05",
      class: "Class 1",
      section: "A",
      time: "10:00 AM",
      participants: "participants 1",
    },
    {
      title: "Exam Notification",
      date: "2024-02-04",
      class: "Class 2",
      section: "B",
      time: "11:00 AM",
      participants: "participants 2",
    },
    {
      title: "Parents Meeting",
      date: "2024-02-03",
      class: "Class 3",
      section: "C",
      time: "12:00 PM",
      participants: "participants 3",
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
    { title: "Class", key: "class" },
    { title: 'Section', key: 'section' },
    { title: 'Date & Time', key: 'date' },
    { title: 'Participants', key: 'participants' },
    { title: 'Discription', key: 'details' },
    { title: 'Status', key: 'status' },
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


              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-4 flex justify-between">
        <div className="text-lg text-gray-900 font-medium">WhatsApp</div>

        <div className="right-btns-blk space-x-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Send new SMS
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
          <SmsSending onClose={handleClose} />
        </Dialog>
      </div>
    </>
  )
}



