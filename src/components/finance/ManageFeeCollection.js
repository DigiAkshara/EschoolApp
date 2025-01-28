import { Dialog } from '@headlessui/react'
import {
  ArrowUpTrayIcon
} from '@heroicons/react/20/solid'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getData } from '../../app/api'
import { setFee } from '../../app/reducers/feeSlice'
import { STUDENT_FEE } from '../../app/url'
import { capitalizeWords, handleApiResponse } from '../../commonComponent/CommonFunctions'
import FilterComponent from '../../commonComponent/FilterComponent'
import TableComponent from '../../commonComponent/TableComponent'
import CollectFeeModal from './CollectFeeModal'


function ManageFeeCollection() {
  const [selectedPeople, setSelectedPeople] = useState([])
  const [studentFees, setStudentFee] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [showFeeModal, setShowFeeModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10
  const dispatch = useDispatch()

  const columns = [
    { key: 'name', title: 'Student Name' },
    { key: 'class', title: 'Class' },
    { key: 'payableAmount', title: 'Total Amount' },
    { key: 'pendingAmount', title: 'Pending Amount' },
    { key: 'paymentStatus', title: 'Status' },
    { key: 'phoneNo', title: 'Parent Mobile' },
    { key: 'reminder', title: 'Send Reminder' },
    { key: 'collectfee', title: 'Collect Fee' },
  ]

  const filterForm = {
    class: '',
    paymentStatus: ''
  }

  const filters = {
    class: { options: [] },
    paymentStatus: { options: [{ value: "paid", label: "Paid" }, { value: "pending", label: "Pending" }] }
  }

  useEffect(() => {
    getStudentData()
  }, [])

  const getStudentData = async () => {
    try {
      const response = await getData(STUDENT_FEE)
      const feedata = response.data.data // Access the correct array property
      const stuFees = []
      feedata.forEach((fee) => {
        let paidAmount = 0, payableAmount = 0
        fee.feeList.forEach((item) => {
          payableAmount = payableAmount + item.paybalAmount * 1
          paidAmount = paidAmount + (item.paidAmount * 1 || 0)
        })
        stuFees.push({
          _id: fee.student._id,
          name: capitalizeWords(fee.student.firstName + ' ' + fee.student.lastName),
          admissionNo: fee.student.admissionNumber,
          profilePic:fee.student.profilePic?.Location,
          phoneNo: fee.student.fatherDetails.mobileNumber,
          fatherName: fee.student.fatherDetails.name,
          gender: fee.student.gender,
          dob: fee.student.DOB,
          payableAmount: payableAmount,
          pendingAmount: payableAmount - paidAmount,
          paymentStatus: capitalizeWords(fee.paymentStatus),
          fees: fee.feeList,
          class: fee.class,
          className: fee.class?.name,
          reminder: "Reminder",
          collectfee: "Collect Fee"
        })

      })
      setStudentFee(stuFees)
      setFilteredData(stuFees)
    } catch (error) {
      handleApiResponse(error)
    }
  }

  const handleClose = () => setShowFeeModal(false)
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }
  const showFeeCollectionModal = (data) => {
    dispatch(setFee(data))
    setShowFeeModal(true)
  }

  const handleSearch = (term) => {
    const filtered = studentFees.filter((item) =>
      columns.some((col) =>
        String(item[col.key]).toLowerCase().includes(term.toLowerCase()),
      ),
    )
    setFilteredData(filtered)
  }

  const handleFilter = (values) => {
    let filtered = studentFees
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((rec) => {
          return rec[key].toLowerCase().includes(value.toLowerCase())
        }
        )
      }
    })
    setFilteredData(filtered)
  }
  const handleReset = (updatedValues) => {
    setFilteredData(studentFees)
    updatedValues('class', '')
    updatedValues('paymentStatus', '')
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  return (
    <>
      <div className="mt-4 flex justify-between">
        <div className="sm:hidden">
          {/* <label htmlFor="tabs2" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. 
          <select
            id="tabs2"
            name="tabs2"
            defaultValue={tabs2.find((tab) => tab.current).name}
            className="block w-full rounded-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          >
            {tabs2.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select> */}
        </div>
        <div className="hidden sm:block">
          {/* <nav aria-label="Tabs2" className="flex space-x-4">
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
          </nav> */}
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
            <div className="shadow ring-1 ring-black/5 sm:rounded-lg">
              {/*  filter component */}
              <FilterComponent
                onSearch={handleSearch}
                filters={filters}
                filterForm={filterForm}
                handleFilter={handleFilter}
                handleReset={handleReset}
              />
              <TableComponent
                columns={columns}
                data={paginatedData}
                pagination={{
                  currentPage,
                  totalCount: filteredData.length,
                  onPageChange: handlePageChange,
                }}
                showModal={showFeeCollectionModal}
                modalColumn={["collectfee"]}
              />

            </div>
          </div>
        </div>
        <Dialog open={showFeeModal} onClose={handleClose} className="relative z-50">
          <div className="fixed inset-0" />
          <CollectFeeModal onClose={handleClose} />
        </Dialog>
      </div>
    </>
  )
}

export default ManageFeeCollection
