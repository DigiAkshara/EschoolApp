import {Dialog, Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react'
import {
  ArrowUpTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid'
import {
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
  FunnelIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline'
import React, {useEffect, useRef, useState} from 'react'
import {useDispatch} from 'react-redux'
import {getData} from '../../app/api'
import {setStuFees} from '../../app/reducers/stuFeesSlice'
import {STUDENTFEE} from '../../app/url'
import FinanceCollectFees from './FinanceCollectFees'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const tabs2 = [
  {name: 'Unpaid', href: '#', count: '122', current: true},
  {name: 'Overdue', href: '#', count: '4', current: false},
  {name: 'Paid ', href: '#', count: '4', current: true},
  {name: 'All', href: '#', count: '4', current: true},
]

const people = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
  // More people...
]

function ManageFeeCollection() {
  const [selectedPeople, setSelectedPeople] = useState([])
  const [studentFees, setStudentFee] = useState([])
  const [groupedFees, setGroupedFees] = useState({})
  const [open, setOpen] = useState(false)
  const [openN, setOpenN] = useState(false)

  const checkbox = useRef()
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    getStudentData()
  }, [])

  const getStudentData = async () => {
    try {
      const response = await getData(STUDENTFEE)
      console.log('Student fee data:', response.data)
      const feedata = response.data.data // Access the correct array property

      const stuFees = []

      feedata.forEach((fee) => {
        // Find the index of the student in the `stuFees` array
        let index = stuFees.findIndex(
          (f) => f.studentId.toString() === fee.student._id.toString(),
        )

        if (index !== -1) {
          // If the student already exists in `stuFees`, add the fee details
          stuFees[index].fees.push({
            feeInstallment: fee.feeInstallment,
            feeName: fee.fees.name,
            feeId: fee.fees._id,
            academicYear: fee.fees.academicYear,
            amount: fee.amount,
            disCount: fee.amount - fee.instalmentAmount,
            dueDate: fee.dueDate,
            instalmentAmount: fee.instalmentAmount,
            paymentStatus: fee.paymentStatus,
            status: fee.paymentStatus,
            paidAmount: fee.paidAmount,
            pendingAmount:
              fee.paymentStatus === 'paid' ? 0 : fee.instalmentAmount,
          })

          // Update the total amounts based on the payment status
          if (fee.paymentStatus === 'paid') {
            stuFees[index].fees[stuFees[index].fees.length - 1].paidAmount =
              fee.amount
          } else {
            stuFees[index].fees[stuFees[index].fees.length - 1].pendingAmount =
              fee.amount
          }
        } else {
          // If the student doesn't exist in `stuFees`, add a new student object
          stuFees.push({
            studentId: fee.student._id,
            name: `${fee.student.firstName} ${fee.student.lastName}`,
            admissionNo: fee.student.admissionNumber,
            phoneNo: fee.student.fatherDetails.mobileNumber,
            fatherName: fee.student.fatherDetails.name,
            gender: fee.student.gender,
            dob: new Date(fee.student.DOB).toLocaleDateString('en-CA'),
            fees: [
              {
                feeInstallment: fee.feeInstallment,
                feeName: fee.fees.name,
                feeId: fee.fees._id,
                academicYear: fee.fees.academicYear,
                amount: fee.amount,
                disCount: fee.fees?.disCount || 'N/A',
                dueDate: fee.dueDate,
                instalmentAmount: fee.instalmentAmount,
                paymentStatus: fee.paymentStatus,
                status: fee.paymentStatus,
                paidAmount: fee.paidAmount,
                pendingAmount: fee.instalmentAmount - fee.paidAmount,
              },
            ],
          })
        }
      })

      // Now you can display the `stuFees` array which will contain each student with their associated fees
      console.log('stuFees:', stuFees)
      setStudentFee(stuFees)
    } catch (error) {
      console.error('Error fetching student fee data:', error)
    }
  }

  function toggleAll() {
    setSelectedPeople(checked || indeterminate ? [] : people)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }

  const handleOpen = (studentFee) => {
    setOpenN(true)
    dispatch(setStuFees(studentFee))
  }
  const handleClose = () => setOpenN(false)

  return (
    <>
      <div className="mt-4 flex justify-between">
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
                  tab.current
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-500 hover:text-gray-700',
                  'rounded-full px-3 py-2 text-sm font-medium',
                )}
              >
                {tab.name}
                {tab.count ? (
                  <span
                    className={classNames(
                      tab.current
                        ? 'bg-white text-purple-600'
                        : 'bg-gray-300 text-gray-900',
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
        <div className="right-btns-blk space-x-4">
          <button
            type="button"
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <ArrowUpTrayIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Send Reminder
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
                  Promote
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                >
                  Exit
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                >
                  Delete
                </button>
              </div>
            )}
            <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              <div className="relative table-tool-bar z-30">
                <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-3 sm:px-4">
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative rounded-md  inline-block  ">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon
                            aria-hidden="true"
                            className="size-4 text-gray-400"
                          />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Search"
                          className="block w-full rounded-md border-0 py-1 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center rounded bg-white px-2 py-1 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        <ArrowDownTrayIcon
                          aria-hidden="true"
                          className="size-5"
                        />
                        Send Reminder
                      </button>
                    </div>

                    <div className="right-action-btns-blk space-x-4">
                      <button
                        type="button"
                        className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        <ArrowDownTrayIcon
                          aria-hidden="true"
                          className="size-5"
                        />
                      </button>

                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <MenuButton className="inline-flex items-center rounded bg-white px-2 py-1 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            <FunnelIcon aria-hidden="true" className="size-5" />
                            Filters
                          </MenuButton>
                        </div>

                        <MenuItems
                          transition
                          className="max-h-[430px] overflow-y-auto absolute right-0 z-10 mt-2 px-4 py-4 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                          <div className="grid gap-3 ">
                            <MenuItem className="group mb-2">
                              <div className="flex">
                                <FunnelIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                                <span className="pl-2">Select Filters</span>
                              </div>
                            </MenuItem>
                            <MenuItem>
                              <div className="">
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  Fee Name
                                </label>
                                <div className="mt-2">
                                  <select
                                    id="location"
                                    name="location"
                                    defaultValue="Fee Name Title"
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
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  Class
                                </label>
                                <div className="mt-2">
                                  <select
                                    id="location"
                                    name="location"
                                    defaultValue="Fee Name Title"
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
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  Section
                                </label>
                                <div className="mt-2">
                                  <select
                                    id="location"
                                    name="location"
                                    defaultValue="Fee Name Title"
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
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  Gender
                                </label>
                                <div className="mt-2">
                                  <select
                                    id="location"
                                    name="location"
                                    defaultValue="Fee Name Title"
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
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  Religion
                                </label>
                                <div className="mt-2">
                                  <select
                                    id="location"
                                    name="location"
                                    defaultValue="Fee Name Title"
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
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm/6 font-regular text-gray-900"
                                >
                                  Cast
                                </label>
                                <div className="mt-2">
                                  <select
                                    id="location"
                                    name="location"
                                    defaultValue="Fee Name Title"
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

                      <button
                        type="button"
                        className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        <Squares2X2Icon aria-hidden="true" className="size-5" />
                      </button>
                      <button
                        type="button"
                        className="rounded bg-purple-600 px-2 py-1 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                      >
                        <ListBulletIcon aria-hidden="true" className="size-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-container-main overflow-y-auto max-h-[56vh]">
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
                      <th
                        scope="col"
                        className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                      >
                        <a href="#" className="group inline-flex">
                          Student Name
                          <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon
                              aria-hidden="true"
                              className="size-4"
                            />
                          </span>
                        </a>
                      </th>

                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <a href="#" className="group inline-flex">
                          Class
                          <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon
                              aria-hidden="true"
                              className="size-4"
                            />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <a href="#" className="group inline-flex">
                          Total Fee
                          <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon
                              aria-hidden="true"
                              className="size-4"
                            />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <a href="#" className="group inline-flex">
                          Pending Fee
                          <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon
                              aria-hidden="true"
                              className="size-4"
                            />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <a href="#" className="group inline-flex">
                          Status
                          <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon
                              aria-hidden="true"
                              className="size-4"
                            />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <a href="#" className="group inline-flex">
                          Due Date
                          <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon
                              aria-hidden="true"
                              className="size-4"
                            />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <a href="#" className="group inline-flex">
                          Parent Mobile
                          <span className="ml-2 flex-none rounded text-gray-400 group-hover:bg-gray-200">
                            <ArrowsUpDownIcon
                              aria-hidden="true"
                              className="size-4"
                            />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <a href="#" className="group inline-flex">
                          Reminder
                        </a>
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <a href="#" className="group inline-flex">
                          Collect Fee
                        </a>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white z-1">
                    {studentFees.map((studentFee, index) => (
                      <tr key={studentFee.studentId} className="bg-gray-50">
                        <td className="relative px-7 sm:w-12 sm:px-6">
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-purple-600" />
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                          />
                        </td>
                        <td className="whitespace-nowrap py-2 pl-2 pr-3 text-sm sm:pl-0">
                          <div className="flex items-center">
                            <div className="size-9 shrink-0">
                              <img
                                alt=""
                                src="https://stu-images.mos.ap-southeast-2.sufybkt.com/1734344416163.jpeg"
                                className="size-9 rounded-full"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900 text-purple-600">
                                {studentFee.name}
                              </div>
                              <div className="mt-1 text-gray-500">
                                {studentFee.admissionNo}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {studentFee.class}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {studentFee.fees.reduce(
                            (acc, fee) => acc + fee.amount,
                            0,
                          )}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {studentFee.fees
                            .filter((fee) => fee.paymentStatus === 'pending')
                            .reduce((acc, fee) => acc + fee.amount, 0)}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {studentFee.fees.every(
                            (fee) => fee.paymentStatus === 'paid',
                          )
                            ? 'Paid'
                            : 'Pending'}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {studentFee.fees[0]?.dueDate?.split('T')[0]}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {studentFee.phoneNo}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          <button
                            type="button"
                            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                          >
                            Send
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          <button
                            type="button"
                            onClick={() => {
                              handleOpen(studentFee)
                            }}
                            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                          >
                            Collect Fees
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
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
                        Showing <span className="font-medium">1</span> to{' '}
                        <span className="font-medium">10</span> of{' '}
                        <span className="font-medium">97</span> results
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
                          <ChevronRightIcon
                            aria-hidden="true"
                            className="size-5"
                          />
                        </a>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Dialog open={openN} onClose={setOpenN} className="relative z-50">
          <div className="fixed inset-0" />

          <FinanceCollectFees onClose={handleClose} />
        </Dialog>
      </div>
    </>
  )
}

export default ManageFeeCollection
