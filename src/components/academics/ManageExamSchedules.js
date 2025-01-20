"use client";
import { Button, Dialog } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectExam } from "../../app/reducers/examSlice";
import FilterComponent from "../../commonComponent/FilterComponent";
import TableComponent from "../../commonComponent/TableComponent";
import ExamDetailsPage from "./ExamDetailsPage";

function ManageExamSchedules() {
  const { classes: classOptions, sections: sectionOptions } = useSelector(
    (state) => state.academics
  );
  const exams = useSelector((state) => state.exams.exams);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [showExamDetailsModal, setShowExamDetailsModal] = useState(false);
  const [examData, setExamData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const columns = [
    { key: "examName", title: "Exam Name" },
    { key: "className", title: "Class" },
    { key: "sectionName", title: "Section" },
    { key: "examDates", title: "Exam Dates" },
    { key: "totalSubjects", title: "Subjects Included" },
    { key: "timeTableSyllabus", title: "Time Table/ Syllabus" },
    { key: "hallTickets", title: "Hall tickets" },
    { key: "actions", title: "Actions" },
  ];

  const filterForm = {
    examName: "",
    class: "",
    section: "",
  };

  const filters = {
    examName: { options: [] },
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

  const formatExamData = async () => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const data = exams.map((item, index) => {
      // Formatting the timeTable data
      const timeTableFormatted = item.timeTable.map((t) => ({
        subject: t.subject,
        examDate: formatter.format(new Date(t.examDate)),
        startTime: t.startTime,
        endTime: t.endTime,
        passMark: t.passMark,
        totalMark: t.totalMark,
        syllabus: t.syllabus,
      }));

      return {
        id: index + 1,
        examName: item.name,
        class: item.class?._id,
        className: item.class?.name,
        classObject: item.class,
        section: item.section?._id,
        sectionName: item.section?.section,
        sectionObject: item.section,
        examDates: `${formatter.format(
          new Date(item.startDate)
        )} - ${formatter.format(new Date(item.endDate))}`,
        board: item.board,
        classCategory: item.classCategory,
        timeTable: timeTableFormatted, // Add the formatted timeTable data
        totalSubjects: item.timeTable.length,
        timeTableSyllabus: "View",
        hallTickets: "View",
        actions: [
          { label: "Edit", actionHandler: onHandleEdit },
          { label: "Delete", actionHandler: onDelete },
        ],
      };
    });
    setExamData(data);
    setFilteredData(data);
  };

  const onHandleEdit = async () => {
    console.log("edit");
  };

  const onDelete = () => {
    console.log("delete");
  };

  const handleViewDetails = (exam) => {
    dispatch(selectExam({ ...exam, actions: null }));
    setShowExamDetailsModal(true);
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

  const handleModalClose = () => setShowExamDetailsModal(false);

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
              
              <FilterComponent
                onSearch={handleSearch}
                filters={filters}
                filterForm={filterForm}
                handleFilter={handleFilter}
                handleReset={handleReset}
              />

              <div className="table-container-main max-h-[56vh]">
                <TableComponent
                  columns={columns}
                  data={paginatedData}
                  pagination={{
                    currentPage,
                    totalPages: Math.ceil(examData.length / rowsPerPage),
                    onPageChange: handlePageChange,
                  }}
                  modalColumn={["timeTableSyllabus", "hallTickets"]}
                  showModal={(data) => handleViewDetails(data)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={showExamDetailsModal}
        onClose={handleModalClose}
        className="relative z-50"
      >
        <ExamDetailsPage onClose={handleModalClose} />
      </Dialog>
    </>
  );
}

export default ManageExamSchedules;
