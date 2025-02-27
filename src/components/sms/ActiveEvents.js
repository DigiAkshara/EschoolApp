'use client'
import React, { useState } from 'react'
import { ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/20/solid";
import { Dialog } from "@headlessui/react";
import EventCreation from './EventCreation';
import TableComponent from '../../commonComponent/TableComponent';


function ActiveEvents() {
  const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const tableData = [
    {
      title: "Library Books",
      date: "2024-02-05",
      class: "Class 1",
      section: "A",
      time: "10:00 AM",
      participants: "participants 1",
    },
    {
      title: "Library Books",
      date: "2024-02-04",
      class: "Class 2",
      section: "B",  
      time: "11:00 AM",    
      participants: "participants 2",
    },
    {
      title: "Donation",
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
    { title: "Exam Title", key: "title" },
    { title: "Class", key: "class" },
    { title: 'Section', key: 'section' },
    { title: 'Event Date', key: 'date' },
    { title: 'Event Time', key: 'time' },
    { title: 'Participants', key: 'participants' },
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
            Add New Event
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
        <EventCreation onClose={handleClose}  />
      </Dialog>
      </div>

    </>
  )
}

export default ActiveEvents



