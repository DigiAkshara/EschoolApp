'use client'
import { Dialog } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/20/solid'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteData, getData } from '../../app/api'
import { setSelectedClass } from '../../app/reducers/classSlice'
import { NEW_CLASS, TIMETABLE } from '../../app/url'
import { capitalizeWords, handleApiResponse, handleDownloadPDF } from '../../commonComponent/CommonFunctions'
import ConfirmationModal from '../../commonComponent/ConfirmationModal'
import FilterComponent from '../../commonComponent/FilterComponent'
import TableComponent from '../../commonComponent/TableComponent'
import AddClassTimeTable from './AddClassTimeTable'
import ViewClassTimetable from './ViewClassTimetable'

export default function ClassTimeTable() {
  const {
    boards: boardOptions,
    classes: classOptions,
    sections: sectionOptions,
    teachers: teacherOptions,
  } = useSelector((state) => state.academics)
  const [showAddClassModal, setShowAddClassModal] = useState(false)
  const [showViewClassModal, setShowViewClassModal] = useState(false)
  const [selectedPeople, setSelectedPeople] = useState([])
  const [classData, setClassData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const dispatch = useDispatch() // Get the dispatch function
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10
  const { branchData } = useSelector((state) => state.appConfig)



  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getClassData();
  }, []); // Intentionally omit getClassData



  const getClassData = async () => {
    try {
      const response = await getData(NEW_CLASS)
      if (response && response.data) {
        // Map through the fetched data to replace the board value with its label
        const transformedData = response.data.data.map((item) => {
          return {
            ...item,
            boardObject: item.board,
            board: item.board._id, // board Id, used for filters
            boardName: item.board.name, // Use label or fallback to original value
            time_table: 'View',
            classObject: item.class,
            class: item.class._id, //class Id
            className: item.class.name,
            sectionObject: item.section,
            section: item.section._id, //section Id
            sectionName: item.section.section,
            classTeacherObject: item.classTeacher,
            classTeacher: item.classTeacher ? item.classTeacher._id : '', //classTeacher Id
            classTeacherName: item.classTeacher
              ? capitalizeWords(item.classTeacher.firstName + ' ' + item.classTeacher.lastName)
              : 'N/A',
            totalStudents: item.totalStudents || 0,
            actions: [
              { label: 'Edit', actionHandler: onHandleEdit },
              { label: 'Delete', actionHandler: onDelete },
            ],
          }
        })
        setClassData(transformedData)
        setFilteredData(transformedData)
      }
    } catch (error) {
      handleApiResponse(error)
    }
  }

  const onHandleEdit = async (Id) => {
    try {
      const res = await getData(TIMETABLE + '/' + Id)
      dispatch(setSelectedClass({ ...res.data.data })) // Save selected class in Redux
      setShowAddClassModal(true)
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
      let res = await deleteData(TIMETABLE + '/' + deleteId)
      handleApiResponse(res.data.message, 'success')
      getClassData()
      setDeleteConfirm(false)
      setDeleteId(null)
    } catch (error) {
      handleApiResponse(error)
    }
  }

  const handleClose = () => {
    setShowAddClassModal(false);
    setShowViewClassModal(false)
    dispatch(setSelectedClass(null))
  }

  const handleViewClick = (data) => {
    dispatch(setSelectedClass({ ...data, actions: null })) // Save selected class in Redux
    setShowViewClassModal(true) // Navigate to the "View More" page
  }

  const columns = [
    { key: 'boardName', title: 'Board' },
    { key: 'className', title: 'Class' },
    { key: 'sectionName', title: 'Section' },
    { key: 'totalStudents', title: 'Total Students' },
    { key: 'classTeacherName', title: 'Class Teacher' },
    { key: 'time_table', title: 'Time Table/ Syllabus' },
    { key: 'actions', title: 'Actions' },
  ]

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const filterForm = {
    board: '',
    class: '',
    section: '',
    classTeacher: '',
  }

  const filters = {
    board: { options: boardOptions },
    class: {options: classOptions},
    section: {
      options: sectionOptions,
      dependency: true,
      dependencyKey: 'class',
      filterOptions: true,
    },
    classTeacher: { options: teacherOptions },
  }

  const handleSearch = (term) => {
    const filtered = classData.filter((item) =>
      columns.some((col) => String(item[col.key]).toLowerCase().includes(term.toLowerCase())),
    )
    setFilteredData(filtered)
  }

  const handleFilter = (values) => {
    let filtered = classData
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((rec) => {
          return rec[key].toLowerCase().includes(value.toLowerCase())
        })
      }
    })
    setFilteredData(filtered)
  }

  const handleReset = (updatedValues) => {
    setFilteredData(classData)
    updatedValues('board', '')
    updatedValues('class', '')
    updatedValues('section', '')
    updatedValues('classTeacher', '')
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  const downloadList = () => {
    handleDownloadPDF(filteredData, "Class_Details", [
      { key: 'board', label: 'Board' },
      { key: 'className', label: 'Class' },
      { key: 'sectionName', label: 'Section' },
      { key: 'totalStudents', label: 'Total Students' },
      { key: 'classTeacherName', label: 'Class Teacher' },


    ], "Class Details Report", branchData, undefined, "portrait");
  };

  return (
    <>
      <div className="mt-4 flex justify-between">
        <div className="text-lg text-gray-900 font-medium">Classes</div>

        <div className="right-btns-blk space-x-4">
          <button
            type="button"
            onClick={() => setShowAddClassModal(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Class
          </button>
        </div>
      </div>

      <div className="-mx-2 -my-2 mt-0 sm:-mx-6">
        <div className="inline-block min-w-full py-4 align-middle sm:px-6">
          <div className="relative">
            {selectedPeople.length > 0 && (
              <div className="absolute left-20 top-0 flex h-12 items-center space-x-3 bg-white sm:left-72">
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
                modalColumn={["time_table"]}
                showModal={(data) => handleViewClick(data)}
              />
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        showModal={deleteConfirm}
        onYes={deleteRecord}
        onCancel={() => { setDeleteConfirm(false) }}
      />

      {/* Add Class */}

      <Dialog open={showAddClassModal} onClose={handleClose} className="relative z-50">
        <div className="fixed inset-0" />
        <AddClassTimeTable
          onClose={handleClose}
          getClassData={getClassData}
        />
      </Dialog>

      <Dialog open={showViewClassModal} onClose={handleClose} className="relative z-50">
        <ViewClassTimetable onClose={handleClose} />
      </Dialog>
    </>
  )
}
