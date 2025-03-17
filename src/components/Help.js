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


import React, { PureComponent } from 'react';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'







function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const tabs = [
  { name: 'Help', href: '#', current: true },
  { name: 'FAQ’s', href: '#', current: false },

]

const tabs2 = [
  { name: 'School Admin', href: '#', current: true },
  { name: 'Student Module', href: '#', current: false },
  { name: 'Teacher Module', href: '#', current: false },
]





export default function Example() {
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)

 

  const notificationMethods = [
    { id: 'Male', title: 'Male' },
    { id: 'Female', title: 'Female' },
    { id: 'Other', title: 'Other' },
  ]

  const [value, setValue] = useState({
 
});


const navigation = [
    {
      name: 'Introduction',
      current: true,
      children: [
        { name: 'Overview of the School Management System', href: '#', current: true, },
        { name: 'Key Features', href: '#' },
        { name: 'Customer Success', href: '#' },
      ],
    },
    {
      name: 'Getting Started',
      current: false,
      children: [
        { name: 'GraphQL API', href: '#' },
        { name: 'iOS App', href: '#' },
        { name: 'Android App', href: '#' },
        { name: 'New Customer Portal', href: '#' },
      ],
    },
    {
        name: 'User Management',
        current: false,
        children: [
          { name: 'GraphQL API', href: '#' },
          { name: 'iOS App', href: '#' },
          { name: 'Android App', href: '#' },
          { name: 'New Customer Portal', href: '#' },
        ],
      },
      {
        name: 'Attendance Management',
        current: false,
        children: [
          { name: 'GraphQL API', href: '#' },
          { name: 'iOS App', href: '#' },
          { name: 'Android App', href: '#' },
          { name: 'New Customer Portal', href: '#' },
        ],
      },
      {
        name: 'Finance Management',
        current: false,
        children: [
          { name: 'GraphQL API', href: '#' },
          { name: 'iOS App', href: '#' },
          { name: 'Android App', href: '#' },
          { name: 'New Customer Portal', href: '#' },
        ],
      },
      {
          name: 'Academic Management',
          current: false,
          children: [
            { name: 'GraphQL API', href: '#' },
            { name: 'iOS App', href: '#' },
            { name: 'Android App', href: '#' },
            { name: 'New Customer Portal', href: '#' },
          ],
        },
        {
          name: 'Events & Holiday Management',
          current: false,
          children: [
            { name: 'GraphQL API', href: '#' },
            { name: 'iOS App', href: '#' },
            { name: 'Android App', href: '#' },
            { name: 'New Customer Portal', href: '#' },
          ],
        },
        {
            name: 'Reports & Analyticst',
            current: false,
            children: [
              { name: 'GraphQL API', href: '#' },
              { name: 'iOS App', href: '#' },
              { name: 'Android App', href: '#' },
              { name: 'New Customer Portal', href: '#' },
            ],
          },
          {
            name: 'Technical Support',
            current: false,
            children: [
              { name: 'GraphQL API', href: '#' },
              { name: 'iOS App', href: '#' },
              { name: 'Android App', href: '#' },
              { name: 'New Customer Portal', href: '#' },
            ],
          },
   
  ]


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
 
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


         {/* Secondary Tabs */}
         
         <div className='help-block py-4'>
            <div className='help-inner-blk'>
                <div className='help-search-blk flex rounded-md justify-center items-center flex-col px-4 py-4 bg-gray-100'>
                
                        <h1 className='text-2xl font-medium text-center pb-2'>Help & Documentation</h1>
                        <div className='w-1/2'>
                            <div className="relative rounded-md w-full">
                                <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Search"
                                className="block w-full rounded-md border-0 py-2 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 text-sm"
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <MagnifyingGlassIcon aria-hidden="true" className="size-4 text-gray-400" />
                                </div>
                            </div>
                        </div>


                </div>

                <div className='mt-4 flex'>
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
                    <div className="hidden sm:block">
                        <nav aria-label="Tabs2" className="flex space-x-4">
                        {tabs2.map((tab) => (
                            <a
                            key={tab.name}
                            href={tab.href}
                            aria-current={tab.current ? 'page' : undefined}
                            className={classNames(
                                tab.current ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500 hover:text-gray-700',
                                'rounded-full px-3 py-2 text-sm font-medium',
                            )}
                            >
                            {tab.name}
                            {tab.count ? (
                                <span
                                    className={classNames(
                                    tab.current ? 'bg-white text-purple-600' : 'bg-gray-300 text-gray-900',
                                    'ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block',
                                    )}
                                >
                                    {tab.count}
                                </span>
                                ) : null}
                            </a>
                        ))}
                        </nav>
                    </div>
                </div>

               <div className='help-content-blk flex gap-4 mt-4'>
                    <div className='left-help-menu w-48'>
                        <nav className="flex flex-1 flex-col sticky top-20">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                    {!item.children ? (
                                        <a
                                        href={item.href}
                                        className={classNames(
                                            item.current ? 'bg-purple-100' : 'hover:bg-purple-100',
                                            'block rounded-md py-2 pl-10 pr-2 text-sm/6 font-semibold text-gray-700',
                                        )}
                                        >
                                        {item.name}
                                        </a>
                                    ) : (
                                        <Disclosure as="div">
                                        <DisclosureButton
                                            className={classNames(
                                            item.current ? 'bg-purple-100' : 'hover:bg-purple-100',
                                            'group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm/6 font-semibold text-gray-700',
                                            )}
                                        >
                                            <ChevronRightIcon
                                            aria-hidden="true"
                                            className="size-5 shrink-0 text-gray-400 group-data-[open]:rotate-90 group-data-[open]:text-gray-500"
                                            />
                                            {item.name}
                                        </DisclosureButton>
                                        <DisclosurePanel as="ul" className="mt-1 px-2">
                                            {item.children.map((subItem) => (
                                            <li key={subItem.name}>
                                                <DisclosureButton
                                                as="a"
                                                href={subItem.href}
                                                className={classNames(
                                                    subItem.current ? 'bg-whhite text-purple-600' : 'hover:bg-purple-100',
                                                    'block rounded-md py-2 pl-9 pr-2 text-sm/6 font-semibold text-gray-700',
                                                )}
                                                >
                                                {subItem.name}
                                                </DisclosureButton>
                                            </li>
                                            ))}
                                        </DisclosurePanel>
                                        </Disclosure>
                                    )}
                                    </li>
                                ))}
                                </ul>
                            </li>
                            
                            </ul>
                        </nav>    
                    </div>
                    <div className='right-help-info-blk flex-1 border border-gray-300 rounded-md px-4 py-4 grid gap-4'>
                        <div className='help-info-item grid gap-y-2'>
                                <h2 className='text-lg font-medium'>Login Screen</h2>
                                <p>Select your role and enter your Email/Mobile Number and then enter your password to login into the system.</p>
                                 <img
                                    alt="login screen"
                                    src={'/Help_FAQImages/loginscreen.png'}
                                    className="h-auto max-w-full rounded-lg"
                                />
                        </div>
                        <div className='help-info-item grid gap-y-2'>
                                <h2 className='text-lg font-medium'>Dashboard Screen</h2>
                                <p>After logging in, users will be directed to the Dashboard, which provides an at-a-glance view of key metrics, quick actions, and reports. This guide explains the dashboard layout and functionalities.</p>
                                <p>The dashboard consists of the following sections: </p>
                                <p> Sidebar Menu -Left Panel</p>
                                <p>Key Statistics & Quick Actions - Top Section</p>
                                <p>Reports & Charts - Middle Section</p>
                                <p>Events & Student Performance - Bottom Section</p>
                                 <img
                                    alt="dashboard screen"
                                    src={'/Help_FAQImages/Dash_Board.png'}
                                    className="h-auto max-w-full rounded-lg"
                                />
                        </div>     
                    </div>    



                </div>         

            </div>
        </div>


       
        
        





  </div>
    
  )
}



