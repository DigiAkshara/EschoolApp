import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import {
  ArrowsUpDownIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'
import moment from 'moment'
import React, { useState } from 'react'
import PaginationComponent from './PaginationComponent'
const TableComponent = ({ columns, data, pagination, showModal, modalColumn }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const handleSort = ({ key }) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })

    setSortConfig({ key, direction })
    return sortedData
  }
  const sortedData = sortConfig.key ? handleSort(sortConfig.key) : data
  return (
    <>
      {/* Table */}
      <div className="table-container-main overflow-y-auto max-h-[56vh]">
        <table className="table-auto min-w-full divide-y divide-gray-300">
          <thead className="sticky top-0 bg-purple-100 z-20">
            <tr>
              <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                <input
                  type="checkbox"
                  className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                />
              </th>
              {columns.map((col, index) => (
                <th
                  scope="col"
                  className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  key={index}
                >
                  <a
                    className="group inline-flex"
                    onClick={() => handleSort(col)}
                  >
                    {col.title}
                    <span
                      className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200"
                      onClick={() => handleSort(col)}
                    >
                      <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
                    </span>
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white z-1">
            {sortedData.map((record, indx) => (
              <tr key={indx} className="bg-gray-50">
                <td className="relative px-7 sm:w-12 sm:px-6">
                  <div className="absolute inset-y-0 left-0 w-0.5 bg-purple-600" />
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                  />
                </td>
                {columns.map((col, ind) =>
                  col.key === 'name' ? (
                    <td
                      className="whitespace-nowrap py-2 pl-2 pr-3 text-sm sm:pl-0"
                      key={ind}
                      onClick={() => showModal && showModal(record)}
                    >
                      <a
                        href="#"
                        className="text-purple-600 hover:text-purple-900"
                      >
                        <div className="flex items-center">
                          {record.pic ?
                            <div className="size-9 shrink-0">
                              <img
                                alt=""
                                src={record.pic}
                                className="size-9 rounded-full"
                              />
                            </div> :
                            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                              <span className="font-medium text-gray-600 dark:text-gray-300">{record.name.charAt(0)}</span>
                            </div>}


                          <div className="ml-4">
                            <div className="font-medium text-gray-900 text-purple-600">
                              {record.name}
                            </div>
                            <div className="mt-1 text-gray-500">
                              {record.image}
                            </div>
                          </div>
                        </div>
                      </a>
                    </td>
                  ) : col.key === 'actions' ? (
                    <td
                      className="whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-3"
                      key={ind}
                    >
                      <Menu as="div" className="relative inline-block text-left">
                        <div>
                          <MenuButton className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                            <span className="sr-only">Open options</span>
                            <EllipsisHorizontalIcon
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
                            {record.actions.map((action, index) => (
                              <a
                                key={index}
                                onClick={() => action.actionHandler(record._id)}
                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                              >
                                {action.label}
                              </a>
                            ))}
                          </div>
                        </MenuItems>
                      </Menu>
                    </td>
                  ) : (
                    <td
                      className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                      key={ind}
                    >
                      {col.key === 'date'
                        ? moment(record[col.key]).format('DD-MM-YYYY')
                        : modalColumn?.includes(col.key) ? <a onClick={() => showModal && showModal(record)}>{record[col.key]}</a> : record[col.key]}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {pagination.totalCount > 10 && (
        <PaginationComponent
          totalCount={pagination.totalCount}
          currentPage={pagination.currentPage}
          onPageChange={pagination.onPageChange}
        />
      )}
    </>
  )
}

export default TableComponent
