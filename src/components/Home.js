import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
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
import { ChartBarIcon } from '@heroicons/react/24/outline'
import { DocumentCurrencyRupeeIcon, CurrencyRupeeIcon, UserPlusIcon, EyeIcon, DocumentPlusIcon } from '@heroicons/react/24/outline'
import { UserGroupIcon } from '@heroicons/react/24/outline'

import Datepicker from "react-tailwindcss-datepicker";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend, Label, legendType } from 'recharts';
import Select from "react-tailwindcss-select";

import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { CursorArrowRaysIcon, EnvelopeOpenIcon, UsersIcon } from '@heroicons/react/24/outline'
import { DASHBOARD } from '../app/url'
import { handleApiResponse } from '../commonComponent/CommonFunctions'
import { getData } from '../app/api'
import { setActiveMenu } from '../app/reducers/appConfigSlice'


const classperformance = [
  { name: 'Good Students ', value: 1600 },
  { name: 'Average Students', value: 300 },
  { name: 'Poor Students', value: 100 },

];



const GraphCOLORS = ['#10B981', '#F59E0B', '#EF4444',];



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

const qucickactions = [
  { id: 1, name: 'Add New Student', icon: UserPlusIcon, action: 'students' },
  { id: 2, name: 'Add New Staff', icon: UserPlusIcon, action: 'staff' },
  { id: 3, name: 'Add Attendance', icon: ClipboardDocumentCheckIcon, action: 'attendance' },
  { id: 4, name: 'View Exam Results', icon: EyeIcon, action: 'academics' },
  { id: 5, name: 'Add Exam Results', icon: DocumentPlusIcon, action: 'academics' },
  { id: 6, name: 'Collect Fee', icon: UserGroupIcon, action: 'finance' },
  { id: 7, name: 'Add Expences & Staff Loans', icon: CurrencyRupeeIcon, action: '' },
  { id: 8, name: 'Send SMS', icon: DocumentCurrencyRupeeIcon, action: '' },
  { id: 9, name: 'Daily Report', icon: DocumentCurrencyRupeeIcon, action: '' },
  { id: 10, name: 'Classes', icon: DocumentCurrencyRupeeIcon, action: '' },
]


const schoolattendance = [
  {
    day: 'Mon',
    percentage: 97,

  },
  {
    day: 'Tue',
    percentage: 88,
  },
  {
    day: 'Wed',
    percentage: 92,
  },
  {
    day: 'Thu',
    percentage: 88,
  },
  {
    day: 'Fri',
    percentage: 92,
  },
  {
    day: 'Sat',
    percentage: 97,
  },

];


