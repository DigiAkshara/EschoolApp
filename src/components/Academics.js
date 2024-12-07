
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
import { DocumentArrowDownIcon} from '@heroicons/react/24/outline'
import { EyeIcon} from '@heroicons/react/24/outline'



import Datepicker from "react-tailwindcss-datepicker";
import React, { PureComponent } from 'react';
import Select from "react-tailwindcss-select";
import ManageClass from './ManageClass'

const subjects = [
    { value: "English", label: "English" },
    { value: "Telugu", label: "Telugu" },
    { value: "Social", label: "Social" }
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
  { name: 'Daily Time table', href: '#', current: false },
  { name: 'Classes', href: '#', current: true },
  { name: 'Exams', href: '#', current: false },
  { name: 'Certificates', href: '#', current: false },
]

export default function Academics() {
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
  const handleClose = () =>setOpen(false)

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
           <div className='text-lg text-gray-900 font-medium'>Classes</div>   
          
           <div className='right-btns-blk space-x-4'>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                >
                  <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
                  Add Class
                </button>
                

            </div>   

        </div>

         <div className='filter-badges-blk mt-4 flex flex-wrap gap-x-4'>
          <span className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            Class:<span className='font-bold'>1</span>
            <button type="button" className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20">
              <span className="sr-only">Remove</span>
              <svg viewBox="0 0 14 14" className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75">
                <path d="M4 4l6 6m0-6l-6 6" />
              </svg>
              <span className="absolute -inset-1" />
            </button>
          </span>
          <span className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            Section:<span className='font-bold'>A</span>
            <button type="button" className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20">
              <span className="sr-only">Remove</span>
              <svg viewBox="0 0 14 14" className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75">
                <path d="M4 4l6 6m0-6l-6 6" />
              </svg>
              <span className="absolute -inset-1" />
            </button>
          </span>
          

          <Button className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
           Clear All
          </Button>  
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
                    <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <MenuButton className="relative inline-flex items-center rounded bg-white px-2 py-1 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        <FunnelIcon aria-hidden="true" className="size-5" />
                        Filters
                        <span className='flex items-center justify-center text-center absolute w-5 h-5 rounded-full bg-red-500 text-white font-medium text-xs -right-2 -top-2'>3</span>
                      </MenuButton>
                    </div>

                    <MenuItems
                      transition
                      className="max-h-[430px] overflow-y-auto absolute right-0 z-10 mt-2 px-4 py-4 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      <div className="grid gap-3 ">
                        <MenuItem className="group mb-2">
                        <div className='flex'>
                          <FunnelIcon aria-hidden="true" className="size-5" />
                          <span className='pl-2'>Select Filters</span>
                        </div>
                        </MenuItem>
                        <MenuItem>
                            <div className="">
                                  <label htmlFor="street-address" className="block text-sm/6 font-regular text-gray-900">
                                  Class Category
                                  </label>
                                  <div className="mt-2">
                                      <select
                                        id="location"
                                        name="location"
                                        defaultValue="2024-2025"
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                      >
                                        <option>Fee Name Title</option>
                                        <option>Canada</option>
                                        <option>Mexico</option>
                                      </select>
                                  </div>
                            </div>
                        </MenuItem>
                        
                        <MenuItem>
                            <div className="">
                                  <label htmlFor="street-address" className="block text-sm/6 font-regular text-gray-900">
                                  Class
                                  </label>
                                  <div className="mt-2">
                                      <select
                                        id="location"
                                        name="location"
                                        defaultValue="All"
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                      >
                                        <option>Fee Name Title</option>
                                        <option>Canada</option>
                                        <option>Mexico</option>
                                      </select>
                                  </div>
                            </div>
                        </MenuItem>

                        <MenuItem>
                            <div className="">
                                  <label htmlFor="street-address" className="block text-sm/6 font-regular text-gray-900">
                                  Section
                                  </label>
                                  <div className="mt-2">
                                      <select
                                        id="location"
                                        name="location"
                                        defaultValue="All"
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                      >
                                        <option>Fee Name Title</option>
                                        <option>Canada</option>
                                        <option>Mexico</option>
                                      </select>
                                  </div>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div className="">
                                  <label htmlFor="street-address" className="block text-sm/6 font-regular text-gray-900">
                                  Class Teacher
                                  </label>
                                  <div className="mt-2">
                                      <select
                                        id="location"
                                        name="location"
                                        defaultValue="All"
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                      >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                      </select>
                                  </div>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div className="">
                                  <label htmlFor="street-address" className="block text-sm/6 font-regular text-gray-900">
                                  Board
                                  </label>
                                  <div className="mt-2">
                                      <select
                                        id="location"
                                        name="location"
                                        defaultValue="All"
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                                      >
                                        <option>Fee Name Title</option>
                                        <option>Canada</option>
                                        <option>Mexico</option>
                                      </select>
                                  </div>
                            </div>
                        </MenuItem>

                        
                        <MenuItem>
                            <div className="flex">
                                <button
                                  type="button"
                                  onClick={() => setOpen(false)}
                                  className="w-1/2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className=" w-1/2 ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                                >
                                  Apply
                                </button>
                            </div>
                        </MenuItem>
                        
                      </div>
                    </MenuItems>
                  </Menu>
                   

                  


                    
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
                        Board
                          <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
                          </span>
                        </a>
                      </th>
                    
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                        Class
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
                          </span>
                          </a>
                      </th>
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                        Section
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
                          </span>
                          </a>
                      </th>
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                        Total Students
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
                          </span>
                          </a>
                      </th>
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                        Class Teacher
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
                          </span>
                          </a>
                      </th>
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                        Time Table & Syllabus
                        
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
                    <tr className="border-t border-gray-200">
                      <th
                        scope="colgroup"
                        colSpan={8}
                        className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                      >
                        KINDERGARTEN
                      </th>
                    </tr>

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
                       
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">CBSE</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">Nursery</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">A</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">30</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">Janet Baker</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500"><a href='#' onClick={() => setOpen2(true)}>View</a></td>
                        

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
                       
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">CBSE</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">LKG</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">A</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">30</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">Janet Baker</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500"><a href='#'>View</a></td>
                        

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
                       
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">CBSE</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">UKG</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">A</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">30</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">Janet Baker</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500"><a href='#'>View</a></td>
                        

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
                    
                    <tr className="border-t border-gray-200">
                      <th
                        scope="colgroup"
                        colSpan={8}
                        className="bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                      >
                       Primary – Classes 1 to 5
                      </th>
                    </tr>
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
                       
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">CBSE</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">Class 1</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">A</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">30</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">Janet Baker</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500"><a href='#'>View</a></td>
                        

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

{/* Add Class */}
        
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <div className="fixed inset-0" />

      <ManageClass onClose={handleClose} />
    </Dialog>

    <Dialog open={open2} onClose={setOpen2} className="relative z-50">
      <div className="fixed inset-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-7xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="bg-purple-900 px-3 py-3 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className=" text-base font-semibold text-white">View Class Info</DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen2(false)}
                          className="relative rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex-1 px-6 py-6 sm:px-6 overflow-y-auto">
                    

                    <div className='form-content'>
                    
                          <ul role="list" className="grid grid-cols-1 gap-x-4 gap-y-4">
                              
                              <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                                <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                                  <div className='flex items-center item-title-blk'>
                                      <div className='inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white'>
                                        <UserCircleIcon aria-hidden="true" className="size-5" />
                                      </div>
                                      <div className="text-lg pl-4 font-medium text-gray-900">Class Details</div>
                                  </div>
                                </div>

                                <div className="px-4 py-4 text-sm/6">
                                  
                                    <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
                                      <div className="content-item pb-2 border-b border-gray-300">
                                        <dt className="text-sm/6 text-gray-500">Board</dt>
                                        <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">CBSE</dd>
                                      </div>
                                      <div className="content-item pb-2 border-b border-gray-300">
                                        <dt className="text-sm/6 text-gray-500">Class Category</dt>
                                        <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">KINDERGARTEN</dd>
                                      </div>
                                      <div className="content-item pb-2 border-b border-gray-300">
                                        <dt className="text-sm/6 text-gray-500">Class</dt>
                                        <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Class 1</dd>
                                      </div>
                                      <div className="content-item pb-2 border-b border-gray-300">
                                        <dt className="text-sm/6 text-gray-500">Section</dt>
                                        <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">A</dd>
                                      </div>
                                      <div className="content-item pb-2 border-b border-gray-300">
                                        <dt className="text-sm/6 text-gray-500">Class Teacher </dt>
                                        <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Rama Krishna</dd>
                                      </div>
                                      
                                      <div className="content-item pb-2 border-b border-gray-300">
                                        <dt className="text-sm/6 text-gray-500">Subjects</dt>
                                        <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">English, Telugu, Social, Science</dd>
                                      </div>
                                      
                                      
                                    </dl>
                                  
                                </div>
                              </li>

                              <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                                <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                                  <div className='flex items-center item-title-blk'>
                                      <div className='inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white'>
                                        <UserCircleIcon aria-hidden="true" className="size-5" />
                                      </div>
                                      <div className="text-lg pl-4 font-medium text-gray-900">Time Table</div>
                                  </div>
                                </div>

                                <div className="px-4 py-4 text-sm/6">
                                  
                                <table className="min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
                                  <thead className="bg-purple-100">
                                    <tr>
                                      
                                      <th scope="col" className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 pl-4 w-18">
                                        <a href="#" className="group inline-flex">
                                        P. No
                                        </a>
                                      </th>
                                                                          
                                      <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900">
                                        <a href="#" className="group inline-flex">
                                        Period  Time
                                        </a>
                                      </th>
                                      <th scope="col" className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900">
                                        <a href="#" className="group inline-flex">
                                        Monday
                                        </a>
                                      </th>
                                                                          
                                      <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900">
                                        <a href="#" className="group inline-flex">
                                        Tuesday
                                        </a>
                                      </th>
                                      <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900">
                                        <a href="#" className="group inline-flex">
                                        Wednesday
                                        </a>
                                      </th>
                                      <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900">
                                        <a href="#" className="group inline-flex">
                                        Thursday
                                        </a>
                                      </th>
                                      <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900">
                                        <a href="#" className="group inline-flex">
                                        Friday
                                        </a>
                                      </th>
                                      <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900">
                                        <a href="#" className="group inline-flex">
                                        Saturday
                                        </a>
                                      </th>
                                      
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 bg-white">
                                      <tr>
                                        
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 pl-4">1</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">9:00 - 9:40</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">9:00 - 9:40</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                          <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 flex flex-col">
                                          <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                          <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 flex flex-col">
                                          <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                          <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                        </td>
                                        
                                      </tr>
                                      <tr>
                                        
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 pl-4">2</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">9:00 - 9:40</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">9:00 - 9:40</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                          <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 flex flex-col">
                                          <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                          <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 flex flex-col">
                                          <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                          <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                        </td>
                                        
                                      </tr>
                                      
                                      <tr className="border-t border-gray-200 bg-teal-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 pl-4">3</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">9:00 - 9:40</td>
                                        <td
                                            scope="colgroup"
                                            colSpan={6}
                                            className="whitespace-nowrap px-2 py-2 text-sm text-gray-900"
                                          >
                                            Lunch Break
                                        </td>

                                      </tr>
                                      
                                      <tr>
                                        
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 pl-4">4</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">9:00 - 9:40</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">9:00 - 9:40</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                          <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 flex flex-col">
                                          <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                          <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 flex flex-col">
                                          <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                          <div className='flex flex-col'><span>English</span><span>Rama Krishna</span></div>
                                        </td>
                                        
                                      </tr>
                                      
                                  
                                    
                                    
                                  </tbody>
                                </table>
                                  
                                </div>
                              </li>

                              <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                                <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                                  <div className='flex items-center item-title-blk'>
                                      <div className='inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white'>
                                        <UserCircleIcon aria-hidden="true" className="size-5" />
                                      </div>
                                      <div className="text-lg pl-4 font-medium text-gray-900">Syllabus 2023-2024</div>
                                  </div>
                                </div>

                                <div className="px-4 py-4 text-sm/6">
                                  
                                <ul role="list" className="grid grid-cols-4 gap-x-6 gap-y-8">
                                    <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                                      <div className="flex items-center justify-between gap-x-4 px-4 py-4">
                                        <div className='flex items-center item-title-blk'>
                                            <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                                              <DocumentArrowDownIcon aria-hidden="true" className="size-5" />
                                            </div>
                                            <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
                                              <span>English</span>
                                            </div>
                                        </div>
                                        <a href='#' className='text-gray-400'>
                                          <EyeIcon aria-hidden="true" className="size-5" />
                                        </a>
                                      </div>
                                    </li>
                                    <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                                      <div className="flex items-center justify-between gap-x-4 px-4 py-4">
                                        <div className='flex items-center item-title-blk'>
                                            <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                                              <DocumentArrowDownIcon aria-hidden="true" className="size-5" />
                                            </div>
                                            <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
                                              <span>Telugu</span>
                                            </div>
                                        </div>
                                        <a href='#' className='text-gray-400'>
                                          <EyeIcon aria-hidden="true" className="size-5" />
                                        </a>
                                      </div>
                                    </li>
                                    <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                                      <div className="flex items-center justify-between gap-x-4 px-4 py-4">
                                        <div className='flex items-center item-title-blk'>
                                            <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                                              <DocumentArrowDownIcon aria-hidden="true" className="size-5" />
                                            </div>
                                            <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
                                              <span>Social</span>
                                            </div>
                                        </div>
                                        <a href='#' className='text-gray-400'>
                                          <EyeIcon aria-hidden="true" className="size-5" />
                                        </a>
                                      </div>
                                    </li>
                                    <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                                      <div className="flex items-center justify-between gap-x-4 px-4 py-4">
                                        <div className='flex items-center item-title-blk'>
                                            <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                                              <DocumentArrowDownIcon aria-hidden="true" className="size-5" />
                                            </div>
                                            <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
                                              <span>Science</span>
                                            </div>
                                        </div>
                                        <a href='#' className='text-gray-400'>
                                          <EyeIcon aria-hidden="true" className="size-5" />
                                        </a>
                                      </div>
                                    </li>



                                 </ul>     
                                      
                                      
                                   
                                  
                                </div>
                              </li>
                              

                          </ul>

                    </div>

                  </div>
                </div>
                <div className="flex shrink-0 px-4 py-4 bg-gray-100 w-full justify-end">
                  
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                    >
                      Submit
                    </button>

                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>                

   

  </div>
    
  )
}




