import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowLongUpIcon,
  ChatBubbleBottomCenterTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  PhoneIcon,
  TrashIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import moment from 'moment'

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
const studentInfotabs = [
  { name: 'Overview', href: '#', current: true },
  { name: 'Personal Details', href: '#', current: false },
  { name: 'Academic Details', href: '#', current: false },
  { name: 'Fee details', href: '#', current: false },
]

const StudentProfileModal = ({ data, show, close }) => {
  return (
    <Dialog open={show} onClose={close} className="relative z-50">
      <div className="fixed inset-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-6xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                <div className="flex min-h-0 flex-1 flex-col ">
                  <div className="bg-purple-900 px-3 py-3 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className=" text-base font-semibold text-white">
                        Student Info
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => close()}
                          className="relative rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6 overflow-y-auto">
                    <div className="student-big-card-blk">
                      <div className="flex w-full justify-between space-x-6 p-6 col-span-1 rounded-lg bg-white shadow border border-gray-300">
                        <img
                          alt=""
                          src={data?.pic}
                          className="size-36 shrink-0 rounded-full bg-gray-300"
                        />
                        <div className="flex-1 truncate">
                          <div className="flex justify-between space-x-3">
                            <h3 className="truncate text-lg font-medium text-gray-900">
                              {data?.name}
                            </h3>
                            <div className="right-contact-btns grid grid-cols-2 gap-4">
                              <button
                                type="button"
                                className="rounded bg-white px-2 py-1 text-xs font-semibold text-purple-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              >
                                <ChatBubbleBottomCenterTextIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              </button>
                              <button
                                type="button"
                                className="rounded bg-white px-2 py-1 text-xs font-semibold text-purple-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              >
                                <PhoneIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              </button>
                            </div>
                          </div>
                          <div className="student-hdr-info-items-blk mt-2">
                            <dl className="grid grid-flow-col auto-cols-min gap-8">
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Academic year
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  2023-2024
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Admission No
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {data?.admissionNo}
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Class & Section
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {data?.className} / {data?.section}
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Roll No
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  12
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">DOB</dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {moment(data?.date).format('DD-MM-YYYY')}
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Gender
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  {data?.gender}
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm/6 text-gray-500">
                                  Class Teacher
                                </dt>
                                <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">
                                  John Deakin
                                </dd>
                              </div>
                            </dl>
                          </div>
                          <div className="action-btns-blk mt-4 grid grid-flow-col auto-cols-min gap-4">
                            <button
                              type="button"
                              className="inline-flex items-center rounded gap-x-1.5 bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                            >
                              <ArrowLongUpIcon
                                aria-hidden="true"
                                className="size-5"
                              />
                              Promote
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center rounded gap-x-1.5 bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                            >
                              <ArrowLeftStartOnRectangleIcon
                                aria-hidden="true"
                                className="size-5"
                              />
                              Exit
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center rounded gap-x-1.5 bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                            >
                              <PencilIcon
                                aria-hidden="true"
                                className="size-5"
                              />
                              Edit
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center rounded gap-x-1.5 bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                            >
                              <TrashIcon
                                aria-hidden="true"
                                className="size-5"
                              />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-content">
                      <div>
                        <div className="sm:hidden">
                          <label
                            htmlFor="tabsstudentInfotabs"
                            className="sr-only"
                          >
                            Select a tab
                          </label>
                          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                          <select
                            id="studentInfotabs"
                            name="studentInfotabs"
                            defaultValue={
                              studentInfotabs.find((tab) => tab.current).name
                            }
                            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                          >
                            {studentInfotabs.map((tab) => (
                              <option key={tab.name}>{tab.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="hidden sm:block">
                          <div className="border-b border-gray-200">
                            <nav
                              aria-label="Tabs"
                              className="-mb-px flex space-x-8"
                            >
                              {studentInfotabs.map((tab) => (
                                <a
                                  key={tab.name}
                                  href={tab.href}
                                  aria-current={
                                    tab.current ? 'page' : undefined
                                  }
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

                      <div className="student-tab-info-blk py-4">
                        {/* Overview Tab content 
                            <ul role="list" className="grid grid-cols-3 gap-x-6 gap-y-8">
                                <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                                  <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                                    <div className='flex items-center item-title-blk'>
                                        <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                                          <ClipboardDocumentCheckIcon aria-hidden="true" className="size-5" />
                                        </div>
                                        <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
                                          <span>Attendance</span>
                                          <span className='text-xs text-gray-500'>Total Days<span className='pl-2 font-medium text-gray-900'>180</span></span>
                                        </div>
                                    </div>
                                    <a href='#' className='text-gray-400'>
                                      <ArrowUpRightIcon aria-hidden="true" className="size-5" />
                                    </a>
                                  </div>

                                  <div className="px-4 py-4 text-sm/6" style={{ width: "100%", height: 200 }}>
                                    <ResponsiveContainer>
                                      <PieChart>
                                          <Pie  
                                            data={graphdata}
                                            cx={120}
                                            cy={80}
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
                                            layout="vertical"
                                            align="right"
                                            verticalAlign="middle"
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
                                        <div className="text-lg pl-4 font-medium text-gray-900">Contact Details</div>
                                    </div>
                                    <a href='#' className='text-gray-400'>
                                      <ArrowUpRightIcon aria-hidden="true" className="size-5" />
                                    </a>
                                  </div>

                                  <div className="px-6 py-4 text-sm/6">
                                    <div className="flex justify-between gap-x-4 py-3">
                                      <dl className="grid gap-4">
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Father Name & Mobile</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Satya Murthy | 912345678</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Mother Name & Mobile</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Rama Lakshmi | 912345644</dd>
                                        </div>
                                      </dl>
                                    </div>
                                  </div>
                                </li>
                                <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                                  <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                                    <div className='flex items-center item-title-blk'>
                                        <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                                          <ClipboardDocumentCheckIcon aria-hidden="true" className="size-5" />
                                        </div>
                                        <div className="flex flex-col text-lg pl-4 font-medium text-gray-900">
                                          <span>Fee Details</span>
                                          <span className='text-xs text-gray-500'>Total Fee<span className='pl-2 font-medium text-gray-900'>18000</span></span>
                                        </div>
                                    </div>
                                    <a href='#' className='text-gray-400'>
                                      <ArrowUpRightIcon aria-hidden="true" className="size-5" />
                                    </a>
                                  </div>

                                  <div className="px-6 py-4 text-sm/6">
                                  <div className="px-4 py-4 text-sm/6" style={{ width: "100%", height: 200 }}>
                                    <ResponsiveContainer>
                                      <PieChart>
                                          <Pie  
                                            data={graphdata2}
                                            cx={120}
                                            cy={80}
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={0}
                                            dataKey="value"
                                            legendType='circle'
                                            label
                                          >
                                            {graphdata.map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={GraphCOLORS2[index % GraphCOLORS.length]} />
                                            ))}
                                            <Label fontSize="18" width={30} position="center">
                                            80%
                                            </Label>
                                          </Pie>
                                          <Legend
                                            layout="vertical"
                                            align="right"
                                            verticalAlign="middle"
                                          />
                                      </PieChart>
                                      </ResponsiveContainer>
                                  </div>
                                  </div>
                                </li>
                                <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                                  <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                                    <div className='flex items-center item-title-blk'>
                                        <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                                          <ClipboardDocumentCheckIcon aria-hidden="true" className="size-5" />
                                        </div>
                                        <div className="text-lg pl-4 font-medium text-gray-900">Marks Scored</div>
                                    </div>
                                    <a href='#' className='text-gray-400'>
                                      <ArrowUpRightIcon aria-hidden="true" className="size-5" />
                                    </a>
                                  </div>

                                  <div className="px-6 py-4 text-sm/6" style={{ width: "100%", height: 200 }}>
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
                                      <Tooltip />
                                      <Bar
                                        dataKey="marks"
                                        fill="#4ade80"
                                        activeBar={<Rectangle fill="#15803d" stroke="#15803d" />}
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
                                        <div className="text-lg pl-4 font-medium text-gray-900">Transport Details</div>
                                    </div>
                                    <a href='#' className='text-gray-400'>
                                      <ArrowUpRightIcon aria-hidden="true" className="size-5" />
                                    </a>
                                  </div>

                                  <div className="px-6 py-4 text-sm/6">
                                    <div className="flex justify-between gap-x-4 py-3">
                                      <dl className="grid gap-4">
                                        
                                        <div className='grid grid-cols-2 gap-4'>
                                          
                                          <div className="content-item pb-2 border-b border-gray-300">
                                            <dt className="text-sm/6 text-gray-500">Transport allocated Date</dt>
                                            <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">22-07-2024</dd>
                                          </div>
                                          <div className="content-item pb-2 border-b border-gray-300">
                                            <dt className="text-sm/6 text-gray-500">Bus Fee</dt>
                                            <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">5000</dd>
                                          </div>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                            <dt className="text-sm/6 text-gray-500">Pickup Location</dt>
                                            <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Ram Nagar, Street 5</dd>
                                          </div>

                                      </dl>
                                      
                                    </div>
                                    
                                  </div>
                                </li>
                                <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                                  <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                                    <div className='flex items-center item-title-blk'>
                                        <div className='inline-flex rounded-lg p-3 bg-teal-50 text-teal-700 ring-4 ring-white'>
                                          <ClipboardDocumentCheckIcon aria-hidden="true" className="size-5" />
                                        </div>
                                        <div className="text-lg pl-4 font-medium text-gray-900">Hostel Details</div>
                                    </div>
                                    <a href='#' className='text-gray-400'>
                                      <ArrowUpRightIcon aria-hidden="true" className="size-5" />
                                    </a>
                                  </div>

                                  <div className="px-6 py-4 text-sm/6">
                                    <div className="flex justify-between gap-x-4 py-3">
                                      <dl className="grid gap-4">
                                        
                                        
                                        <div className="content-item pb-2 border-b border-gray-300">
                                            <dt className="text-sm/6 text-gray-500">Hostel allocated Date</dt>
                                            <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">22-07-2024</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                            <dt className="text-sm/6 text-gray-500">Hostel Room & Bed Details</dt>
                                            <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Hostel 1 \ Room 501 | 2 Bed</dd>
                                        </div>

                                      </dl>
                                      
                                    </div>
                                    
                                  </div>
                                </li>
                            </ul>*/}

                        {/* Personal Details 
                            <ul role="list" className="grid grid-cols-1 gap-x-4 gap-y-4">
                                <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                                  <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                                    <div className='flex items-center item-title-blk'>
                                        <div className='inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white'>
                                          <UserCircleIcon aria-hidden="true" className="size-5" />
                                        </div>
                                        <div className="text-lg pl-4 font-medium text-gray-900">Personal Details</div>
                                    </div>
                                  </div>

                                  <div className="px-4 py-4 text-sm/6">
                                    
                                      <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">DOB</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">12-10-2014</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Gender</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Female</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Nationality</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Indian</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Religion</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Hindu</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Cast</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">BC-B</dd>
                                        </div>
                                        
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Blood Group</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">AB+</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Aadhar Number</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">12345678</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Aadhar Card</dt>
                                          <dd className="mt-1 text-base text-purple-500 sm:mt-2 font-medium">
                                            
                                            <a href='#'>View Aadhar</a> 
                                          
                                          </dd>
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
                                        <div className="text-lg pl-4 font-medium text-gray-900">Father Details</div>
                                    </div>
                                  </div>

                                  <div className="px-4 py-4 text-sm/6">
                                      <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Father Full Name</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Satya Murthy</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Mobile Number</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">912345678</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Email</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">satyam@gmail.com</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Occupation</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Private Employee</dd>
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
                                        <div className="text-lg pl-4 font-medium text-gray-900">Father Details</div>
                                    </div>
                                  </div>

                                  <div className="px-4 py-4 text-sm/6">
                                      <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Father Full Name</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Satya Murthy</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Mobile Number</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">912345678</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Email</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">satyam@gmail.com</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Occupation</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Private Employee</dd>
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
                                        <div className="text-lg pl-4 font-medium text-gray-900">Mother Details</div>
                                    </div>
                                  </div>

                                  <div className="px-4 py-4 text-sm/6">
                                      <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Mother Full Name</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Rama Lakshmi</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Mobile Number</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">912345678</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Email</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">satyam@gmail.com</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Occupation</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Private Employee</dd>
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
                                        <div className="text-lg pl-4 font-medium text-gray-900">Present Address Details</div>
                                    </div>
                                  </div>

                                  <div className="px-4 py-4 text-sm/6">
                                      <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Area</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Ram Nagar</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">City</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Hyderabad</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">State</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Telangana</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Pincode</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">500081</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">ID Proofs </dt>
                                          <dd className="mt-1 text-base text-purple-500 sm:mt-2 font-medium">
                                            <a href='#'>View ID Proofs </a>
                                          </dd>
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
                                        <div className="text-lg pl-4 font-medium text-gray-900">Permanent Address Details</div>
                                    </div>
                                  </div>

                                  <div className="px-4 py-4 text-sm/6">
                                      <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Area</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Ram Nagar</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">City</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Hyderabad</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">State</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Telangana</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Pincode</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">500081</dd>
                                        </div>
                                        
                                      </dl>
                                  </div>
                                </li>
                            </ul>*/}

                        {/* Academic Details 
                            <ul role="list" className="grid grid-cols-1 gap-x-4 gap-y-4">
                                <li key='12' className="overflow-hidden rounded-xl border border-gray-300">
                                  <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                                    <div className='flex items-center item-title-blk'>
                                        <div className='inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white'>
                                          <UserCircleIcon aria-hidden="true" className="size-5" />
                                        </div>
                                        <div className="text-lg pl-4 font-medium text-gray-900">Present Academic Details</div>
                                    </div>
                                  </div>

                                  <div className="px-4 py-4 text-sm/6">
                                    
                                      <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Academic year</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">2023-2024</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Date Of Admission</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">21-10-2022</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Admission Number</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">12345678 </dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Class & Section</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">1/A</dd>
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
                                        <div className="text-lg pl-4 font-medium text-gray-900">Exams & Marks</div>
                                    </div>
                                  </div>

                                  <div className="px-4 py-4 text-sm/6">
                                    
                                  <table className="min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
                                    <thead className="bg-purple-100">
                                      <tr>
                                        
                                        <th scope="col" className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2">
                                          <a href="#" className="group inline-flex">
                                          Exam Name
                                          </a>
                                        </th>
                                                                            
                                        <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900">
                                          <a href="#" className="group inline-flex">
                                          Exam Date
                                          </a>
                                        </th>
                                        <th scope="col" className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900">
                                          <a href="#" className="group inline-flex">
                                          Marks Scored
                                          </a>
                                        </th>
                                                                            
                                        <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900">
                                          <a href="#" className="group inline-flex">
                                          Grade
                                          </a>
                                        </th>
                                        <th scope="col" className="px-2 py-2 text-left text-sm font-semibold text-gray-900">
                                          <a href="#" className="group inline-flex">
                                          Progress Card
                                          </a>
                                        </th>
                                        
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        <tr>
                                          
                                          
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">Unit I</td>
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">22-10-2024  - 24-10-2024</td>
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">88%</td>
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">A</td>
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500"><a href='#' >View</a></td>
                                          
                                        </tr>
                                        
                                        <tr>
                                          
                                          
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">Unit I</td>
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">22-10-2024  - 24-10-2024</td>
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">88%</td>
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">A</td>
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500"><a href='#' >View</a></td>
                                          
                                        </tr>

                                        <tr>
                                          
                                          
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">Unit I</td>
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">22-10-2024  - 24-10-2024</td>
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">88%</td>
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">A</td>
                                          <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500"><a href='#' >View</a></td>
                                          
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
                                        <div className="text-lg pl-4 font-medium text-gray-900">Previous Academic Details</div>
                                    </div>
                                  </div>

                                  <div className="px-4 py-4 text-sm/6">
                                    
                                      <dl className="grid auto-cols-auto grid-cols-4 gap-4 w-full">
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Year of study</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">2021-2022</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">School Name</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">Narayana School</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Class</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">UKG</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">Total Marks Scored</dt>
                                          <dd className="mt-1 text-base text-gray-700 sm:mt-2 font-medium">667</dd>
                                        </div>
                                        <div className="content-item pb-2 border-b border-gray-300">
                                          <dt className="text-sm/6 text-gray-500">TC</dt>
                                          <dd className="mt-1 text-base text-purple-500 sm:mt-2 font-medium"><a href='#'>View TC</a></dd>
                                        </div>
                                        
                                        
                                        
                                      </dl>
                                   
                                  </div>
                                </li>
                            </ul>*/}

                        {/* Fee details */}
                        <ul
                          role="list"
                          className="grid grid-cols-1 gap-x-4 gap-y-4"
                        >
                          <li
                            key="12"
                            className="overflow-hidden rounded-xl border border-gray-300"
                          >
                            <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                              <div className="flex items-center item-title-blk">
                                <div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
                                  <UserCircleIcon
                                    aria-hidden="true"
                                    className="size-5"
                                  />
                                </div>
                                <div className="text-lg pl-4 font-medium text-gray-900">
                                  Academic Fee Details
                                </div>
                              </div>
                            </div>

                            <div className="px-4 py-4 text-sm/6">
                              <table className="min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
                                <thead className="bg-purple-100">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Fee Name
                                      </a>
                                    </th>

                                    <th
                                      scope="col"
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Duration
                                      </a>
                                    </th>
                                    <th
                                      scope="col"
                                      className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Total Amont
                                      </a>
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Discount & Refund
                                      </a>
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Paid Amount
                                      </a>
                                    </th>

                                    <th
                                      scope="col"
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Pending Balance
                                      </a>
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Due Date
                                      </a>
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Status
                                      </a>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                  <tr>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      Admission Fee
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      2 Installments
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      1000
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      0
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      500
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      500
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      22-10-2024
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                                        Pending
                                      </span>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      Book Fee
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      One TIme
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      1000
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      200 Discount
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      800
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      0
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      -
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                        Paid
                                      </span>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      Tution Fee
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      2 Installments
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      1000
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      0
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      500
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      500
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      22-10-2024
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                                        Pending
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </li>

                          <li
                            key="12"
                            className="overflow-hidden rounded-xl border border-gray-300"
                          >
                            <div className="flex items-center justify-between gap-x-4 px-4 pt-4">
                              <div className="flex items-center item-title-blk">
                                <div className="inline-flex rounded-lg p-3 bg-teal-50 text-purple-500 ring-4 ring-white">
                                  <UserCircleIcon
                                    aria-hidden="true"
                                    className="size-5"
                                  />
                                </div>
                                <div className="text-lg pl-4 font-medium text-gray-900">
                                  Fee History
                                </div>
                              </div>
                            </div>

                            <div className="px-4 py-4 text-sm/6">
                              <table className="min-w-full table-fixed divide-y divide-gray-300 border border-gray-300 rounded-md">
                                <thead className="bg-purple-100">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Transaction ID
                                      </a>
                                    </th>

                                    <th
                                      scope="col"
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Paid Date
                                      </a>
                                    </th>
                                    <th
                                      scope="col"
                                      className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Payment Mode
                                      </a>
                                    </th>

                                    <th
                                      scope="col"
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Fee Types & Paid Amount
                                      </a>
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Total Paid
                                      </a>
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                                    >
                                      <a href="#" className="group inline-flex">
                                        Invoice
                                      </a>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                  <tr>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      1234546789966
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      22-10-2024{' '}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      UPI- Phonepay
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      Admission fee: 100, Bus Fee, 100,
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      200
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                                      <a href="#">View</a>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      1234546789966
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      22-10-2024{' '}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      UPI- Phonepay
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      Admission fee: 100, Bus Fee, 100,
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      200
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                                      <a href="#">View</a>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      1234546789966
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      22-10-2024{' '}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      UPI- Phonepay
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      Admission fee: 100, Bus Fee, 100,
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      200
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                                      <a href="#">View</a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center justify-between px-4 py-4 bg-gray-100">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> out of{' '}
                      <span className="font-medium">122</span> results
                    </p>
                  </div>
                  <div>
                    <nav
                      aria-label="Pagination"
                      className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    >
                      <a
                        href="#"
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon
                          aria-hidden="true"
                          className="size-5"
                        />
                      </a>

                      <a
                        href="#"
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon
                          aria-hidden="true"
                          className="size-5"
                        />
                      </a>
                    </nav>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default StudentProfileModal
