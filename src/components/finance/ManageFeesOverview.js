/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
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
import { ChartBarIcon} from '@heroicons/react/24/outline'
import { DocumentCurrencyRupeeIcon} from '@heroicons/react/24/outline'

import Datepicker from "react-tailwindcss-datepicker";
import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend, Label, legendType } from 'recharts';
import Select from "react-tailwindcss-select";

import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { CursorArrowRaysIcon, EnvelopeOpenIcon, UsersIcon } from '@heroicons/react/24/outline'


const graphdata = [
  { name: 'Collected Fee ', value: 16000 },
  { name: 'Pending Fee', value: 6000 },

];



const GraphCOLORS = ['#10B981', '#F59E0B',];



const bargraphdata = [
  {
    name: 'Jan 10',
    collection: 90000,
    expenses: 18000,
    salaries: 30000,
  },
  {
    name: 'Jan 11',
    collection: 55000,
    expenses: 20000,
    salaries: 18000,
  },
  {
    name: 'Jan 12',
    collection: 97000,
    expenses: 20000,
    salaries: 30000,
  },
  {
    name: 'Jan 13',
    collection: 87000,
    expenses: 22000,
    salaries: 11000,
  },
  {
    name: 'Jan 14',
    collection: 57000,
    expenses: 15000,
    salaries: 1700,
  },
  {
    name: 'Jan 15',
    collection: 77000,
    expenses: 13000,
    salaries: 15000,
  },
  
];


const stats = [
  { id: 1, name: 'Fee Collection', stat: '0', icon: DocumentCurrencyRupeeIcon, change: '0', changeType: 'increase' },
  { id: 2, name: 'Expenses', stat: '0', icon: EnvelopeOpenIcon, change: '0%', changeType: 'increase' },
  { id: 3, name: 'Staff Salaries', stat: '0', icon: UsersIcon, change: '0%', changeType: 'decrease' },
  { id: 3, name: 'Total Income', stat: '0', icon: DocumentCurrencyRupeeIcon, change: '0%', changeType: 'decrease' },
]


const people = [
  {
    name: 'Leslie Alexander',
    details: 'Roll No: 2 | Class : 2 / A',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    amount: '15000',
  },
  {
    name: 'Michael Foster',
    details: 'Roll No: 2 | Class : 2 / A',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      amount: '12000',
  },
  {
    name: 'Dries Vincent',
    details: 'Roll No: 2 | Class : 2 / A',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      amount: '10000',
  },
  {
    name: 'Lindsay Walton',
    details: 'Roll No: 2 | Class : 2 / A',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      amount: '16000',
  },
  
]

const expenses = [
  {
    title: 'Note Books',
    category: 'Education | 12-12-2024',
    amount: '1500',
  },
  {
    title: 'Tea Party',
    category: 'Miscellaneous | 12-12-2024',
    amount: '1200',
  },
  {
    title: 'Electricty',
    category: 'Electricity Bill | 12-12-2024',
    amount: '500',
  },
  {
    title: 'WIFI',
    category: 'Wifi Bill | 12-12-2024',
    amount: '800',
  },
  
  
]


const balance = [
  {
    title: 'Opening Balance',
    category: 'Bank',
    amount: '1500',
  },
  {
    title: 'Opening Balance',
    category: 'Cash',
    amount: '1200',
  },
  {
    title: 'Closing Balance',
    category: 'Bank',
    amount: '5000',
  },
  {
    title: 'Closing Balance',
    category: 'Cash',
    amount: '5000',
  },
  
  
]



function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const tabs = [
  { name: 'Overview', href: '#', current: true },
  { name: 'Fee Collections', href: '#', current: false },
  { name: 'Staff Salaries', href: '#', current: false },
  { name: 'Expenses', href: '#', current: false },
  { name: 'Fee Structures', href: '#', current: false },
  { name: 'School Bank Accounts', href: '#', current: false },
  { name: 'Discounts', href: '#', current: false },
  { name: 'Payrolls', href: '#', current: false },
]





