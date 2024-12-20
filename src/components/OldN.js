
'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
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
import { DocumentArrowDownIcon} from '@heroicons/react/24/outline'
import { EyeIcon} from '@heroicons/react/24/outline'
import { IdentificationIcon} from '@heroicons/react/24/outline'


import Datepicker from "react-tailwindcss-datepicker";
import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend, Label, legendType } from 'recharts';
import Select from "react-tailwindcss-select";
import CreateExam from './CreateExam'
import { getData } from '../app/api'
import { EXAM } from '../app/url'
import ExamDetailsPage from './ExamDetailsPage'






const people = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
  // More people...
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const tabs = [
  { name: 'Daily Time table', href: '#', current: false },
  { name: 'Classes', href: '#', current: false },
  { name: 'Exams', href: '#', current: true },
  { name: 'Certificates', href: '#', current: false },
  

]

const tabs2 = [
  { name: 'Exams Schedules', href: '#',  current: true },
  { name: 'Exams Results', href: '#',  current: false },
]



export default function OldManageExams() {

  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)

  const checkbox = useRef()
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedPeople, setSelectedPeople] = useState([])
  const [examData , setExamData] = useState([])

  const notificationMethods = [
    { id: 'All', title: 'All' },
    { id: 'Old Students', title: 'Old Students' },
    { id: 'New Students', title: 'New Students' },
  ]

  const [value, setValue] = useState({
 
});

useEffect(()=>{
  getExamData()
},[])

const getExamData = async () => {
  const response = await getData(EXAM)
  console.log("incomming values :",response );
  
  if (response.status === 200) {
    console.log("comming values are:", response.data);
    let formatter = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    let data = response.data.data.map((item, index) =>({
      id : index + 1,
      name : item.name,
      section : item.section,
      examDates: `${formatter.format(new Date(item.startDate))} - ${formatter.format(new Date(item.endDate))}`,
    }))
    setExamData(data)
  }
}

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
  const handleClose2 = () => setOpen2(false)


  return (
    
    
      
      <div className="flow-root">
        {/* Primary Tabs */}
                 
         <div className='mt-4 flex justify-between'>
           <div className='text-lg text-gray-900 font-medium'>
            
           <div className="sm:hidden">
                <label htmlFor="tabs2" className="sr-only">
                  Select a tab
                </label>
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                <select
                  id="tabs2"
                  name="tabs2"
                  defaultValue={tabs2.find((tab) => tab.current).name}
                  className="block w-full rounded-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                >
                  {tabs2.map((tab) => (
                    <option key={tab.name}>{tab.name}</option>
                  ))}
                </select>
              </div>
                        
            
            </div>   
          
           <div className='right-btns-blk space-x-4'>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                >
                  <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
                  Add New Exam
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

        <div className="-mx-2 -my-2 mt-0 sm:-mx-6">{/* /Removed overflow-x-auto cloass */}
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
              <div className="relative shadow ring-1 ring-black/5 sm:rounded-lg">{/* /Removed overflow-hidden cloass */}
                

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
                        Exam Name
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
                        Sections
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
                          </span>
                          </a>
                      </th>
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                        Exam Dates
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon aria-hidden="true" className="size-4" />
                          </span>
                          </a>
                      </th>
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                        <a href="#" className="group inline-flex">
                        Subjects Included
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
                        Hall tickets
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
                   

                    {examData.map((data) => (
                      <tr key={data.email} className={selectedPeople.includes(data) ? 'bg-gray-50' : undefined}>
                        <td className="relative px-7 sm:w-12 sm:px-6" >
                          {selectedPeople.includes(data) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-purple-600" />
                          )}
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                            value={data.email}
                            checked={selectedPeople.includes(data)}
                            onChange={(e) =>
                              setSelectedPeople(
                                e.target.checked
                                  ? [...selectedPeople, data]
                                  : selectedPeople.filter((p) => p !== data),
                              )
                            }
                          />
                        </td>
                       
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{data.name}</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{data.section}</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{data.examDates}</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">5</td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500"><a href='#' onClick={() => setOpen2(true)}>View Details</a></td>

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
              

              </div>
            </div>
          </div>
        </div>

{/* Add Class */}
        
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      
      <CreateExam onClose={handleClose} />
    </Dialog>

    <Dialog open={open2} onClose={setOpen2} className="relative z-50">
      <ExamDetailsPage onClose2={handleClose2} />
    </Dialog>                

   

  </div>
    
  )
}



