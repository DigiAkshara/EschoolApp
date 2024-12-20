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
import { useLocation, useNavigate } from 'react-router-dom'
import ManageDailyTimeTable from './ManageDailyTimeTable'
import Class from './Class'
import ManageExams from './ManageExams'
import ManageCertificates from './ManageCertificates'

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

const tabs = ['Daily Time table','Classes','Exams','Certificates']
  

// const tabs = [
//   { name: 'Daily Time table', href: '/academics', component: ManageDailyTimeTable },
//   { name: 'Classes', href: '/academics-class', component: ManageClass },
//   { name: 'Exams', href: '/academics-exams', component: () => <div>Exams Component</div> },
//   { name: 'Certificates', href: '/academics-certificates', component: () => <div>Certificates Component</div> },
// ]

export default function Academics() {
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const navigate = useNavigate()
  const location = useLocation();
  const checkbox = useRef()
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedPeople, setSelectedPeople] = useState([])
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const notificationMethods = [
    { id: 'All', title: 'All' },
    { id: 'Old Students', title: 'Old Students' },
    { id: 'New Students', title: 'New Students' },
  ]

  const [value, setValue] = useState({
 
});

  // useLayoutEffect(() => {
  //   const isIndeterminate = selectedPeople.length > 0 && selectedPeople.length < people.length
  //   setChecked(selectedPeople.length === people.length)
  //   setIndeterminate(isIndeterminate)
  //   checkbox.current.indeterminate = isIndeterminate
  // }, [selectedPeople])

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

  // const handleTabClick = (path) => {
  //   navigate(path);
  // };

  const handleTabChange = (event) => {
    const selectedTab = tabs.find((tab) => tab.name === event.target.value);
    if (selectedTab) {
      navigate(selectedTab.path);
    }
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case "Daily Time table":
        return <ManageDailyTimeTable />;
      case "Classes":
        return <Class />;
      case "Exams":
        return <ManageExams />;
      case "Certificates":
        return <ManageCertificates />;
      default:
        return <h2>No Content Available</h2>;
    }
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
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
              >
                {tabs.map((tab) => (
                  <option key={tab} value={tab}>{tab}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav aria-label="Tabs" className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={classNames(
                        activeTab === tab
                          ? 'border-purple-500 text-purple-600'
                          :'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium',
                      )}
                      
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
        </div>
        {renderTabContent()}
  </div>
    
  )
}