export default function ManageFeesOverview() {
 
   

  
  


  return (
    
    
      
      <div className="flow-root">
        {/* Primary Tabs */}
        
         

        {/* Finaance overview cards */}          
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
                  <p
                    className={classNames(
                      item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                      'ml-2 flex items-baseline text-sm font-semibold',
                    )}
                  >
                    {item.changeType === 'increase' ? (
                      <ArrowUpIcon aria-hidden="true" className="size-5 shrink-0 self-center text-green-500" />
                    ) : (
                      <ArrowDownIcon aria-hidden="true" className="size-5 shrink-0 self-center text-red-500" />
                    )}

                    <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                    {item.change}
                  </p>
                
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className='f-overview-widgets mt-4 mb-4'>
          <ul role="list" className="grid grid-cols-3 gap-x-6 gap-y-8">
                
                
                <li key='12' className="col-span-2 overflow-hidden rounded-xl border border-gray-300">
                  <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                    <div className='flex items-center item-title-blk'>
                        <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                          <ChartBarIcon aria-hidden="true" className="size-5" />
                        </div>
                        <div className="text-lg pl-4 font-medium text-gray-900">Fee Collection | Expenses | Salaries</div>
                    </div>
                  <div className='flex gap-x-4'>
                    <select
                        id="location"
                        name="location"
                        defaultValue="2024-2025"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                      >
                        <option>2024-2025</option>
                        <option>2023-2024</option>
                        <option>2022-2021</option>
                      </select>
                      <select
                        id="location"
                        name="location"
                        defaultValue="Weekly"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                      >
                        <option>Weekly</option>
                        <option>Monthly</option>
                        <option>Yearly</option>
                      </select>
                  </div>
                   

                  </div>

                  <div className="px-6 py-4 text-sm/6 " style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={bargraphdata}
                      margin={{
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                      }}
                      barSize={10}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Legend />
                      <Tooltip />
                      <Bar
                        dataKey="collection"
                        fill="#10B981"
                        activeBar={<Rectangle fill="#10B981" stroke="#10B981" />}
                      />
                      <Bar
                        dataKey="expenses"
                        fill="#EF4444"
                        activeBar={<Rectangle fill="#EF4444" stroke="#EF4444" />}
                      />
                      <Bar
                        dataKey="salaries"
                        fill="#0EA5E9"
                        activeBar={<Rectangle fill="#0EA5E9" stroke="#0EA5E9" />}
                      />
                      
                    </BarChart>
                  </ResponsiveContainer>
                  </div>
                </li>

                <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                  <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                    <div className='flex items-center item-title-blk'>
                        <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                          <ClipboardDocumentCheckIcon aria-hidden="true" className="size-5" />
                        </div>
                        <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
                          <span>Pending Fee’s</span>
                        </div>
                    </div>
                    <a href='#' className='text-gray-400'>
                      <ArrowUpRightIcon aria-hidden="true" className="size-5" />
                    </a>
                  </div>
                  <div className="px-4 py-4 text-sm/6" style={{ width: "100%", height: 200 }}>
                    <ul role="list" className="divide-y divide-gray-200">
                      {people.map((person) => (
                        <li key={person.email} className="flex items-center justify-between gap-x-6 py-2">
                          <div className="flex min-w-0 gap-x-4">
                            <img alt="" src={person.imageUrl} className="size-10 flex-none rounded-full bg-gray-50" />
                            <div className="min-w-0 flex-auto">
                              <p className="font-medium text-gray-900 text-purple-600">{person.name}</p>
                              <p className="mt-1 truncate text-xs/5 text-gray-500">{person.details}</p>
                            </div>
                          </div>
                          
                          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                            {person.amount}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>

                <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                  <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                    <div className='flex items-center item-title-blk'>
                        <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                          <ClipboardDocumentCheckIcon aria-hidden="true" className="size-5" />
                        </div>
                        <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
                          <span>Recent Expenses</span>
                        </div>
                    </div>
                    <a href='#' className='text-gray-400'>
                      <ArrowUpRightIcon aria-hidden="true" className="size-5" />
                    </a>
                  </div>
                  <div className="px-4 py-4 text-sm/6">
                    <ul role="list" className="divide-y divide-gray-200">
                      {expenses.map((expenses) => (
                        <li key={expenses.category} className="flex items-center justify-between gap-x-6 py-2">
                          <div className="flex min-w-0 gap-x-4">
                            <div className="min-w-0 flex-auto">
                              <p className="text-sm/6 font-semibold text-gray-900">{expenses.title}</p>
                              <p className="mt-1 truncate text-xs/5 text-gray-500">{expenses.category}</p>
                            </div>
                          </div>
                          
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                            {expenses.amount}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>

                <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                  <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                    <div className='flex items-center item-title-blk'>
                        <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                          <ClipboardDocumentCheckIcon aria-hidden="true" className="size-5" />
                        </div>
                        <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
                          <span>Today’s Balance</span>
                        </div>
                    </div>
                    <div className='flex'>
                    
                        <a href='#' className='text-gray-400'>
                        <ArrowUpRightIcon aria-hidden="true" className="size-5" />
                      </a>
                    </div>
                    

                  </div>
                  <div className="px-4 py-4 text-sm/6">
                    <ul role="list" className="divide-y divide-gray-200">
                      {balance.map((balance) => (
                        <li key={balance.category} className="flex items-center justify-between gap-x-6 py-2">
                          <div className="flex min-w-0 gap-x-4">
                            <div className="min-w-0 flex-auto">
                              <p className="text-sm/6 font-semibold text-gray-900">{balance.title}</p>
                              <p className="mt-1 truncate text-xs/5 text-gray-500">{balance.category}</p>
                            </div>
                          </div>
                          
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {balance.amount}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>

                <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                  <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                    <div className='flex items-center item-title-blk'>
                        <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                          <ClipboardDocumentCheckIcon aria-hidden="true" className="size-5" />
                        </div>
                        <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
                          <span>Fee Collection</span>
                        </div>
                    </div>
                    <a href='#' className='text-gray-400'>
                      <ArrowUpRightIcon aria-hidden="true" className="size-5" />
                    </a>
                  </div>

                  <div className="px-4 py-4 text-sm/6" style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <PieChart>
                          <Pie  
                            data={graphdata}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={0}
                            dataKey="value"
                            legendType='circle'
                            label
                          >
                            {graphdata.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={GraphCOLORS[index % GraphCOLORS.length]} />
                            ))}
                            <Label fontSize="18" width={30} position="center">
                            76%
                            </Label>
                          </Pie>
                          <Legend
                            layout="horizontal"
                            align="center"
                            verticalAlign="bottom"
                          />
                      </PieChart>
                      </ResponsiveContainer>
                  </div>
                </li>
                
            </ul>

        </div>

        













   

  </div>
    
  )
}




