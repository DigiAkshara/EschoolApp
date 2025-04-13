'use client'

import { ArrowUpTrayIcon, PlusIcon } from '@heroicons/react/20/solid'
import { useEffect, useRef, useState } from 'react'

import { Dialog } from '@headlessui/react'

import { useDispatch, useSelector } from 'react-redux'
import { deleteData, getData } from '../../app/api'
import { selectStaff, setSubjects } from '../../app/reducers/staffSlice'
import { STAFF, SUBJECT, TENANT } from '../../app/url'
import { capitalizeWords, designations, handleApiResponse, handleDownload, handleDownloadPDF } from '../../commonComponent/CommonFunctions'
import CommonUpload from '../../commonComponent/CommonUpload'
import ConfirmModal from '../../commonComponent/ConfirmationModal'
import FilterComponent from '../../commonComponent/FilterComponent'
import TableComponent from '../../commonComponent/TableComponent'
import Staff from './Staff'
import { setIsLoader } from '../../app/reducers/appConfigSlice'
import { useLocation } from 'react-router-dom'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const tabs2 = [
  { name: 'Teaching', type: 'teaching', href: '#', count: 0, current: true },
  { name: 'Non-teaching', type: "non-teaching", href: '#', count: 0, current: false },
]

export default function StaffDetails() {
  const subjects = useSelector((state) => state.staff?.subjects)
  const location = useLocation()
  const openModel = location.state?.openModel || false
  const [open2, setOpen2] = useState(false)
  const [selectedPeople, setSelectedPeople] = useState([])
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
  const [staffList, setStaffList] = useState([])
  const [staffCount, setStaffCount] = useState({ "teaching": 0, "non-teaching": 0 })
  const [staffType, setStaffType] = useState('teaching')
  const [filteredData, setFilteredData] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 5
  const dispatch = useDispatch()
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { branchData } = useSelector((state) => state.appConfig)


  const handleOpen = () => setShowAddStaffModal(true)
  const handleClose = () => { setShowAddStaffModal(false); dispatch(selectStaff(null)) }
  const handleClose2 = () => setOpen2(false)


  const getSubjects = async () => {
    try {
      const res = await getData(SUBJECT)
      const subjectsData = res.data.data.map((item) => {
        return {
          label: capitalizeWords(item.name), // Displayed text in the dropdown
          value: item._id,
        }
      })
      dispatch(setSubjects(subjectsData))
    } catch (error) {
      handleApiResponse(error)
    }
  }

  useEffect(() => {
    getSubjects()
    getStaff()
    if (openModel) {
      setShowAddStaffModal(true)
    }
  }, [dispatch])

  const columns = [
    { title: 'Staff Name', key: 'name' },
    { title: 'Staff Id', key: 'staffId' },
    { title: 'DOJ', key: 'date' },
    { title: 'Phone Number', key: 'phoneNumber' },
    { title: 'Designation', key: 'designationName' },
    { title: 'Subjects', key: 'subjectName' },
    { title: 'Actions', key: 'actions' },
  ]

  const getStaff = async () => {
    try {
      dispatch(setIsLoader(true))
      const response = await getData(STAFF)
      let teachingCount = 0;
      let nonTeachingCount = 0;
      const staffData = []
      response.data.data.forEach((item) => {
        if (item.staffType == 'teaching') {
          teachingCount = teachingCount + 1
        } else {
          nonTeachingCount = nonTeachingCount + 1
        }
        staffData.push({
          _id: item._id,
          pic: item.profilePic?.Location,
          name: capitalizeWords(item.firstName + ' ' + item.lastName),
          staffId: item.empId,
          date: item.DOJ,
          dateOfBirth: item.DOB,
          phoneNumber: item.mobileNumber,
          designationName: capitalizeWords(item.designation?.name),
          designation: item.designation._id,
          subjectName: item.subjects.map(item => item.label).join(', '),
          subjects: item.subjects.map(item => item.value).join(', '),
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
          presentAddress: `${item.presentAddress?.area}, ${item.presentAddress?.city}, ${item.presentAddress?.state} - ${item.presentAddress?.pincode}`,
          salary: item.amount,
          actions: [
            { label: 'Edit', actionHandler: onHandleEdit },
            { label: 'Delete', actionHandler: onDelete },
          ],
        })
      })
      setStaffCount({ "teaching": teachingCount, "non-teaching": nonTeachingCount })
      setStaffList(staffData)
      setFilteredData(staffData)
    } catch (error) {
      handleApiResponse(error)
    } finally {
      dispatch(setIsLoader(false))
    }

  }

  const onHandleEdit = async (Id) => {
    try {
      const staffDetails = await getData(STAFF + '/' + Id)
      dispatch(selectStaff({ ...staffDetails.data.data }))
      setShowAddStaffModal(true)
    } catch (error) {
      handleApiResponse(error)
    }
  }

  const onDelete = (Id) => {
    setDeleteId(Id)
    setDeleteConfirm(true)
  }

  const deleteRecord = async () => {
    try {
      let res = await deleteData(STAFF + '/' + deleteId)
      handleApiResponse(res.data.message, 'success')
      getStaff()
      setDeleteConfirm(false)
      setDeleteId(null)
    } catch (error) {
      handleApiResponse(error)
    }
  }

  const filterForm = {
    subjects: '',
    designation: ''
  }

  const filters = {
    subjects: { options: subjects },
    designation: { options: designations }
  }

  const handleSearch = (term) => {
    const filtered = staffList.filter((item) =>
      columns.some((col) =>
        String(item[col.key]).toLowerCase().includes(term.toLowerCase()),
      ),
    )
    setCurrentPage(1)
    setFilteredData(filtered)
  }


  const handleFilter = (values) => {
    let filtered = staffList
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((rec) => {
          return rec[key].toLowerCase().includes(value.toLowerCase())
        }
        )
      }
    })
    setCurrentPage(1)
    setFilteredData(filtered)
  }

  const handleReset = (updatedValues) => {
    setFilteredData(staffList)
    updatedValues('subjects', '')
    updatedValues('designation', '')
    setCurrentPage(1)
  }


  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const paginatedData = filteredData.filter(item => (item.staffType === staffType)).slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  const downloadListxlsx = () => {
    const schoolName = branchData?.label || "Unknown School";
    const schoolAddress = `${branchData?.address?.area || ""}, ${branchData?.address?.city || ""}, ${branchData?.address?.state || ""}, ${branchData?.address?.pincode || ""}`.trim();
    const phoneNumber = branchData?.mobileNumber || "N/A";
    const email = branchData?.email || "N/A";
    handleDownload(filteredData, "StaffList", schoolName, phoneNumber, email, schoolAddress, [
      { label: "Staff Name", key: "name" },
      { label: "Phone Number", key: "phoneNumber" },
      { label: "EmpId", key: "staffId" },
      { label: "Designation", key: "designationName" },
      { label: "Staff Type", key: "staffType" },
      { label: "DOJ", key: "date" },
      { label: "DOB", key: "dateOfBirth" },
      { label: "Guardian Name", key: "guardian" },
      { label: "Aadhar Number", key: "aadharNumber" },
      { label: "Subjects", key: "subjectName" },
      { label: "Present Address", key: "presentAddress" },
      { label: "Gender", key: "gender" },
    ]);
  };

  const downloadList = () => {
    handleDownloadPDF (filteredData, "Staff_Details", [
      { label: "Staff Name", key: "name" },
      { label: "Phone Number", key: "phoneNumber" },
      { label: "EmpId", key: "staffId" },
      { label: "Designation", key: "designationName" },
      { label: "Staff Type", key: "staffType" },
      { label: "DOJ", key: "date" },
      { label: "DOB", key: "dateOfBirth" },
      { label: "Guardian Name", key: "guardian" },
      { label: "Aadhar Number", key: "aadharNumber" },
      { label: "Subjects", key: "subjectName" },
      { label: "Present Address", key: "presentAddress" },
      { label: "Gender", key: "gender" },
    ], "Staff Details Report", branchData,  "landscape");
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
                key={tab.type}
                onClick={() => { setStaffType(tab.type) }}
                aria-current={tab.type === staffCount ? 'page' : undefined}
                className={classNames(
                  tab.type === staffType
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-500 hover:text-gray-700',
                  'rounded-full px-3 py-2 text-sm font-medium',
                )}
              >
                {tab.name}
                {staffCount[tab.type] ? (
                  <span
                    className={classNames(
                      tab.type === staffType
                        ? 'bg-white text-purple-600'
                        : 'bg-gray-300 text-gray-900',
                      'ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block',
                    )}
                  >
                    {staffCount[tab.type]}
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
              <FilterComponent
                onSearch={handleSearch}
                filters={filters}
                filterForm={filterForm}
                handleFilter={handleFilter}
                handleReset={handleReset}
                downloadList={downloadList}
                downloadListxlsv={downloadListxlsx}
                isDownloadDialog={true}
              />

              {/* Table View */}
              <TableComponent
                columns={columns}
                data={paginatedData}
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
      <ConfirmModal
        showModal={deleteConfirm}
        onYes={deleteRecord}
        onCancel={() => { setDeleteConfirm(false) }}
      />
      <Dialog open={showAddStaffModal} onClose={handleClose} className="relative z-50">
        <div className="fixed inset-0" />
        <Staff onClose={handleClose} getStaff={getStaff} />
      </Dialog>

      <Dialog open={open2} onClose={setOpen2} className="relative z-50">
        <CommonUpload onClose={handleClose2} user="staff" />
      </Dialog>
    </>
  )
}
