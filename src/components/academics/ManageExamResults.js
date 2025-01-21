"use client";
import {
  MagnifyingGlassIcon
} from "@heroicons/react/20/solid";
import {
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { selectExam } from "../../app/reducers/examSlice";
import ExamMarkDetailsPage from "./ExamMarkDetailsPage";
import ManageExamMarks from "./ManageExamMarks";
import TableComponent from "../../commonComponent/TableComponent";
import FilterComponent from "../../commonComponent/FilterComponent";

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];

function ManageExamResults() {
  const { classes: classOptions, sections: sectionOptions,subjects } = useSelector(
    (state) => state.academics
  );
  const exams = useSelector((state) => state.exams.exams);
  const dispatch = useDispatch();
  const [selectedPeople, setSelectedPeople] = useState([]); 
  const [examData, setExamData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showAddMarksModal, setShowAddMarksModal] = useState(false);
  const [showExamDetailsModal, setShowExamDetailsModal] = useState(false);
  const [examOptions, setExamOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const columns = [
    { key: "examName", title: "Exam Name" },
    { key: "className", title: "Class" },
    { key: "sectionName", title: "Section" },
    { key: "examDates", title: "Exam Dates" },
    { key: "markStatus", title: "Marks Status" },
    { key: "passPercentage", title: "Pass Percentage" },
    { key: "results", title: "Results" }, 
  ];

  const filterForm = {
    examName: "",
    class: "",
    section: "",
  };

  const filters = {
    examName: { options: examOptions },
    class: {
      options: classOptions,
    },
    section: {
      options: sectionOptions,
      dependency: true,
      dependencyKey: "class",
      filterOptions: true,
    },
  };
  useEffect(() => {
    formatExamData();
  }, []);

  const getPercentage = (timeTable) => {
    const totalSubjects = timeTable.length;
    const passedSubjects = timeTable.filter(
      (subject) => subject.totalMark >= subject.passMark
    ).length;
    return ((passedSubjects / totalSubjects) * 100).toFixed(2);
  }

  const getSubjectName = (subject) => {
    const subjectOption = subjects.find((option) => option.value === subject);
    return subjectOption ? subjectOption.label : "";
  }

  const formatExamData = async () => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    let dumpList = []
    const data = exams.map((item, index) => {
      // Formatting the timeTable data
      const timeTableFormatted = item.timeTable.map((t) => ({
        subject: t.subject,
        subjectName: getSubjectName(t.subject),
        examDate: formatter.format(new Date(t.examDate)),
        startTime: t.startTime,
        endTime: t.endTime,
        passMark: t.passMark,
        totalMark: t.totalMark,
        syllabus: t.syllabus,
      }));
      dumpList.push({
        label:item.name,
        value:item.name
      })
      const isPassed = moment().isAfter(moment(item.endDate, "YYYY-MM-DD"));
      const markStatus =  isPassed ? item.examStatus?"Completed":"Pending" : "Not Yet Started";
      let passPercentage = "-"
      if(markStatus === "Completed"){
        passPercentage = getPercentage(item.timeTable)
      }
      return {
        id: index + 1,
        examName: item.name,
        category: item.classCategory?._id,
        categoryObject: item.classCategory,
        categoryName: item.classCategory?.name,
        class: item.class?._id,
        className: item.class?.name,
        classObject: item.class,
        section: item.section?._id,
        sectionName: item.section?.section,
        sectionObject: item.section,
        examDates: `${formatter.format(new Date(item.startDate))} - ${formatter.format(new Date(item.endDate))}`,
        board: item.board,
        timeTable: timeTableFormatted, // Add the formatted timeTable data
        markStatus:markStatus,
        passPercentage: passPercentage,
        results: markStatus==="Completed"?"View":"Add",
      };
    });
    setExamOptions(dumpList)
    setExamData(data);
    setFilteredData(data)
  };

  const handleModalClose = () => {
    setShowAddMarksModal(false);
    setShowExamDetailsModal(false)
    dispatch(selectExam(null));
  };
 
 


  const handleViewDetails = (exam) => {
    dispatch(selectExam({ ...exam, actions: null }));
    if(exam.markStatus==="Completed"){
      setShowExamDetailsModal(true)
    }else{
      setShowAddMarksModal(true);}
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (term) => {
    const filtered = examData.filter((item) =>
      columns.some((col) =>
        String(item[col.key]).toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };


  const handleFilter = (values) => {
    let filtered = examData;
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((rec) =>
          rec[key].toLowerCase().includes(value.toLowerCase())
        );
      }
    });
    setFilteredData(filtered);
  };

  const handleReset = (updatedValues) => {
    setFilteredData(examData);
    updatedValues("examName", "");
    updatedValues("class", "");
    updatedValues("section", "");
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
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
        {/* /Removed overflow-x-auto cloass */}
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
            <div className="relative shadow ring-1 ring-black/5 sm:rounded-lg">
              {/* /Removed overflow-hidden cloass */}
              <FilterComponent
                onSearch={handleSearch}
                filters={filters}
                filterForm={filterForm}
                handleFilter={handleFilter}
                handleReset={handleReset}
              />

              <div className="table-container-main max-h-[56vh]">
                {/* Table View 
                <table className="table-auto min-w-full divide-y divide-gray-300">
                  <thead className="sticky top-0 bg-purple-100 z-20">
                    <tr>
                      <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                        />
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                      >
                        <a href="#" className="group inline-flex">
                          Exam Name
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
                          Sections
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
                          Exam Dates
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
                          Marks Status
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
                          Pass Percentage
                        </a>
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <a href="#" className="group inline-flex">
                          Results
                        </a>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white z-1">
                    <tr>
                      <td className="relative px-7 sm:w-12 sm:px-6">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        name
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        1
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        A
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        {" "}
                        03/12/2024 - 09/12/2024
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-yellow-800">
                          Completed
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-yellow-800">
                          Pass-86%
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                        <a onClick={() => setOpen2(true)}>View</a>
                      </td>
                    </tr>

                    {examData.map((data) => (
                      <tr
                        key={data.email}
                        className={
                          selectedPeople.includes(data)
                            ? "bg-gray-50"
                            : undefined
                        }
                      >
                        <td className="relative px-7 sm:w-12 sm:px-6">
                          {selectedPeople.includes(data) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-purple-600" />
                          )}
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                            value={data.email}
                            checked={selectedPeople.includes(data)}
                            onChange={(e) =>
                              setSelectedPeople(
                                e.target.checked
                                  ? [...selectedPeople, data]
                                  : selectedPeople.filter((p) => p !== data)
                              )
                            }
                          />
                        </td>

                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {data.examName}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {data.section}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {data.examDates}
                        </td>

                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                            Pending
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                            Pass-86%
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-purple-500">
                          <a onClick={() => handleAddButton(data)}>Add</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>*/}

                <TableComponent
                  columns={columns}
                  data={paginatedData}
                  pagination={{
                    currentPage,
                    totalPages: Math.ceil(examData.length / rowsPerPage),
                    onPageChange: handlePageChange,
                  }}
                  modalColumn={["results"]}
                  showModal={(data) => handleViewDetails(data)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={showAddMarksModal} onClose={handleModalClose} className="relative z-50">
        <ManageExamMarks onClose={handleModalClose} />
      </Dialog>
      <Dialog open={showExamDetailsModal} onClose={handleModalClose} className="relative z-50">
        <ExamMarkDetailsPage onClose={handleModalClose} />
      </Dialog>
    </>
  );
}

export default ManageExamResults;
