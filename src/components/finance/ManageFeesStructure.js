'use client'
import {Dialog, Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/20/solid'
import {
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'
import React, {useEffect, useRef, useState} from 'react'
import FeeCreation from './FeeCreation'
import { getData } from '../../app/api'
import { FEES } from '../../app/url'
import TableComponent from '../../commonComponent/TableComponent'
import { formatDate } from '../../commonComponent/CommonFunctions'


export default function ManageFeesStructure() {
  const [open, setOpen] = useState(false)
  const checkbox = useRef()
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedPeople, setSelectedPeople] = useState([])
  const [fees, setFees] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  const columns = [
    {title: 'Academic Year', key: 'academicYear'},
    {title: 'Fee Group', key: 'feeGroup'},
    {title: 'Fee Name', key: 'feeName'},
    {title: 'Class', key: 'class'},
    {title: 'Applicable To', key: 'applicableTo'},
    {title: 'Fee Amount', key: 'feeAmount'},
    {title: 'Creation Date', key: 'creationDate'},
    {title: 'Actions', key: 'actions'},
  ]

  useEffect(() => {
    getFees()
  }, [])

  const getFees = async () => {
    const res = await getData(FEES)
    const feeResponse = res.data.data
    const data = feeResponse.map((item) => {
      return {
        _id: item._id,
        academicYear: item.academicYear?.year,
        feeGroup: item.feeGroup?.name,
        feeName: item.name,
        class: item.class?.name || '-',
        applicableTo: item.isGlobal ? 'All' : 'Class Wise',
        feeAmount: item.amount,
        creationDate: formatDate(item.createdAt),
        actions: [
          {label: 'Edit', actionHandler: onHandleEdit},
          {label: 'Delete', actionHandler: onDelete},
        ]
      }
    })
    console.log(feeResponse)
    setFees(feeResponse)
    setFilteredData(data)
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  const handleAction = {
    edit: (item) => console.log('Edit:', item),
    delete: (item) => console.log('Delete:', item),
  }

  const onHandleEdit = async () => {
    console.log('edit')
  }
  
    const onDelete = () => {
      console.log('delete')
    }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleClose = () => setOpen(false)

  return (
    <div className="flow-root">
      {/* Primary Tabs */}
      <div></div>

      <div className="mt-4 flex justify-between">
        <div className="text-lg text-gray-900 font-medium">Fee Structure</div>

        <div className="right-btns-blk space-x-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Fee Structure
          </button>
        </div>
      </div>

      <div className="-mx-2 -my-2 mt-0 overflow-x-auto sm:-mx-6">
        <div className="inline-block min-w-full py-4 align-middle sm:px-6">
          <div className="relative">
            {selectedPeople.length > 0 && (
              <div className="absolute left-20 top-0 flex h-12 items-center space-x-3 bg-white sm:left-72">
                <button
                  type="button"
                  className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                >
                  Delete
                </button>
              </div>
            )}
            <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              <div className="relative table-tool-bar z-30">
                <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-3 sm:px-4">
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <div className="relative rounded-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon
                            aria-hidden="true"
                            className="size-4 text-gray-400"
                          />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Search"
                          className="block w-full rounded-md border-0 py-1 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 text-sm"
                        />
                      </div>
                    </div>

                    <div className="right-action-btns-blk space-x-4">
                      <button
                        type="button"
                        className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        <ArrowDownTrayIcon
                          aria-hidden="true"
                          className="size-5"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

                {/* Table View */}
                <TableComponent
                  columns={columns}
                  data={paginatedData}
                  onAction={[
                    {label: 'Edit', handler: handleAction.edit},
                    {label: 'Delete', handler: handleAction.delete},
                  ]}
                  pagination={{
                    currentPage,
                    totalCount: filteredData.length,
                    onPageChange: handlePageChange,
                  }}
                />
             
            </div>
          </div>
        </div>
      </div>

      {/* Student Onboarding Modal */}

      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <div className="fixed inset-0" />
        <FeeCreation onClose={handleClose} />
      </Dialog>
    </div>
  )
}
