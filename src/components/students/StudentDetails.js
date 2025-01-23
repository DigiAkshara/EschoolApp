import { Dialog } from '@headlessui/react'
import { ArrowUpTrayIcon, PlusIcon } from '@heroicons/react/20/solid'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getData } from '../../app/api'
import {
  fetchInitialStudentData,
  selectStudent,
} from '../../app/reducers/studentSlice'
import { ACADEMICS, STUDENT } from '../../app/url'
import { gender, handleDownload } from '../../commonComponent/CommonFunctions'
import FilterComponent from '../../commonComponent/FilterComponent'
import TableComponent from '../../commonComponent/TableComponent'
import Student from './Student'
import StudentProfileModal from './StudentProfileModal'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CommonUpload from '../../commonComponent/CommonUpload'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const tabs2 = [
  { name: 'Active', href: '#', count: '52', current: true },
  // {name: 'Drafts', href: '#', count: '12', current: false},
]

export default function StudentDetails() {
  const dispatch = useDispatch()
  const { classes: clsOptions, sections: sectionOptions } = useSelector((state) => state.students)
  const [studentList, setStudentList] = useState([])
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [filteredData, setFilteredData] = useState([])
  const [showProfile, setShowProfile] = useState(false)
  const [activeStudent, setActiveStudent] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10
  const [bulkUploadList, setBulkUploadList] = useState([])
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Trans Gender', value: 'transgender' },
  ]

  useEffect(() => {
    dispatch(fetchInitialStudentData())
    getStudents()
  }, [dispatch])

  const columns = [
    { title: 'Student Name', key: 'name' },
    { title: 'Admission Number', key: 'admissionNo' },
    { title: 'Class', key: 'className' },
    { title: 'Section', key: 'sectionName' },
    { title: 'Phone Number', key: 'phoneNumber' },
    { title: 'DOB', key: 'date' },
    { title: 'Aadhar Number', key: 'aadharNumber' },
    { title: 'Gender', key: 'gender' },
    { title: 'Actions', key: 'actions' },
  ]

  const getStudents = async () => {
    try {
      const student = await getData(ACADEMICS)
      const studentRes = student.data.data
      const studentData = studentRes.map((item) => {
        return {
          _id: item.student._id,
          pic: item.student.profilePic?.Location,
          name: item.student.firstName + ' ' + item.student.lastName,
          admissionNo: item.student.admissionNumber,
          className: item.class?.name,
          class: item.class?._id,
          section: item.section?._id,
          sectionName: item.section.section,
          phoneNumber: item.student.fatherDetails.mobileNumber,
          date: item.student.DOB,
          aadharNumber: item.student.aadharNumber,
          gender: gender.find((gender) => gender.value === item.student.gender)
            .label,

          dateOfBirth: item.student.DOB,
          aadharNumber: item.student.aadharNumber,
          fatherName: item.student.fatherDetails?.name,
          fatherMobile: item.student.fatherDetails?.mobileNumber,
          fatherOccupation: item.student.fatherDetails?.occupation || 'N/A',
          religion: item.student.religion,
          cast: item.student.cast,
          subCast: item.student.subCast,
          nationality: item.student.nationality,
          bloodGroup: item.student.bloodGroup,
          motherName: item.student.motherDetails?.name,
          motherMobile: item.student.motherDetails?.mobileNumber,
          motherOccupation: item.student.motherDetails?.occupation || 'N/A',
          presentArea: item.student.presentAddress?.area,
          presentCity: item.student.presentAddress?.city,
          presentState: item.student.presentAddress?.state,
          presentPincode: item.student.presentAddress?.pincode,
          permanentArea: item.student.permanentAddress?.area,
          permanentCity: item.student.permanentAddress?.city,
          permanentState: item.student.permanentAddress?.state,
          permanentPincode: item.student.permanentAddress?.pincode,
          previousSchool: item.student.previousSchool?.schoolName,
          previousClass: item.student.previousSchool?.classStudied,
          previousstudyProof: item.student.previousSchool?.studyProof,
          previousSchoolyearOfStudy: item.student.previousSchool?.yearOfStudy,
          actions: [
            { label: 'Edit', actionHandler: onHandleEdit },
            { label: 'Delete', actionHandler: onDelete },
          ],
        }
      })
      setStudentList(studentData)
      setFilteredData(studentData)
    } catch (error) {
      console.log(error)
    }
  }

  const onHandleEdit = async (studentId) => {
    const studentDetails = await getData(STUDENT + '/details/' + studentId)
    dispatch(selectStudent(studentDetails.data.data))
    setOpen(true)
  }

  const onDelete = () => {
    console.log('delete')
  }

  const handleOpen = () => { setOpen(true); dispatch(selectStudent(null)) }
  const handleClose = () => {setOpen(false); dispatch(selectStudent(null))}
  const handleClose2 = () => setOpen2(false)


  const filterForm = {
    class: '',
    section: '',
    gender: '',
  }

  const filters = {
    class: { options: clsOptions },
    section: {
      options: sectionOptions,
      dependency: true,
      dependencyKey: 'class',
      filterOptions: true,
    },
    gender: { options: genderOptions },
  }

  const handleSearch = (term) => {
    const filtered = studentList.filter((item) =>
      columns.some((col) =>
        String(item[col.key]).toLowerCase().includes(term.toLowerCase()),
      ),
    )
    setFilteredData(filtered)
  }

  const handleFilter = (values) => {
    let filtered = studentList
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
    setFilteredData(studentList)
    updatedValues('gender', '')
    updatedValues('class', '')
    updatedValues('section', '')
  }

  const handleAction = {
    edit: (item) => console.log('Edit:', item),
    delete: (item) => console.log('Delete:', item),
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const showStudentProfile = (data) => {
    setActiveStudent(data)
    setShowProfile(true)
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )


  const downloadList = () => {
    handleDownload(filteredData, "StudentList", ["class", "section", "actions"]);
  };



  return (
    <>
      {/* Secondary Tabs */}
      <div className="mt-4 flex justify-between">
        {/* active tab with count block */}
        <div className="sm:hidden">
          {/* <label htmlFor="tabs2" className="sr-only">
            Select a tab
          </label>
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
            onClick={handleOpen}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Student
          </button>

          <button
            type="button"
            onClick={() => setOpen2(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <ArrowUpTrayIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Bulk Upload Students
          </button>
        </div>
      </div>

      <div className="-mx-2 -my-2 mt-0 sm:-mx-6">
        <div className="inline-block min-w-full py-4 align-middle sm:px-6">
          <div className="relative">
            {/* {selectedPeople.length > 0 && (
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
            )} */}
            <div className="shadow ring-1 ring-black/5 sm:rounded-lg">
              <FilterComponent
                onSearch={handleSearch}
                filters={filters}
                filterForm={filterForm}
                handleFilter={handleFilter}
                handleReset={handleReset}
                downloadList={downloadList}
              />
                {/* Table View */}

                <TableComponent
                  columns={columns}
                  data={paginatedData}
                  onAction={[
                    { label: 'Edit', handler: handleAction.edit },
                    { label: 'Delete', handler: handleAction.delete },
                  ]}
                  pagination={{
                    currentPage,
                    totalCount: filteredData.length,
                    onPageChange: handlePageChange,
                  }}
                  showModal={showStudentProfile}
                />
                <StudentProfileModal
                  data={activeStudent}
                  show={showProfile}
                  close={() => {
                    setShowProfile(false)
                  }}
                />

            </div>
          </div>
        </div>
      </div>

      {/* Student Onboarding Modal */}

      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <div className="fixed inset-0" />
        <Student onClose={handleClose} loadStudents={getStudents} />
      </Dialog>
      <Dialog open={open2} onClose={setOpen2} className="relative z-50">
        <CommonUpload onClose2={handleClose2} user="student" />
      </Dialog>
    </>
  )
}
