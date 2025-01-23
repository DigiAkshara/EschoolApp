'use client'

import { ArrowUpTrayIcon, PlusIcon } from '@heroicons/react/20/solid'
import { useEffect, useRef, useState } from 'react'

import { Dialog } from '@headlessui/react'

import { useDispatch } from 'react-redux'
import { getData } from '../../app/api'
import { selectStaff } from '../../app/reducers/staffSlice'
import { STAFF } from '../../app/url'
import { designations, handleApiResponse, handleDownload } from '../../commonComponent/CommonFunctions'
import CommonUpload from '../../commonComponent/CommonUpload'
import TableComponent from '../../commonComponent/TableComponent'
import Staff from './Staff'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const tabs2 = [
  { name: 'Teachers', href: '#', count: '122', current: true },
  { name: 'Non-teaching Staff', href: '#', count: '20', current: false },
]

export default function StaffDetails() {
  const [open2, setOpen2] = useState(false)
  const [selectedPeople, setSelectedPeople] = useState([])
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
  const [staffList, setStaffList] = useState([])
  const [staffData, setStaffData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 5
  const [bulkUploadList, setBulkUploadList] = useState([])
  const fileInputRef = useRef(null);
  const dispatch = useDispatch()

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleOpen = () => setShowAddStaffModal(true)
  const handleClose = () => setShowAddStaffModal(false)
  const handleClose2 = () => setOpen2(false)

  useEffect(() => {
    getStaff()
  }, [])

  const columns = [
    { title: 'Staff Name', key: 'name' },
    { title: 'Staff Id', key: 'staffId' },
    { title: 'DOJ', key: 'date' },
    { title: 'Phone Number', key: 'phoneNumber' },
    { title: 'Designation', key: 'designation' },
    { title: 'Subjects', key: 'subjects' },
    { title: 'Class', key: 'class' },
    { title: 'Actions', key: 'actions' },
  ]

  const getStaff = async () => {
    try {
      const response = await getData(STAFF)
      setStaffData(response.data.data)
      let data = response.data.data.map((item, index) => ({
        _id: item._id,
        pic: item.profilePic?.Location,
        name: item.firstName + ' ' + item.lastName,
        staffId: item.empId,
        date: item.DOJ,
        phoneNumber: item.mobileNumber,
        designation: designations.find(
          (designations) => designations.value === item.designation,
        ).label,
        subjects: item.subjects?.name,
        class: item.class,
        staffType: item.staffType,
        guardian: item.guardian,
        email: item.email,
        workEmail: item.workEmail,
        gender: item.gender,
        permanentArea: item.permanentAddress?.area,
        permanentCity: item.permanentAddress?.city,
        permanentPincode: item.permanentAddress?.pincode,
        permanentState: item.permanentAddress?.state,
        presentArea: item.presentAddress?.area,
        presentCity: item.presentAddress?.city,
        presentPincode: item.presentAddress?.pincode,
        presentState: item.presentAddress?.state,
        aadharNumber: item.aadharNumber,
        aadharPic: item.aadharPic?.Location,
        panNumber: item.panNumber,
        panCardPic: item.panCardPic?.Location,
        accountNumber: item.bankDetails?.accountNumber,
        ifscCode: item.bankDetails?.ifscCode,
        bankName: item.bankDetails?.bankName,
        passBookPic: item.bankDetails?.passBookPic?.Location,

        salary: item.amount,
        actions: [
          { label: 'Edit', actionHandler: onHandleEdit },
          { label: 'Delete', actionHandler: onDelete },
        ],
      }))
      setStaffList(data)
      setFilteredData(data)
    } catch (error) {
      handleApiResponse(error)
    }

  }

  const onHandleEdit = (Id) => {
    const obj = staffData.filter(obj => obj._id == Id)
    dispatch(selectStaff({ ...obj[0], actions: undefined }))
    setShowAddStaffModal(true)
  }

  const onDelete = () => {
    console.log('delete')
  }

  const filters = [
    {
      key: 'age',
      label: 'Age Filter',
      options: [
        { value: '20-30', label: '20-30' },
        { value: '30-40', label: '30-40' },
      ],
    },
  ]

  const handleSearch = (term) => {
    const filtered = staffList.filter((item) =>
      columns.some((col) =>
        String(item[col.key]).toLowerCase().includes(term.toLowerCase()),
      ),
    )
    setFilteredData(filtered)
  }

  const handleFilter = (key, value) => {
    let filtered = staffList
    if (key === 'age' && value) {
      const [min, max] = value.split('-')
      filtered = staffList.filter(
        (item) => item.age >= parseInt(min) && item.age <= parseInt(max),
      )
    }
    setFilteredData(filtered)
  }


  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  const downloadList = () => {
    handleDownload(filteredData, "StaffList", ["_id", "pic", "actions"]);
  };




  return (
    <>
      {/* Secondary Tabs */}
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
            onClick={handleOpen}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Staff
          </button>

          <button
            type="button"
            onClick={() => setOpen2(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <ArrowUpTrayIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Bulk Upload Staff
          </button>
          <button
            type="button"
            onClick={downloadList}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <ArrowUpTrayIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Download
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
            <div className="shadow ring-1 ring-black/5 sm:rounded-lg">
              {/* <FilterComponent
                handleDownload={handleDownload}
                /> */}

              {/* Table View */}
              <TableComponent
                columns={columns}
                data={paginatedData}
                filters={filters}
                onSearch={handleSearch}
                onFilter={handleFilter}
                pagination={{
                  currentPage,
                  totalCount: filteredData.length,
                  onPageChange: handlePageChange,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Student Onboarding Modal */}

      <Dialog open={showAddStaffModal} onClose={handleClose} className="relative z-50">
        <div className="fixed inset-0" />
        <Staff onClose={handleClose} getStaff={getStaff} />
      </Dialog>

      <Dialog open={open2} onClose={setOpen2} className="relative z-50">
        <CommonUpload onClose2={handleClose2} user="staff" />
      </Dialog>
    </>
  )
}
