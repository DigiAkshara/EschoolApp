'use client'
import {Button, Dialog} from '@headlessui/react'
import {PlusIcon} from '@heroicons/react/20/solid'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {getData} from '../../app/api'
import {setSelectedClass} from '../../app/reducers/classSlice'
import {NEW_CLASS} from '../../app/url'
import {boardOptions} from '../../commonComponent/CommonFunctions'
import FilterComponent from '../../commonComponent/FilterComponent'
import TableComponent from '../../commonComponent/TableComponent'
import AddClass from './AddClass'
import ManageViewClass from './ManageViewClass'

export default function Class() {
  const {
    classCategories,
    classes: classOptions,
    sections: sectionOptions,
    teachers: teacherOptions,
  } = useSelector((state) => state.academics)
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [selectedPeople, setSelectedPeople] = useState([])
  const [classData, setClassData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const dispatch = useDispatch() // Get the dispatch function
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getClassData();
  }, []); // Intentionally omit getClassData

  const getClassData = async () => {
    try {
      const response = await getData(NEW_CLASS)
      if (response && response.data) {
        // Map through the fetched data to replace the category value with its label
        const transformedData = response.data.data.map((item) => {
          return {
            ...item,
            categoryObject: item.category,
            category: item.category._id, // category Id, used for filters
            categoryName: item.category.name, // Use label or fallback to original value
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
              ? item.classTeacher.firstName + ' ' + item.classTeacher.lastName
              : 'N/A',
            totalStudents: item.totalStudents || 0,
            actions: [
              {label: 'Edit', actionHandler: onHandleEdit},
              {label: 'Delete', actionHandler: onDelete},
            ],
          }
        })
        setClassData(transformedData)
        setFilteredData(transformedData)
      }
    } catch (error) {
      console.error('Error fetching class data:', error)
    }
  }

  const onHandleEdit = async () => {
    console.log('edit')
  }

  const onDelete = () => {
    console.log('delete')
  }

  const handleClose = () => setOpen(false)
  const handleClose2 = () => setOpen2(false)

  const handleViewClick = (data) => {
    dispatch(setSelectedClass({...data, actions: null})) // Save selected class in Redux
    setOpen2(true) // Navigate to the "View More" page
  }

  const columns = [
    {key: 'board', title: 'Board'},
    {key: 'className', title: 'Class'},
    {key: 'sectionName', title: 'Section'},
    {key: 'totalStudents', title: 'Total Students'},
    {key: 'classTeacherName', title: 'Class Teacher'},
    {key: 'time_table', title: 'Time Table/ Syllabus'},
    {key: 'actions', title: 'Actions'},
  ]

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const filterForm = {
    board: '',
    category: '',
    class: '',
    section: '',
    classTeacher: '',
  }

  const filters = {
    board: {options: boardOptions},
    category: {options: classCategories},
    class: {
      options: classOptions,
      dependency: true,
      dependencyKey: 'category',
      filterOptions: true,
    },
    section: {
      options: sectionOptions,
      dependency: true,
      dependencyKey: 'class',
      filterOptions: true,
    },
    classTeacher: {options: teacherOptions},
  }

  const handleSearch = (term) => {
    const filtered = classData.filter((item) =>
      columns.some((col) =>
        String(item[col.key]).toLowerCase().includes(term.toLowerCase()),
      ),
    )
    setFilteredData(filtered)
  }

  const handleFilter = (values) => {
    let filtered = classData
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((rec) =>
          rec[key].toLowerCase().includes(value.toLowerCase()),
        )
      }
    })
    setFilteredData(filtered)
  }

  const handleReset = (updatedValues) => {
    setFilteredData(classData)
    updatedValues('category', '')
    updatedValues('class', '')
    updatedValues('section', '')
    updatedValues('classTeacher', '')
    updatedValues('board', '')
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  return (
    <>
      <div className="mt-4 flex justify-between">
        <div className="text-lg text-gray-900 font-medium">Classes</div>

        <div className="right-btns-blk space-x-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Add Class
          </button>
        </div>
      </div>

      <div className="filter-badges-blk mt-4 flex flex-wrap gap-x-4">
        <span className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          Class:<span className="font-bold">1</span>
          <button
            type="button"
            className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
          >
            <span className="sr-only">Remove</span>
            <svg
              viewBox="0 0 14 14"
              className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
            >
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>
        </span>
        <span className="inline-flex items-center gap-x-0.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          Section:<span className="font-bold">A</span>
          <button
            type="button"
            className="group relative -mr-1 size-3.5 rounded-sm hover:bg-gray-500/20"
          >
            <span className="sr-only">Remove</span>
            <svg
              viewBox="0 0 14 14"
              className="size-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
            >
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>
        </span>

        <Button className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
          Clear All
        </Button>
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
            <div className=" shadow ring-1 ring-black/5 sm:rounded-lg">
                <FilterComponent
                  onSearch={handleSearch}
                  filters={filters}
                  filterForm={filterForm}
                  handleFilter={handleFilter}
                  handleReset={handleReset}
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

      {/* Add Class */}

      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <div className="fixed inset-0" />
        <AddClass
          onClose={handleClose}
          classCategories={classCategories}
          classOptions={classOptions}
          sectionOptions={sectionOptions}
          teacherOptions={teacherOptions}
        />
      </Dialog>

      <Dialog open={open2} onClose={setOpen2} className="relative z-50">
        <ManageViewClass onClose={handleClose2} />
      </Dialog>
    </>
  )
}
