import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ArrowsUpDownIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import moment from 'moment';
import PaginationComponent from './PaginationComponent';
import FilterComponent from './FilterComponent';

const TableComponent = ({ labels, studentList }) => {

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filtered data based on search
  const filteredData = studentList.filter((row) =>
    labels.some((col) =>
      String(row[col.key])
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  );
  
  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <>
      {/* Search and Page Size Controls */}
      <FilterComponent setSearch={setSearch} />

      {/* Table */}
      <table className="table-auto min-w-full divide-y divide-gray-300">
        <thead className="sticky top-0 bg-purple-100 z-20">
          <tr>
            <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
              <input
                type="checkbox"
                className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
              />
            </th>
            {labels.map((label, index) => (
              <th
                scope="col"
                className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                key={index}
              >
                <a href="#" className="group inline-flex">
                {label.name}
                  <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                    <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
                  </span>
                </a>
              </th>))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white z-1">
          {paginatedData && paginatedData.length > 0 && paginatedData.map((student, indx) => (
            <tr
              key={indx}
              className= "bg-gray-50"
            >
            <td className="relative px-7 sm:w-12 sm:px-6">
               
                  <div className="absolute inset-y-0 left-0 w-0.5 bg-purple-600" />
       
                <input
                  type="checkbox"
                  className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                />
              </td>
              {labels.map(( label, index) => (
                label.key  === "name" ? (
                  <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm sm:pl-0">
                <a href="#" className="text-purple-600 hover:text-purple-900">
                  <div className="flex items-center">
                    <div className="size-9 shrink-0">
                      <img
                        alt=""
                        src={student.pic}
                        className="size-9 rounded-full"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900 text-purple-600">
                        {student.name}
                      </div>
                      <div className="mt-1 text-gray-500">{student.image}</div>
                    </div>
                  </div>
                </a>
              </td>
                ) : label.key === "actions" ? (
                  <td className="whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-3">
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
                      {student.actions.map((action) => (
                      
                      <MenuItem>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                        >
                          {action}
                        </a>
                      </MenuItem> ))}
                      </div>
                  </MenuItems>
                </Menu> </td>
                ) : 
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                {label.key === 'date' ? moment(student[label.key]).format('DD-MM-YYYY') : student[label.key]}
              </td>))}             
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 9 && <PaginationComponent totalPages={totalPages} currentPage={currentPage} pageSize={pageSize} setCurrentPage={setCurrentPage}  /> }
     
    </>
  );
};

export default TableComponent;
