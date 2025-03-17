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
import Help from '../components/Help'







function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const tabs = [
  { name: 'Help', href: 'Help', current: false },
  { name: 'FAQ’s', href: '#', current: true },

]

const tabs2 = [
  { name: 'School Admin', href: '#', current: true },
  { name: 'Student Module', href: '#', current: false },
  { name: 'Teacher Module', href: '#', current: false },
]


const faqs = [
    {
      question: "After adding staff or student no email is receiving?",
      answer:
        "After adding staff or student if no email is receiving or there is no any email send by system, please cross check with emails with our support team.",
    },
    {
        question: "Can I use Digi Akshara as multi branch school application?",
        answer:
          "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
      },
      {
        question: "How secure is the data stored in the system?",
        answer:
          "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
      },
      {
        question: "How do I assign roles and permissions to users?",
        answer:
          "After adding staff or student if no email is receiving or there is no any email send by system, please cross check with emails with our support team.",
      },
      {
          question: "Can attendance be recorded automatically through biometric or RFID devices?",
          answer:
            "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
        },
        {
          question: "Can I send automated fee reminders to parents?",
          answer:
            "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
        },
        {
            question: "Can teachers enter student marks and generate report cards?",
            answer:
              "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
          },
          {
            question: "Can reports be exported in Excel or PDF format?",
            answer:
              "After adding staff or student if no email is receiving or there is no any email send by system, please cross check with emails with our support team.",
          },
          {
              question: "How do I reset my password if I forget it?",
              answer:
                "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
            },
            {
              question: "What should I do if I face issues with the system?",
              answer:
                "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
            },
   
  ]


export default function FAQ() {
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)

 

  const notificationMethods = [
    { id: 'Male', title: 'Male' },
    { id: 'Female', title: 'Female' },
    { id: 'Other', title: 'Other' },
  ]

  const [value, setValue] = useState({
 
});

 
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
         
         <div className='faq-block flex justify-center py-4'>
            <div className='faq-inner-blk mx-auto min-w-[56rem] max-w-4xl'>
                <h1 className='text-2xl font-medium text-center pb-2'>Frequently asked questions</h1>
                <div className='mt-4 flex justify-center'>
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
               <div className='faq-content-blk'>
               <dl className="mt-16 divide-y divide-gray-900/10">
                    {faqs.map((faq) => (
                    <Disclosure key={faq.question} as="div" className="py-6 first:pt-0 last:pb-0">
                        <dt>
                        <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                            <span className="text-base/7 font-semibold">{faq.question}</span>
                            <span className="ml-6 flex h-7 items-center">
                            <PlusSmallIcon aria-hidden="true" className="size-6 group-data-[open]:hidden" />
                            <MinusSmallIcon aria-hidden="true" className="size-6 group-[&:not([data-open])]:hidden" />
                            </span>
                        </DisclosureButton>
                        </dt>
                        <DisclosurePanel as="dd" className="mt-2 pr-12">
                        <p className="text-base/7 text-gray-600">{faq.answer}</p>
                        </DisclosurePanel>
                    </Disclosure>
                    ))}
                </dl>
                </div>         

            </div>
        </div>


       
        
        





  </div>
    
  )
}



