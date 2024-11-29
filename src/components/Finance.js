
'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { PlusIcon } from '@heroicons/react/20/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { ArrowUpTrayIcon } from '@heroicons/react/20/solid'
import { ListBulletIcon } from '@heroicons/react/20/solid'
import { Squares2X2Icon } from '@heroicons/react/24/outline'
import { FunnelIcon } from '@heroicons/react/24/outline'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { PhoneIcon } from '@heroicons/react/24/outline'


import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { LinkIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import { CheckIcon } from '@heroicons/react/20/solid'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline'
import { ArrowLongUpIcon } from '@heroicons/react/24/outline'
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline'
import { PencilIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/outline'
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'
import { ArrowUpRightIcon } from '@heroicons/react/24/outline'


import Datepicker from "react-tailwindcss-datepicker";
import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend, Label, legendType } from 'recharts';
import Select from "react-tailwindcss-select";
import FeeCreation from './FeeCreation'

const feeduration = [
    { value: "One Time", label: "One Time" },
    { value: "2 Installments", label: "2 Installments" },
    { value: "3 Installments", label: "3 Installments" }
];


const people = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
  // More people...
]

const people2 = [
  {
    name: 'Janet Baker',
    title: '12345678 | 1A',
    email: 'janecooper@example.com',
    telephone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  // More people...
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const tabs = [
  { name: 'Overview', href: '#', current: false },
  { name: 'Fee Collections', href: '#', current: false },
  { name: 'Staff Salaries', href: '#', current: false },
  { name: 'Expenses', href: '#', current: false },
  { name: 'Fee Structures', href: '#', current: true },
  { name: 'School Bank Accounts', href: '#', current: false },
  { name: 'Discounts', href: '#', current: false },
  { name: 'Payrolls', href: '#', current: false },
]





export default function Example() {
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)

  const checkbox = useRef()
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedPeople, setSelectedPeople] = useState([])

  const notificationMethods = [
    { id: 'All', title: 'All' },
    { id: 'Old Students', title: 'Old Students' },
    { id: 'New Students', title: 'New Students' },
  ]

  const [value, setValue] = useState({
 
});

  useLayoutEffect(() => {
    const isIndeterminate = selectedPeople.length > 0 && selectedPeople.length < people.length
    setChecked(selectedPeople.length === people.length)
    setIndeterminate(isIndeterminate)
    checkbox.current.indeterminate = isIndeterminate
  }, [selectedPeople])

  function toggleAll() {
    setSelectedPeople(checked || indeterminate ? [] : people)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }

  const [animal, setAnimal] = useState(null);

  const handleChange = value => {
      console.log("value:", value);
      setAnimal(value);
  };

  return (
    
    
      
      <div className="flow-root">
        {/* Primary Tabs */}
        <div>
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
              <select
                id="tabs"
                name="tabs"
                defaultValue={tabs.find((tab) => tab.current).name}
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
              >
                {tabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav aria-label="Tabs" className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <a
                      key={tab.name}
                      href={tab.href}
                      aria-current={tab.current ? 'page' : undefined}
                      className={classNames(
                        tab.current
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium',
                      )}
                    >
                      {tab.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
        </div>
         
         <div className='mt-4 flex justify-between'>
           <div className='text-lg text-gray-900 font-medium'>Fee Structure</div>   
          
           <div className='right-btns-blk space-x-4'>
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
              <div className='relative table-tool-bar z-30'>
              <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-3 sm:px-4">
                
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                 
                    <div>
                      <div className="relative rounded-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon aria-hidden="true" className="size-4 text-gray-400" />
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
                  
                  <div className='right-action-btns-blk space-x-4'>
                    <button
                      type="button"
                      className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <ArrowDownTrayIcon aria-hidden="true" className="size-5" />
                    </button>
                   

                  


                    
                  </div>
                </div>
              </div>  
              </div> 

              <div className='table-container-main overflow-y-auto max-h-[56vh]'>
                
                {/* Table View */}
                <table className="table-auto min-w-full divide-y divide-gray-300">
                  <thead className="sticky top-0 bg-purple-100 z-20">
                    <tr>
                      <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                          ref={checkbox}
                          checked={checked}
                          onChange={toggleAll}
                        />
                      </th>
                      <th scope="col" className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2">
                        <a href="#" className="group inline-flex">
                        Academic Year
                          <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
                          </span>
                        </a>
                      </th>
                    
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                        Fee Title
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
                          </span>
                          </a>
                      </th>
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                        Duration
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
                          </span>
                          </a>
                      </th>
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                        Class Wise Fees
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
                          </span>
                          </a>
                      </th>
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                        Apply To
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
                          </span>
                          </a>
                      </th>
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                        Total Fees
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
                          </span>
                          </a>
                      </th>
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                        Creation Date
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
                          </span>
                          </a>
                      </th>
                      
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                        Actions

                          </a>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white z-1">
                    {people.map((person) => (
                      <tr key={person.email} className={selectedPeople.includes(person) ? 'bg-gray-50' : undefined}>
                        <td className="relative px-7 sm:w-12 sm:px-6" >
                          {selectedPeople.includes(person) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-purple-600" />
                          )}
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                            value={person.email}
                            checked={selectedPeople.includes(person)}
                            onChange={(e) =>
                              setSelectedPeople(
                                e.target.checked
                                  ? [...selectedPeople, person]
                                  : selectedPeople.filter((p) => p !== person),
                              )
                            }
                          />
                        </td>
                       
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">2024 - 2025</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">Computer Fee</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">One Time </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">View Class Wise Fees</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">All</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">2700</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">21-11-2024</td>
                        

                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-3">
                          <Menu as="div" className="relative inline-block text-left">
                            <div>
                              <MenuButton className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                                <span className="sr-only">Open options</span>
                                <EllipsisHorizontalIcon aria-hidden="true" className="size-5" />
                              </MenuButton>
                            </div>

                            <MenuItems
                              transition
                              className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                            >
                              <div className="py-1">
                                <MenuItem>
                                  <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                  >
                                    Edit
                                  </a>
                                </MenuItem>
                                <MenuItem>
                                  <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                  >
                                    Delete
                                  </a>
                                </MenuItem>
                                
                                
                              </div>
                            </MenuItems>
                          </Menu>
                        </td>
                      </tr>
                      
                    ))}
                    
                    
                    
                  </tbody>
                </table>
                
                
              </div>
              <div className='pagination'>
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-3 py-3 sm:px-3">
                <div className="flex flex-1 justify-between sm:hidden">
                  <a
                    href="#"
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </a>
                  <a
                    href="#"
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </a>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                      <span className="font-medium">97</span> results
                    </p>
                  </div>
                  <div>
                    <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                      <a
                        href="#"
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon aria-hidden="true" className="size-5" />
                      </a>
                      {/* Current: "z-10 bg-purple-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
                      <a
                        href="#"
                        aria-current="page"
                        className="relative z-10 inline-flex items-center bg-purple-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                      >
                        1
                      </a>
                      <a
                        href="#"
                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        2
                      </a>
                      <a
                        href="#"
                        className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                      >
                        3
                      </a>
                      <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                        ...
                      </span>
                      <a
                        href="#"
                        className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                      >
                        8
                      </a>
                      <a
                        href="#"
                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        9
                      </a>
                      <a
                        href="#"
                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        10
                      </a>
                      <a
                        href="#"
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon aria-hidden="true" className="size-5" />
                      </a>
                    </nav>
                  </div>
                </div>
              </div>  
              </div>    

              </div>
            </div>
          </div>
        </div>

{/* Student Onboarding Modal */}
        
<Dialog open={open} onClose={setOpen} className="relative z-50">
      <div className="fixed inset-0" />

        <FeeCreation/>
    </Dialog>


   

  </div>
    
  )
}




