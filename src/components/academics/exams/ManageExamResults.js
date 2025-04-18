"use client";
import {
  ArrowDownTrayIcon
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

import {
  Dialog
} from "@headlessui/react";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../../../app/api";
import { selectExam, selectExamDetails } from "../../../app/reducers/examSlice";
import { MARKS } from "../../../app/url";
import { capitalizeWords, handleApiResponse, handleDownloadPDF } from "../../../commonComponent/CommonFunctions";
import FilterComponent from "../../../commonComponent/FilterComponent";
import TableComponent from "../../../commonComponent/TableComponent";
import AddExamMarks from "./AddExamMarks";
import ExamMarkDetailsPage from "./ExamMarkDetailsPage";

function ManageExamResults() {
  const { classes: classOptions, sections: sectionOptions, subjects } = useSelector(
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
  const { branchData } = useSelector((state) => state.appConfig)


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
  }, [exams]);


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
        label: item.name,
        value: item.name
      })
      const isPassed = moment().isAfter(moment(item.endDate, "YYYY-MM-DD"));
      const markStatus = isPassed ? capitalizeWords(item.examStatus) : "Not Yet Started";
      let passPercentage = "-"
      if (markStatus === "Completed") {
        passPercentage = getPercentage(item.timeTable)
      }
      return {
        _id: item._id,
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
        markStatus: markStatus,
        passPercentage: passPercentage,
        results: markStatus === "Completed" ? "View" : "Add",
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
    if (exam.markStatus === "Completed") {
      getExamMarks(exam);
    } else {
      if (exam.markStatus === "Pending") setShowAddMarksModal(true);
    }
  };

  const getExamMarks = async (exam) => {
    try {
      let res = await getData(`${MARKS}?examId=${exam._id}`);
      dispatch(selectExamDetails(res.data.data));
      setShowExamDetailsModal(true);
    } catch (error) {
      handleApiResponse(error)
    }

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
    setCurrentPage(1)
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
    setCurrentPage(1)
    setFilteredData(filtered);
  };

  const handleReset = (updatedValues) => {
    setFilteredData(examData);
    updatedValues("examName", "");
    updatedValues("class", "");
    updatedValues("section", "");
    setCurrentPage(1)
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const downloadList = () => {
    handleDownloadPDF(filteredData, "Exam_Details", [
      { key: "examName", label: "Exam Name" },
      { key: "className", label: "Class" },
      { key: "sectionName", label: "Section" },
      { key: "examDates", label: "Exam Dates" },
      { key: "markStatus", label: "Marks Status" },
      { key: "passPercentage", label: "Pass Percentage" },
    ], "Exam Details Report", branchData, undefined, "portrait");
  };

  return (
    <>
      <div className="right-btns-blk space-x-4 float-right">
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
        >
          <ArrowDownTrayIcon aria-hidden="true" className="size-5" />
          Generate Progress Card
        </button>
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
                modalColumn={["results"]}
                showModal={(data) => handleViewDetails(data)}
              />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showAddMarksModal} onClose={handleModalClose} className="relative z-50">
        <AddExamMarks onClose={handleModalClose} />
      </Dialog>
      <Dialog open={showExamDetailsModal} onClose={handleModalClose} className="relative z-50">
        <ExamMarkDetailsPage onClose={handleModalClose} />
      </Dialog>
    </>
  );
}

export default ManageExamResults;