const events = [
  {
    title: 'Inter-School Competition',
    imageUrl:
      'https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 744w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1044&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1044w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1344&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1344w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1488&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1488w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1644&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1644w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1944&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1944w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=2088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2088w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=2244&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2244w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=2544&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2544w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=2688&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2688w',
    date: 'Jan 31, 5:00 - 6:00 PM',
  },
  {
    title: 'Sports Day Event',
    imageUrl:
      'https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 744w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1044&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1044w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1344&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1344w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1488&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1488w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1644&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1644w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1944&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1944w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=2088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2088w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=2244&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2244w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=2544&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2544w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=2688&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2688w',
    date: 'Jan 31, 5:00 - 6:00 PM',
  },
  {
    title: 'Yoga Session',
    imageUrl:
      'https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 744w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1044&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1044w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1344&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1344w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1488&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1488w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1644&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1644w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1944&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1944w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=2088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2088w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=2244&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2244w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=2544&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2544w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=2688&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2688w',
    date: 'Jan 31, 5:00 - 6:00 PM',
  },
  {
    title: 'Inter-School Competition',
    imageUrl:
      'https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 744w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1044&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1044w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1344&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1344w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1488&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1488w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1644&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1644w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=1944&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1944w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=2088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2088w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=2244&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2244w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=2544&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2544w, https://images.unsplash.com/photo-1549057736-889b732754a2?q=80&w=2688&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2688w',
    date: 'Jan 31, 5:00 - 6:00 PM',
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

function Home() {
  const { user } = useSelector((state) => state.appConfig)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [studentCount, setStudentCount] = useState(0)
  const [staffCount, setStaffCount] = useState(0)
  const [feeCollection, setFeeCollection] = useState(0)
  const [expenses, setExpenses] = useState(0)
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
    getDashboardData()
  }, [])

  const getDashboardData= async()=>{
    try {
      const response = await getData(DASHBOARD);
      if (response.data.data) {
        setStudentCount(response.data.data.studentCount)
        setStaffCount(response.data.data.staffCount)
        setFeeCollection(response.data.data.totalCollectedFee)
        setExpenses(response.data.data.totalExpense)
      }
    } catch (error) {
      handleApiResponse(error)
    }
  }
  return (
    <>
      <div className="flow-root">

        {/* Dashboard Main cards */}
        <div className='f-overview-cards'>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-4 shadow ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <dt>
                <div className="absolute rounded-md bg-orange-50 p-3">
                  <UsersIcon aria-hidden="true" className="size-6 text-orange-800" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">Total Students</p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{studentCount}</p>
                {/* <p
                  className={classNames(
                    item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                    'ml-2 flex items-baseline text-sm font-semibold',
                  )}
                > */}
                  {/* {item.changeType === 'increase' ? (
                    <ArrowUpIcon aria-hidden="true" className="size-5 shrink-0 self-center text-green-500" />
                  ) : (
                    <ArrowDownIcon aria-hidden="true" className="size-5 shrink-0 self-center text-red-500" />
                  )} */}

                  {/* <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                  {item.change}
                </p> */}

              </dd>
            </div>
            <div
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-4 shadow ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <dt>
                <div className="absolute rounded-md bg-orange-50 p-3">
                  <UserGroupIcon aria-hidden="true" className="size-6 text-orange-800" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">Total Staff</p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{staffCount}</p>
                {/* <p
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
                </p> */}

              </dd>
            </div>
            <div
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-4 shadow ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <dt>
                <div className="absolute rounded-md bg-orange-50 p-3">
                  <CurrencyRupeeIcon aria-hidden="true" className="size-6 text-orange-800" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">Total Fee Collection</p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{feeCollection}</p>
                {/* <p
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
                </p> */}

              </dd>
            </div>
            <div
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-4 shadow ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <dt>
                <div className="absolute rounded-md bg-orange-50 p-3">
                  <DocumentCurrencyRupeeIcon aria-hidden="true" className="size-6 text-orange-800" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">Expences</p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{expenses}</p>
                {/* <p
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
                </p> */}

              </dd>
            </div>
          </dl>
        </div>


        {/* Quick Action cards */}
        <div className='quick-a-cards'>
          <div className='flex justify-between items-center pb-2 pt-2'>
            <div className='text-lg text-gray-900 font-medium'>Quick Actions</div>
            <div className='flex'>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="flex px-2 py-2 text-sm font-medium text-purple-500">
                    <PlusIcon aria-hidden="true" className="size-5" />Configure

                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="max-h-[430px] overflow-y-auto absolute right-0 z-10 mt-2 px-4 py-4 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="grid gap-3 ">

                    <MenuItem className='pointer'>
                      <div>
                        <input
                          defaultChecked
                          id="Add New Student"
                          name="Add New Student"
                          type="checkbox"
                          aria-describedby="Add New Student-description"
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                        />
                        <label htmlFor="Add New Student" className="pl-2 text-gray-900">
                          Add New Student
                        </label>
                      </div>
                    </MenuItem>
                    <MenuItem>
                      <div>
                        <input
                          defaultChecked
                          id="Add New Student"
                          name="Add New Student"
                          type="checkbox"
                          aria-describedby="Add New Student-description"
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-600" />
                        <label htmlFor="Add New Student" className="pl-2 text-gray-900">
                          Add New Staff
                        </label>
                      </div>
                    </MenuItem>
                    <MenuItem>
                      <div>
                        <input
                          defaultChecked
                          id="Add New Student"
                          name="Add New Student"
                          type="checkbox"
                          aria-describedby="Add New Student-description"
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-600" />
                        <label htmlFor="Add New Student" className="pl-2 text-gray-900">
                          Add New Staff
                        </label>
                      </div>
                    </MenuItem>
                    <MenuItem>
                      <div>
                        <input

                          id="Add New Student"
                          name="Add New Student"
                          type="checkbox"
                          aria-describedby="Add New Student-description"
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-600" />
                        <label htmlFor="Add New Student" className="pl-2 text-gray-900">
                          Add Attendance
                        </label>
                      </div>
                    </MenuItem>
                    <MenuItem>
                      <div className="flex">
                        <button
                          type="button"

                          className="w-1/2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className=" w-1/2 ml-4 inline-flex justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                        >
                          Save
                        </button>
                      </div>
                    </MenuItem>


                  </div>
                </MenuItems>
              </Menu>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="flex px-2 py-2 text-sm font-medium text-purple-500">
                    View All

                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="max-h-[430px] overflow-y-auto absolute right-0 z-10 mt-2 px-4 py-4 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="grid gap-3 ">

                    <MenuItem className='pointer'>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        Add New Student
                      </a>

                    </MenuItem>
                    <MenuItem className='pointer'>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        Add New Staff
                      </a>
                    </MenuItem>
                    <MenuItem className='pointer'>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        Add Attendance
                      </a>
                    </MenuItem>
                    <MenuItem className='pointer'>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        View Exam Results
                      </a>
                    </MenuItem>
                    <MenuItem className='pointer'>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        Add Marks
                      </a>
                    </MenuItem>
                    <MenuItem className='pointer'>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        Collect Fee
                      </a>
                    </MenuItem>
                    <MenuItem className='pointer'>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        Add Expences & Staff Loans
                      </a>
                    </MenuItem>
                    <MenuItem className='pointer'>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        Send SMS
                      </a>
                    </MenuItem>
                    <MenuItem className='pointer'>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        Daily Report
                      </a>
                    </MenuItem>
                    <MenuItem className='pointer'>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        Classes
                      </a>
                    </MenuItem>





                  </div>
                </MenuItems>
              </Menu>
            </div>
          </div>

          <dl className="flex overflow-x-scroll gap-4">
            {qucickactions.map((item) => (
              <div
                key={item.id}
                className="relative cursor-pointer w-fit rounded-lg bg-white px-2 py-2 shadow ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => {dispatch(setActiveMenu(item.action));navigate(`/${item.action}`, {state: {openModel: true}})}}
              >
                <dt className='flex items-center'>
                  <div className="rounded-full bg-purple-100 p-2">
                    <item.icon aria-hidden="true" className="size-5 text-purple-800" />
                  </div>
                  <p className="ml-4 truncate text-sm font-medium text-gray-900">{item.name}</p>
                </dt>

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
                    <Legend iconType="circle" />
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
                    <span>Attendance</span>
                  </div>
                </div>
                <div className='flex gap-x-4'>

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
                  <a href='#' className='text-gray-400'>
                    <ArrowUpRightIcon aria-hidden="true" className="size-5" />
                  </a>
                </div>

              </div>
              <div className="px-6 py-4 text-sm/6" style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={schoolattendance}
                    margin={{
                      top: 0,
                      right: 0,
                      left: 0,
                      bottom: 0,
                    }}
                    barSize={10}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend iconType="circle" />
                    <Bar
                      dataKey="percentage"
                      fill="#4ade80"
                      activeBar={<Rectangle fill="#15803d" stroke="#15803d" />}
                    />

                  </BarChart>
                </ResponsiveContainer>
              </div>
            </li>

            <li key='12' className="col-span-1.5 overflow-hidden rounded-xl border border-gray-300">
              <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                <div className='flex items-center item-title-blk'>
                  <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                    <ClipboardDocumentCheckIcon aria-hidden="true" className="size-5" />
                  </div>
                  <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
                    <span>Events</span>
                  </div>
                </div>
                <a href='#' className='text-gray-400'>
                  <ArrowUpRightIcon aria-hidden="true" className="size-5" />
                </a>
              </div>
              <div className="px-4 py-4 text-sm/6" style={{ width: "100%", height: 200 }}>
                <ul role="list" className="divide-y divide-gray-200">
                  {events.map((events) => (
                    <li key={events.title} className="flex items-center justify-between gap-x-6 py-2">
                      <div className="flex min-w-0 gap-x-4">
                        <img alt="" src={events.imageUrl} className="size-10 flex-none rounded-md bg-gray-50" />
                        <div className="min-w-0 flex-auto">
                          <p className="font-medium text-gray-900">{events.title}</p>
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            {events.date}
                          </span>
                        </div>
                      </div>


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
                    <span>Class Performance</span>
                  </div>
                </div>
                <a href='#' className='text-gray-400'>
                  <ArrowUpRightIcon aria-hidden="true" className="size-5" />
                </a>
              </div>

              <div className="px-4 py-4 pb-12 text-sm/6" style={{ width: "100%", height: 320 }}>
                <div className='flex gap-x-4'>
                  <select
                    id="location"
                    name="location"
                    defaultValue="All Classes"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                  >
                    <option>Class 1</option>
                    <option>Class 2</option>
                    <option>Class 3</option>
                  </select>
                  <select
                    id="location"
                    name="location"
                    defaultValue="All Sections"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                  >
                    <option>Section A</option>
                    <option>Section B</option>
                    <option>Section C</option>
                  </select>
                  <select
                    id="location"
                    name="location"
                    defaultValue="Half Yearly"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm/6"
                  >
                    <option>Unit 1</option>
                    <option>Unit 2</option>
                    <option>Unit 3</option>
                  </select>
                </div>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={classperformance}
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
                      {classperformance.map((entry, index) => (
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

            <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
              <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                <div className='flex items-center item-title-blk'>
                  <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                    <ClipboardDocumentCheckIcon aria-hidden="true" className="size-5" />
                  </div>
                  <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
                    <span>Exams Results</span>
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

                  <li className="flex items-center justify-between gap-x-6 py-2">
                    <div className="flex min-w-0 gap-x-4">
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm/6 font-semibold text-gray-900">Unit 4</p>
                        <p className="mt-1 truncate text-xs/5 text-gray-500">All Classes - Results Status</p>
                      </div>
                    </div>

                    <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                      Not Published
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-x-6 py-2">
                    <div className="flex min-w-0 gap-x-4">
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm/6 font-semibold text-gray-900">Unit 3</p>
                        <p className="mt-1 truncate text-xs/5 text-gray-500">All Classes - Results Status</p>
                      </div>
                    </div>

                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Pass: 88%
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-x-6 py-2">
                    <div className="flex min-w-0 gap-x-4">
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm/6 font-semibold text-gray-900">Unit 3</p>
                        <p className="mt-1 truncate text-xs/5 text-gray-500">All Classes - Results Status</p>
                      </div>
                    </div>

                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Pass: 80%
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-x-6 py-2">
                    <div className="flex min-w-0 gap-x-4">
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm/6 font-semibold text-gray-900">Unit 2</p>
                        <p className="mt-1 truncate text-xs/5 text-gray-500">All Classes - Results Status</p>
                      </div>
                    </div>

                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Pass: 9680%
                    </span>
                  </li>

                </ul>
              </div>
            </li>

          </ul>
        </div>

















      </div>


    </>
  )

}

export default Home
